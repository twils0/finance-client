import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import secondButtonResetPassword from '../secondButtonResetPassword';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const email = 'test@test.com';
const code = '123456';
const password = 'password1!';

describe('uiThunkAccount', () => {
  describe('secondButtonResetPassword', () => {
    it('creates the correct actions with the correct payload, inputs all have values', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { status } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      status[statusNames.FORGOT_PASSWORD].status = requestStatusTypes.SUCCESS;

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

      const forgotPasswordEmail =
        forms[formNames.FORGOT_PASSWORD].inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];
      const resetPasswordCode =
        forms[formNames.RESET_PASSWORD].inputs[inputNames[formNames.RESET_PASSWORD].CODE];
      const resetPasswordPassword =
        forms[formNames.RESET_PASSWORD].inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD];
      const resetPasswordPassword2 =
        forms[formNames.RESET_PASSWORD].inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD2];

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
        data: { auth: stateBeforeAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadForgotPasswordEmail,
        },
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.LOGIN,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.FORGOT_PASSWORD,
            status: requestStatusTypes.IDLE,
          },
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
      ];

      const result = await store.dispatch(secondButtonResetPassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with the correct payload, inputs all are blank', async () => {
      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.LOGIN,
          },
        },
      ];

      const result = await store.dispatch(secondButtonResetPassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });
  });
});
