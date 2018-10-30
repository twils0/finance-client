/**
 * @jest-environment node
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { pathNames, requestStatusTypes } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesAuth,
  statusNames,
  codeTypeNames,
} from '../../../Constants/dataConstantsAuth';
import { errorMessages } from '../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import requestSignUpConfirmPhone from '../../dataThunkAuth/requestSignUpConfirmPhone';
import firstButtonCodeVerifyPhone from '../firstButtonCodeVerifyPhone';

jest.mock('../../dataThunkAuth/requestSignUpConfirmPhone', () => jest.fn());

const history = {
  replace: jest.fn(),
};

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const email = 'test@test.com';
const code = '123456';

describe('uiThunkExternal', () => {
  describe('firstButtonCodeVerifyPhone', () => {
    afterEach(() => {
      requestSignUpConfirmPhone.mockReset();
      history.replace.mockReset();
    });

    it("fails and throws an error when missing 'history' key in payload", async () => {
      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { external: initialStateUIExternal },
      });

      const emptyPayload = {};
      const expectedActions = [];

      try {
        await store.dispatch(firstButtonCodeVerifyPhone(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('creates the correct actions with the correct payload, no code', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));

      payloadCodeCodeVerifyPhone.errorMessage = errorMessages.NO_VERIFICATION_CODE_PHONE;

      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      const result = await store.dispatch(firstButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpConfirmPhone).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload, email from login form, login status success, email needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { status, codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      status[statusNames.LOGIN].status = requestStatusTypes.SUCCESS;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = true;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = code;

      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));

      payloadCodeCodeVerifyPhone.value = '';
      payloadCodeCodeVerifyPhone.errorMessage = '';

      const store = mockStore({
        data: { auth: stateBeforeAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.CODE_VERIFY_EMAIL,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpConfirmPhone.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpConfirmPhone).toBeCalledWith({
        email,
        code,
      });
    });

    it('creates the correct actions with the correct payload, email from login form, login and login mfa statuses success', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { status, codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      status[statusNames.LOGIN].status = requestStatusTypes.SUCCESS;
      status[statusNames.LOGIN_MFA].status = requestStatusTypes.SUCCESS;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = code;

      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));

      payloadCodeCodeVerifyPhone.value = '';
      payloadCodeCodeVerifyPhone.errorMessage = '';

      const store = mockStore({
        data: { auth: stateBeforeAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.DEVICE,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpConfirmPhone.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpConfirmPhone).toBeCalledWith({
        email,
        code,
      });
    });

    it('creates the correct actions with the correct payload, email from login form, login success', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { status, codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      status[statusNames.LOGIN].status = requestStatusTypes.SUCCESS;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = 'testPassword1!';
      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = code;

      const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];
      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));
      const payloadLoginEmail = JSON.parse(JSON.stringify(loginEmail));
      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadLoginEmail.value = '';
      payloadLoginEmail.errorMessage = '';

      payloadLoginPassword.value = '';
      payloadLoginPassword.errorMessage = '';

      payloadCodeCodeVerifyPhone.value = '';
      payloadCodeCodeVerifyPhone.errorMessage = '';

      const store = mockStore({
        data: { auth: stateBeforeAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTHENTICATED,
          payload: {
            authenticated: true,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpConfirmPhone.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpConfirmPhone).toBeCalledWith({
        email,
        code,
      });
    });

    it('creates the correct actions with the correct payload, email from info form, login status not success', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { status } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      status[statusNames.LOGIN].status = requestStatusTypes.IDLE;

      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = code;

      const infoEmail = forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL];
      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));
      const payloadInfoEmail = JSON.parse(JSON.stringify(infoEmail));

      payloadCodeCodeVerifyPhone.value = '';
      payloadCodeCodeVerifyPhone.errorMessage = '';

      payloadInfoEmail.value = '';
      payloadInfoEmail.errorMessage = '';

      const store = mockStore({
        data: { auth: stateBeforeAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_UP,
            status: requestStatusTypes.IDLE,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.IDLE,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpConfirmPhone.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpConfirmPhone).toBeCalledWith({
        email,
        code,
      });
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
    });

    it('creates the correct actions with the correct payload, email from forgot password form, login status not success', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { status } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      status[statusNames.LOGIN].status = requestStatusTypes.IDLE;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;
      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = code;

      const forgotPasswordEmail =
        forms[formNames.FORGOT_PASSWORD].inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];
      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));
      const payloadForgotPasswordEmail = JSON.parse(JSON.stringify(forgotPasswordEmail));

      payloadCodeCodeVerifyPhone.value = '';
      payloadCodeCodeVerifyPhone.errorMessage = '';

      payloadForgotPasswordEmail.value = '';
      payloadForgotPasswordEmail.errorMessage = '';

      const store = mockStore({
        data: { auth: stateBeforeAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_UP,
            status: requestStatusTypes.IDLE,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.IDLE,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadForgotPasswordEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpConfirmPhone.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpConfirmPhone).toBeCalledWith({
        email,
        code,
      });
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
    });

    it("requestSignUpConfirmPhone throws a 'Username cannot be empty' error as a string, email from forgot password form", async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { status } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      status[statusNames.LOGIN].status = requestStatusTypes.IDLE;

      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = code;

      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));

      payloadCodeCodeVerifyPhone.value = '';
      payloadCodeCodeVerifyPhone.errorMessage = '';

      const store = mockStore({
        data: { auth: stateBeforeAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const error = 'Username cannot be empty';
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpConfirmPhone.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpConfirmPhone).toBeCalledWith({
        email,
        code,
      });
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
    });

    it("requestSignUpConfirmPhone throws a 'LimitExceededException' error, email from forgot password form", async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { status } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      status[statusNames.LOGIN].status = requestStatusTypes.IDLE;

      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = code;

      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));

      payloadCodeCodeVerifyPhone.value = code;
      payloadCodeCodeVerifyPhone.errorMessage = errorMessages.LIMIT_EXCEEDED;

      const store = mockStore({
        data: { auth: stateBeforeAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'LimitExceededException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpConfirmPhone.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpConfirmPhone).toBeCalledWith({
        email,
        code,
      });
    });

    it("requestSignUpConfirmPhone throws a 'ExpiredCodeException' error, email from forgot password form", async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { status } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      status[statusNames.LOGIN].status = requestStatusTypes.IDLE;

      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = code;

      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));

      payloadCodeCodeVerifyPhone.value = code;
      payloadCodeCodeVerifyPhone.errorMessage = errorMessages.EXPIRED_VERIFICATION_CODE;

      const store = mockStore({
        data: { auth: stateBeforeAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'ExpiredCodeException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpConfirmPhone.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpConfirmPhone).toBeCalledWith({
        email,
        code,
      });
    });

    it("requestSignUpConfirmPhone throws a 'CodeMismatchException' error, email from info form", async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { status } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      status[statusNames.LOGIN].status = requestStatusTypes.IDLE;

      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = code;

      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));

      payloadCodeCodeVerifyPhone.value = code;
      payloadCodeCodeVerifyPhone.errorMessage = errorMessages.INVALID_VERIFICATION_CODE;

      const store = mockStore({
        data: { auth: stateBeforeAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'CodeMismatchException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpConfirmPhone.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpConfirmPhone).toBeCalledWith({
        email,
        code,
      });
    });

    it('requestSignUpConfirmPhone throws an unexpected error, email from forgot password form', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { status } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      status[statusNames.LOGIN].status = requestStatusTypes.IDLE;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;
      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = code;

      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));

      payloadCodeCodeVerifyPhone.value = code;
      payloadCodeCodeVerifyPhone.errorMessage = errorMessages.INTERNAL_ERROR;

      const store = mockStore({
        data: { auth: stateBeforeAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'testCode',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpConfirmPhone.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpConfirmPhone).toBeCalledWith({
        email,
        code,
      });
    });
  });
});
