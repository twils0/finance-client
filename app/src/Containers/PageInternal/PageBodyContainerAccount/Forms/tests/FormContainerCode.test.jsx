import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import { initialState as initialStateAuth } from '../../../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIAccount } from '../../../../../Reducers/uiReducersAccount';
import { requestStatusTypes } from '../../../../../Constants/universalConstants';
import { statusNames } from '../../../../../Constants/dataConstantsAuth';
import { errorMessages } from '../../../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIAccount,
  formNames,
  inputNames,
} from '../../../../../Constants/uiConstantsAccount';

import FormContainerCode from '../FormContainerCode';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const heightRef = jest.fn();
const setHeight = jest.fn();
const clearElement = jest.fn();

const codePhone = '123456';

const shallowComponent = store =>
  shallow(
    <FormContainerCode heightRef={heightRef} setHeight={setHeight} clearElement={clearElement} />,
    {
      context: {
        store,
      },
    },
  ).dive();

describe('Containers', () => {
  describe('PageInternal', () => {
    describe('PageBodyContainerAccount', () => {
      describe('Forms', () => {
        describe('FormContainerCode', () => {
          afterEach(() => {
            heightRef.mockReset();
            setHeight.mockReset();
            clearElement.mockReset();
          });

          it('shallow renders correctly', async () => {
            const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));

            const store = mockStore({
              data: {
                auth: stateBeforeAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const expectedActions = [];

            const wrapper = shallowComponent(store);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
            expect(setHeight).toBeCalledWith(formNames.CODE);
          });

          it('shallow renders correctly, with componentWillUpdate, componentDidUpdate, and componentWillUnmount', async () => {
            const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE].value = codePhone;

            const store = mockStore({
              data: {
                auth: stateBeforeAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const nextProps = {
              statusAuth: {
                [statusNames.VERIFY_PHONE_CODE]: {
                  status: requestStatusTypes.LOADING,
                },
              },
              clearElement,
            };

            const expectedActions = [];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.componentWillUpdate(nextProps);
            instance.componentDidUpdate();
            instance.componentWillUnmount();

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
            expect(setHeight).toBeCalledWith(formNames.CODE);
            expect(clearElement).toBeCalledWith(formNames.CODE);
            expect(setHeight).toBeCalledWith(formNames.CODE);
            expect(clearElement).toBeCalledWith(formNames.CODE);
            expect(setHeight).toHaveBeenCalledTimes(2);
            expect(clearElement).toHaveBeenCalledTimes(2);
          });

          it('shallow renders correctly, with loading indicator', async () => {
            const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));

            stateBeforeAuth.status[statusNames.VERIFY_PHONE_CODE].status =
              requestStatusTypes.LOADING;

            const store = mockStore({
              data: {
                auth: stateBeforeAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const expectedActions = [];

            const wrapper = shallowComponent(store);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with no phone code', async () => {
            const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE].errorMessage =
              errorMessages.NO_VERIFICATION_CODE_PHONE;

            const store = mockStore({
              data: {
                auth: stateBeforeAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiCodePhone = JSON.parse(
              JSON.stringify(forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE]),
            );

            uiCodePhone.value = codePhone;
            uiCodePhone.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CODE].CODE_PHONE,
                value: codePhone,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiCodePhone,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with invalid phone verification code', async () => {
            const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            const wrongCodePhone = '1234';

            forms[formNames.CODE].inputs[
              inputNames[formNames.CODE].CODE_PHONE
            ].value = wrongCodePhone;
            forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE].errorMessage =
              errorMessages.INVALID_VERIFICATION_CODE;

            const store = mockStore({
              data: {
                auth: stateBeforeAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiCodePhone = JSON.parse(
              JSON.stringify(forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE]),
            );

            uiCodePhone.value = codePhone;
            uiCodePhone.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CODE].CODE_PHONE,
                value: codePhone,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiCodePhone,
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
            const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE].errorMessage =
              errorMessages.INTERNAL_ERROR;

            const store = mockStore({
              data: {
                auth: stateBeforeAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiCodePhone = JSON.parse(
              JSON.stringify(forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_EMAIL]),
            );

            uiCodePhone.value = codePhone;
            uiCodePhone.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CODE].CODE_EMAIL,
                value: codePhone,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiCodePhone,
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
