import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import { errorMessages } from '../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import requestResetPassword from '../../dataThunkAuth/requestResetPassword';
import firstButtonResetPassword from '../firstButtonResetPassword';

jest.mock('../../dataThunkAuth/requestResetPassword', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const code = '123456';
const email = 'test@test.com';
const password = 'testPassword1!';

describe('uiThunkExternal', () => {
  describe('firstButtonResetPassword', () => {
    afterEach(() => {
      requestResetPassword.mockReset();
    });

    it('creates the correct actions with the correct payload, no code and no password', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      const resetPasswordCode = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].CODE];
      const resetPasswordPassword = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD];
      const resetPasswordPassword2 = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD2];

      const payloadResetPasswordCode = JSON.parse(JSON.stringify(resetPasswordCode));
      const payloadResetPasswordPassword = JSON.parse(JSON.stringify(resetPasswordPassword));
      const payloadResetPasswordPassword2 = JSON.parse(JSON.stringify(resetPasswordPassword2));

      payloadResetPasswordCode.errorMessage = errorMessages.NO_VERIFICATION_CODE_PHONE;
      payloadResetPasswordPassword.errorMessage = errorMessages.NO_PASSWORD;

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordCode,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordPassword2,
        },
      ];

      requestResetPassword.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonResetPassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestResetPassword).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload, invalid password and passwords do not match', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].CODE
      ].value = code;
      forms[formNames.RESET_PASSWORD].inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD].value = 'password';
      forms[formNames.RESET_PASSWORD].inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD2].value = 'password1';

      const resetPasswordCode = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].CODE];
      const resetPasswordPassword = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD];
      const resetPasswordPassword2 = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD2];

      const payloadResetPasswordCode = JSON.parse(JSON.stringify(resetPasswordCode));
      const payloadResetPasswordPassword = JSON.parse(JSON.stringify(resetPasswordPassword));
      const payloadResetPasswordPassword2 = JSON.parse(JSON.stringify(resetPasswordPassword2));

      payloadResetPasswordPassword.errorMessage = errorMessages.INVALID_PASSWORD;
      payloadResetPasswordPassword2.errorMessage = errorMessages.NO_MATCH_PASSWORD;

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordCode,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordPassword2,
        },
      ];

      requestResetPassword.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonResetPassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestResetPassword).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].CODE
      ].value = code;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].PASSWORD
      ].value = password;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].PASSWORD2
      ].value = password;

      const forgotPasswordEmail = forms[formNames.FORGOT_PASSWORD]
        .inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];
      const resetPasswordCode = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].CODE];
      const resetPasswordPassword = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD];
      const resetPasswordPassword2 = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD2];

      const payloadForgotPasswordEmail = JSON.parse(JSON.stringify(forgotPasswordEmail));
      const payloadResetPasswordCode = JSON.parse(JSON.stringify(resetPasswordCode));
      const payloadResetPasswordPassword = JSON.parse(JSON.stringify(resetPasswordPassword));
      const payloadResetPasswordPassword2 = JSON.parse(JSON.stringify(resetPasswordPassword2));

      payloadForgotPasswordEmail.value = '';
      payloadForgotPasswordEmail.errorMessage = '';

      payloadResetPasswordCode.value = '';
      payloadResetPasswordCode.errorMessage = '';

      payloadResetPasswordPassword.value = '';
      payloadResetPasswordPassword.errorMessage = '';

      payloadResetPasswordPassword2.value = '';
      payloadResetPasswordPassword2.errorMessage = '';

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.LOGIN,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadForgotPasswordEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordCode,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordPassword2,
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.RESET_PASSWORD,
            status: requestStatusTypes.IDLE,
          },
        },
      ];

      requestResetPassword.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonResetPassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestResetPassword).toBeCalledWith({ email, code, password });
    });

    it("requestResetPassword throws a 'LimitExceededException' error", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].CODE
      ].value = code;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].PASSWORD
      ].value = password;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].PASSWORD2
      ].value = password;

      const resetPasswordPassword2 = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD2];

      const payloadResetPasswordPassword2 = JSON.parse(JSON.stringify(resetPasswordPassword2));

      payloadResetPasswordPassword2.errorMessage = errorMessages.LIMIT_EXCEEDED;

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'LimitExceededException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordPassword2,
        },
      ];

      requestResetPassword.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonResetPassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestResetPassword).toBeCalledWith({ email, code, password });
    });

    it("requestResetPassword throws a 'ExpiredCodeException' error", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].CODE
      ].value = code;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].PASSWORD
      ].value = password;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].PASSWORD2
      ].value = password;

      const resetPasswordPassword2 = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD2];

      const payloadResetPasswordPassword2 = JSON.parse(JSON.stringify(resetPasswordPassword2));

      payloadResetPasswordPassword2.errorMessage = errorMessages.EXPIRED_VERIFICATION_CODE;

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'ExpiredCodeException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordPassword2,
        },
      ];

      requestResetPassword.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonResetPassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestResetPassword).toBeCalledWith({ email, code, password });
    });

    it("requestResetPassword throws a 'CodeMismatchException' error", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].CODE
      ].value = code;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].PASSWORD
      ].value = password;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].PASSWORD2
      ].value = password;

      const resetPasswordPassword2 = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD2];

      const payloadResetPasswordPassword2 = JSON.parse(JSON.stringify(resetPasswordPassword2));

      payloadResetPasswordPassword2.errorMessage = errorMessages.INVALID_VERIFICATION_CODE;

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'CodeMismatchException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordPassword2,
        },
      ];

      requestResetPassword.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonResetPassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestResetPassword).toBeCalledWith({ email, code, password });
    });

    it('requestResetPassword throws an unexpected error', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].CODE
      ].value = code;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].PASSWORD
      ].value = password;
      forms[formNames.RESET_PASSWORD].inputs[
        inputNames[formNames.RESET_PASSWORD].PASSWORD2
      ].value = password;

      const resetPasswordPassword2 = forms[formNames.RESET_PASSWORD]
        .inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD2];

      const payloadResetPasswordPassword2 = JSON.parse(JSON.stringify(resetPasswordPassword2));

      payloadResetPasswordPassword2.errorMessage = errorMessages.INTERNAL_ERROR;

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'testCode',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadResetPasswordPassword2,
        },
      ];

      requestResetPassword.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonResetPassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestResetPassword).toBeCalledWith({ email, code, password });
    });
  });
});
