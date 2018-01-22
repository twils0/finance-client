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

import FormContainerDeleteAccount from '../FormContainerDeleteAccount';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const heightRef = jest.fn();
const setHeight = jest.fn();
const clearElement = jest.fn();

const deleteValue = 'delete';

const shallowComponent = store =>
  shallow(
    <FormContainerDeleteAccount
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
        describe('FormContainerDeleteAccount', () => {
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
            expect(setHeight).toBeCalledWith(formNames.DELETE_ACCOUNT);
          });

          it('shallow renders correctly, with componentWillUpdate, componentDidUpdate, and componentWillUnmount', async () => {
            const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            forms[formNames.DELETE_ACCOUNT].inputs[
              inputNames[formNames.DELETE_ACCOUNT].CONFIRM
            ].value = deleteValue;

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
                [statusNames.DELETE_ACCOUNT]: {
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
            expect(setHeight).toBeCalledWith(formNames.DELETE_ACCOUNT);
            expect(clearElement).toBeCalledWith(formNames.DELETE_ACCOUNT);
            expect(setHeight).toBeCalledWith(formNames.DELETE_ACCOUNT);
            expect(clearElement).toBeCalledWith(formNames.DELETE_ACCOUNT);
          });

          it('shallow renders correctly, with loading indicator', async () => {
            const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));

            stateBeforeAuth.status[statusNames.DELETE_ACCOUNT].status = requestStatusTypes.LOADING;

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

          it('shallow renders correctly and calls handleInputChange, with invalid delete account', async () => {
            const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            const wrongDeleteValue = 'del';

            forms[formNames.DELETE_ACCOUNT].inputs[
              inputNames[formNames.DELETE_ACCOUNT].CONFIRM
            ].value = wrongDeleteValue;
            forms[formNames.DELETE_ACCOUNT].inputs[
              inputNames[formNames.DELETE_ACCOUNT].CONFIRM
            ].errorMessage =
              errorMessages.INVALID_DELETE_ACCOUNT;

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

            const uiDeleteAccountConfirm = JSON.parse(
              JSON.stringify(
                forms[formNames.DELETE_ACCOUNT].inputs[
                  inputNames[formNames.DELETE_ACCOUNT].CONFIRM
                ],
              ),
            );

            uiDeleteAccountConfirm.value = deleteValue;
            uiDeleteAccountConfirm.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.DELETE_ACCOUNT].CONFIRM,
                value: deleteValue,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiDeleteAccountConfirm,
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

            forms[formNames.DELETE_ACCOUNT].inputs[
              inputNames[formNames.DELETE_ACCOUNT].CONFIRM
            ].errorMessage =
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

            const uiDeleteAccountConfirm = JSON.parse(
              JSON.stringify(
                forms[formNames.DELETE_ACCOUNT].inputs[
                  inputNames[formNames.DELETE_ACCOUNT].CONFIRM
                ],
              ),
            );

            uiDeleteAccountConfirm.value = deleteValue;
            uiDeleteAccountConfirm.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.DELETE_ACCOUNT].CONFIRM,
                value: deleteValue,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiDeleteAccountConfirm,
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
