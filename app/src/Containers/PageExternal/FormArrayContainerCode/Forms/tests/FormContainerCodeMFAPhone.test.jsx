import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import { initialState as initialStateAuth } from '../../../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIExternal } from '../../../../../Reducers/uiReducersExternal';
import { requestStatusTypes } from '../../../../../Constants/universalConstants';
import { statusNames } from '../../../../../Constants/dataConstantsAuth';
import { errorMessages } from '../../../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../../../Constants/uiConstantsExternal';

import FormContainerCodeMFAPhone from '../FormContainerCodeMFAPhone';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const heightRef = jest.fn();
const setHeight = jest.fn();
const clearElement = jest.fn();

const code = '123456';

const shallowComponent = store =>
  shallow(
    <FormContainerCodeMFAPhone
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
  describe('PageExternal', () => {
    describe('FormArrayContainerCode', () => {
      describe('Forms', () => {
        describe('FormContainerCodeMFAPhone', () => {
          afterEach(() => {
            heightRef.mockReset();
            setHeight.mockReset();
            clearElement.mockReset();
          });

          it('shallow renders correctly', async () => {
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
              },
            });

            const expectedActions = [];

            const wrapper = shallowComponent(store);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
            expect(setHeight).toBeCalledWith(formNames.CODE_MFA_PHONE);
          });

          it('shallow renders correctly, with componentWillUpdate, componentDidUpdate, and componentWillUnmount', async () => {
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
              },
            });

            const nextProps = {
              statusAuth: {
                [statusNames.LOGIN_MFA]: {
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
            expect(setHeight).toBeCalledWith(formNames.CODE_MFA_PHONE);
            expect(clearElement).toBeCalledWith(formNames.CODE_MFA_PHONE);
            expect(setHeight).toBeCalledWith(formNames.CODE_MFA_PHONE);
            expect(clearElement).toBeCalledWith(formNames.CODE_MFA_PHONE);
            expect(setHeight).toHaveBeenCalledTimes(2);
            expect(clearElement).toHaveBeenCalledTimes(2);
          });

          it('shallow renders correctly, with loading indicator', async () => {
            const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));

            stateBeforeAuth.status[statusNames.LOGIN_MFA].status = requestStatusTypes.LOADING;

            const store = mockStore({
              data: {
                auth: stateBeforeAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
              },
            });

            const expectedActions = [];

            const wrapper = shallowComponent(store);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with no phone verification code error', async () => {
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
            const { forms } = stateBeforeUIExternal;

            forms[formNames.CODE_MFA_PHONE].inputs[
              inputNames[formNames.CODE_MFA_PHONE].CODE
            ].errorMessage =
              errorMessages.NO_VERIFICATION_CODE_PHONE;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
              },
            });

            const uiCode = JSON.parse(
              JSON.stringify(
                forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE],
              ),
            );

            uiCode.value = code;
            uiCode.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CODE_MFA_PHONE].CODE,
                value: code,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
                payload: uiCode,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with no phone confirmation code error', async () => {
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
            const { forms } = stateBeforeUIExternal;

            forms[formNames.CODE_MFA_PHONE].inputs[
              inputNames[formNames.CODE_MFA_PHONE].CODE
            ].errorMessage =
              errorMessages.NO_CONFIRMATION_CODE_PHONE;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
              },
            });

            const uiCode = JSON.parse(
              JSON.stringify(
                forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE],
              ),
            );

            uiCode.value = code;
            uiCode.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CODE_MFA_PHONE].CODE,
                value: code,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
                payload: uiCode,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with invalid phone verification code error', async () => {
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
            const { forms } = stateBeforeUIExternal;

            forms[formNames.CODE_MFA_PHONE].inputs[
              inputNames[formNames.CODE_MFA_PHONE].CODE
            ].errorMessage =
              errorMessages.INVALID_VERIFICATION_CODE;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
              },
            });

            const uiCode = JSON.parse(
              JSON.stringify(
                forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE],
              ),
            );

            uiCode.value = code;
            uiCode.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CODE_MFA_PHONE].CODE,
                value: code,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
                payload: uiCode,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with invalid phone confirmation code error', async () => {
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
            const { forms } = stateBeforeUIExternal;

            forms[formNames.CODE_MFA_PHONE].inputs[
              inputNames[formNames.CODE_MFA_PHONE].CODE
            ].errorMessage =
              errorMessages.INVALID_CONFIRMATION_CODE;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
              },
            });

            const uiCode = JSON.parse(
              JSON.stringify(
                forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE],
              ),
            );

            uiCode.value = code;
            uiCode.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CODE_MFA_PHONE].CODE,
                value: code,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
                payload: uiCode,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with unexpected error', async () => {
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
            const { forms } = stateBeforeUIExternal;

            forms[formNames.CODE_MFA_PHONE].inputs[
              inputNames[formNames.CODE_MFA_PHONE].CODE
            ].errorMessage =
              errorMessages.INTERNAL_ERROR;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
              },
            });

            const uiCode = JSON.parse(
              JSON.stringify(
                forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE],
              ),
            );

            uiCode.value = code;
            uiCode.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.CODE_MFA_PHONE].CODE,
                value: code,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
                payload: uiCode,
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
