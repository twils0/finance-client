import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import { initialState as initialStateAccount } from '../../../../../Reducers/dataReducersAccount';
import { initialState as initialStateUIAccount } from '../../../../../Reducers/uiReducersAccount';
import { requestStatusTypes } from '../../../../../Constants/universalConstants';
import {
  statusNames,
  fieldNames,
} from '../../../../../Constants/dataConstantsAccount';
import { errorMessages } from '../../../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIAccount,
  formNames,
  inputNames,
} from '../../../../../Constants/uiConstantsAccount';

import FormContainerProfile from '../FormContainerProfile';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const heightRef = jest.fn();
const setHeight = jest.fn();
const clearElement = jest.fn();

const name = 'testName';
const email = 'test@test.com';
const emailAdditional = 'test1@test.com';
const phone = '+12395550000';
const formattedPhone = '239-555-0000';

const shallowComponent = store =>
  shallow(
    <FormContainerProfile
      heightRef={heightRef}
      setHeight={setHeight}
      clearElement={clearElement}
    />,
    {
      context: {
        store,
      },
    },
  )
    .dive();

describe('Containers', () => {
  describe('PageInternal', () => {
    describe('PageBodyContainerAccount', () => {
      describe('Forms', () => {
        describe('FormContainerProfile', () => {
          afterEach(() => {
            heightRef.mockReset();
            setHeight.mockReset();
            clearElement.mockReset();
          });

          it('shallow renders correctly', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            stateBeforeAccount.fields[fieldNames.NAME].value = name;
            stateBeforeAccount.fields[fieldNames.EMAIL].value = email;
            stateBeforeAccount.fields[fieldNames.PHONE].value = phone;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiName = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].NAME]));
            const uiEmail = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));
            const uiEmailAdditional = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]));
            const uiPhone = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));

            uiName.value = name;
            uiEmail.value = email;
            uiPhone.value = formattedPhone;

            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiName,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmail,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailAdditional,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhone,
              },
            ];

            const wrapper = shallowComponent(store);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
            expect(setHeight).toBeCalledWith(formNames.PROFILE);
          });

          it('shallow renders correctly, with componentWillUpdate, componentDidUpdate, and componentWillUnmount', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            stateBeforeAccount.fields[fieldNames.NAME].value = name;
            stateBeforeAccount.fields[fieldNames.EMAIL].value = email;
            stateBeforeAccount.fields[fieldNames.EMAIL_ADDITIONAL].value = emailAdditional;
            stateBeforeAccount.fields[fieldNames.PHONE].value = phone;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiName = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].NAME]));
            const uiEmail = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));
            const uiEmailAdditional = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]));
            const uiPhone = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));

            uiName.value = name;
            uiEmail.value = email;
            uiEmailAdditional.value = emailAdditional;
            uiPhone.value = formattedPhone;

            const nextProps = {
              statusAccount: {
                [statusNames.UPDATE_AWS_FIELDS]: {
                  status: requestStatusTypes.LOADING,
                },
              },
              clearElement,
            };

            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiName,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmail,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailAdditional,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhone,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.componentWillUpdate(nextProps);
            instance.componentDidUpdate();
            instance.componentWillUnmount();

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
            expect(setHeight).toBeCalledWith(formNames.PROFILE);
            expect(clearElement).toBeCalledWith(formNames.PROFILE);
            expect(setHeight).toBeCalledWith(formNames.PROFILE);
            expect(clearElement).toBeCalledWith(formNames.PROFILE);
            expect(setHeight).toHaveBeenCalledTimes(2);
            expect(clearElement).toHaveBeenCalledTimes(2);
          });

          it('shallow renders correctly, with loading indicator', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            stateBeforeAccount.status[statusNames.UPDATE_AWS_FIELDS].status =
              requestStatusTypes.LOADING;

            stateBeforeAccount.fields[fieldNames.NAME].value = name;
            stateBeforeAccount.fields[fieldNames.EMAIL].value = email;
            stateBeforeAccount.fields[fieldNames.EMAIL_ADDITIONAL].value = emailAdditional;
            stateBeforeAccount.fields[fieldNames.PHONE].value = phone;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiName = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].NAME]));
            const uiEmail = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));
            const uiEmailAdditional = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]));
            const uiPhone = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));

            uiName.value = name;
            uiEmail.value = email;
            uiEmailAdditional.value = emailAdditional;
            uiPhone.value = formattedPhone;

            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiName,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmail,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailAdditional,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhone,
              },
            ];

            const wrapper = shallowComponent(store);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with no name error', async () => {
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME].errorMessage =
              errorMessages.NO_NAME;

            const store = mockStore({
              data: {
                account: initialStateAccount,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiName = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].NAME]));
            const uiEmail = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));
            const uiEmailAdditional = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]));
            const uiPhone = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));
            const uiNameChange = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].NAME]));

            uiNameChange.value = name;
            uiNameChange.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.PROFILE].NAME,
                value: name,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiName,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmail,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailAdditional,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhone,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNameChange,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with no email error', async () => {
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL].errorMessage =
              errorMessages.NO_EMAIL;

            const store = mockStore({
              data: {
                account: initialStateAccount,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiName = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].NAME]));
            const uiEmail = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));
            const uiEmailAdditional = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]));
            const uiPhone = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));
            const uiEmailChange = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));

            uiEmailChange.value = email;
            uiEmailChange.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.PROFILE].EMAIL,
                value: email,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiName,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmail,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailAdditional,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhone,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailChange,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with invalid email error', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            const wrongEmail = 'test';

            stateBeforeAccount.fields[fieldNames.EMAIL].value = wrongEmail;

            forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL].errorMessage =
              errorMessages.INVALID_EMAIL;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiName = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].NAME]));
            const uiEmail = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));
            const uiEmailAdditional = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]));
            const uiPhone = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));
            const uiEmailChange = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));

            uiEmail.value = wrongEmail;

            uiEmailChange.value = email;
            uiEmailChange.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.PROFILE].EMAIL,
                value: email,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiName,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmail,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailAdditional,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhone,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailChange,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with invalid email error and email additional input', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            const wrongEmail = 'test';

            stateBeforeAccount.fields[fieldNames.EMAIL_ADDITIONAL].value = wrongEmail;

            forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL].errorMessage =
              errorMessages.INVALID_EMAIL;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiName = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].NAME]));
            const uiEmail = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));
            const uiEmailAdditional = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]));
            const uiPhone = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));
            const uiEmailAdditionalChange = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]));

            uiEmailAdditional.value = wrongEmail;

            uiEmailAdditionalChange.value = emailAdditional;
            uiEmailAdditionalChange.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.PROFILE].EMAIL_ADDITIONAL,
                value: emailAdditional,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiName,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmail,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailAdditional,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhone,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailAdditionalChange,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with email in use internal error', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            stateBeforeAccount.fields[fieldNames.EMAIL].value = email;

            forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL].errorMessage =
              errorMessages.EMAIL_IN_USE_INTERNAL;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiName = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].NAME]));
            const uiEmail = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));
            const uiEmailAdditional = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]));
            const uiPhone = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));
            const uiEmailChange = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));

            uiEmail.value = email;

            uiEmailChange.value = email;
            uiEmailChange.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.PROFILE].EMAIL,
                value: email,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiName,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmail,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailAdditional,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhone,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailChange,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with no phone error', async () => {
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE].errorMessage =
              errorMessages.NO_PHONE;

            const store = mockStore({
              data: {
                account: initialStateAccount,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiName = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].NAME]));
            const uiEmail = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));
            const uiEmailAdditional = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]));
            const uiPhone = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));
            const uiPhoneChange = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));

            uiPhoneChange.value = phone;
            uiPhoneChange.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.PROFILE].PHONE,
                value: phone,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiName,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmail,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailAdditional,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhone,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhoneChange,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with invalid phone error', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            const wrongE164Phone = '+10000000000';
            const wrongPhone = '000-000-0000';

            stateBeforeAccount.fields[fieldNames.PHONE].value = wrongE164Phone;

            forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE].errorMessage =
              errorMessages.INVALID_PHONE;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiName = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].NAME]));
            const uiEmail = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));
            const uiEmailAdditional = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]));
            const uiPhone = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));
            const uiPhoneChange = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));

            uiPhone.value = wrongPhone;

            uiPhoneChange.value = phone;
            uiPhoneChange.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.PROFILE].PHONE,
                value: phone,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiName,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmail,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailAdditional,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhone,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhoneChange,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with undefined error', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            const wrongE164Phone = '+10000000000';
            const wrongPhone = '000-000-0000';

            stateBeforeAccount.fields[fieldNames.PHONE].value = wrongE164Phone;

            forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE].errorMessage =
              errorMessages.INTERNAL_ERROR;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiName = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].NAME]));
            const uiEmail = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL]));
            const uiEmailAdditional = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]));
            const uiPhone = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));
            const uiPhoneChange = JSON.parse(JSON.stringify(forms[formNames.PROFILE]
              .inputs[inputNames[formNames.PROFILE].PHONE]));

            uiPhone.value = wrongPhone;

            uiPhoneChange.value = formattedPhone;
            uiPhoneChange.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.PROFILE].PHONE,
                value: formattedPhone,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiName,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmail,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiEmailAdditional,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhone,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPhoneChange,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });
        });
      });
    });
  });
});
