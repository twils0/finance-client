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

import FormContainerChangePassword from '../FormContainerChangePassword';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const heightRef = jest.fn();
const setHeight = jest.fn();
const clearElement = jest.fn();

const oldPassword = 'testOldPassword1!';
const password = 'testPassword1!';

const shallowComponent = store => shallow(
  <FormContainerChangePassword
    heightRef={heightRef}
    setHeight={setHeight}
    clearElement={clearElement}
  />,
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
        describe('FormContainerChangePassword', () => {
          afterEach(() => {
            heightRef.mockReset();
            setHeight.mockReset();
            clearElement.mockReset();
          });

          it('shallow renders correctly', async () => {
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));

            const store = mockStore({
              data: {
                auth: initialStateAuth,
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
            expect(setHeight).toBeCalledWith(formNames.CHANGE_PASSWORD);
          });

          it('shallow renders correctly, with componentWillUpdate, componentDidUpdate, and componentWillUnmount', async () => {
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const nextProps = {
              statusAuth: {
                [statusNames.CHANGE_PASSWORD]: {
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
            expect(setHeight).toBeCalledWith(formNames.CHANGE_PASSWORD);
            expect(clearElement).toBeCalledWith(formNames.CHANGE_PASSWORD);
            expect(setHeight).toBeCalledWith(formNames.CHANGE_PASSWORD);
            expect(clearElement).toBeCalledWith(formNames.CHANGE_PASSWORD);
            expect(setHeight).toHaveBeenCalledTimes(2);
            expect(clearElement).toHaveBeenCalledTimes(2);
          });

          it('shallow renders correctly, with loading indicator', async () => {
            const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));

            stateBeforeAuth.status[statusNames.CHANGE_PASSWORD].status = requestStatusTypes.LOADING;

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

          it('shallow renders correctly and calls handleInputChange, with no password error', async () => {
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            forms[formNames.CHANGE_PASSWORD].inputs[
              inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD
            ].errorMessage = errorMessages.NO_PASSWORD;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiOldPassword = JSON.parse(
              JSON.stringify(
                forms[formNames.CHANGE_PASSWORD].inputs[
                  inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD
                ],
              ),
            );

            uiOldPassword.value = oldPassword;
            uiOldPassword.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD,
                value: oldPassword,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiOldPassword,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with no new password error', async () => {
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            forms[formNames.CHANGE_PASSWORD].inputs[
              inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
            ].errorMessage = errorMessages.NO_NEW_PASSWORD;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiNewPassword = JSON.parse(
              JSON.stringify(
                forms[formNames.CHANGE_PASSWORD].inputs[
                  inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
                ],
              ),
            );

            uiNewPassword.value = password;
            uiNewPassword.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD,
                value: password,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNewPassword,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with invalid password error', async () => {
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            const wrongPassword = 'test';

            forms[formNames.CHANGE_PASSWORD].inputs[
              inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
            ].value = wrongPassword;
            forms[formNames.CHANGE_PASSWORD].inputs[
              inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
            ].errorMessage = errorMessages.INVALID_PASSWORD;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiNewPassword = JSON.parse(
              JSON.stringify(
                forms[formNames.CHANGE_PASSWORD].inputs[
                  inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
                ],
              ),
            );

            uiNewPassword.value = password;

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD,
                value: password,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNewPassword,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with no match password', async () => {
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            forms[formNames.CHANGE_PASSWORD].inputs[
              inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
            ].value = password;
            forms[formNames.CHANGE_PASSWORD].inputs[
              inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
            ].value = password;
            forms[formNames.CHANGE_PASSWORD].inputs[
              inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
            ].errorMessage = errorMessages.NO_MATCH_PASSWORD;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiNewPassword2 = JSON.parse(
              JSON.stringify(
                forms[formNames.CHANGE_PASSWORD].inputs[
                  inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
                ],
              ),
            );

            uiNewPassword2.value = password;
            uiNewPassword2.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2,
                value: password,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNewPassword2,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with password not found', async () => {
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            const wrongPassword = 'test';

            forms[formNames.CHANGE_PASSWORD].inputs[
              inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
            ].value = wrongPassword;
            forms[formNames.CHANGE_PASSWORD].inputs[
              inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
            ].errorMessage = errorMessages.PASSWORD_NOT_FOUND;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiNewPassword = JSON.parse(
              JSON.stringify(
                forms[formNames.CHANGE_PASSWORD].inputs[
                  inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
                ],
              ),
            );

            uiNewPassword.value = password;
            uiNewPassword.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD,
                value: password,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNewPassword,
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
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            forms[formNames.CHANGE_PASSWORD].inputs[
              inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
            ].errorMessage = errorMessages.INTERNAL_ERROR;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiNewPassword2 = JSON.parse(
              JSON.stringify(
                forms[formNames.CHANGE_PASSWORD].inputs[
                  inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
                ],
              ),
            );

            uiNewPassword2.value = password;
            uiNewPassword2.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2,
                value: password,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNewPassword2,
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
