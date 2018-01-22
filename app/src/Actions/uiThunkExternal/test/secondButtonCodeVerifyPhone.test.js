import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { requestStatusTypes, pathNames } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import secondButtonCodeVerifyPhone from '../secondButtonCodeVerifyPhone';

const history = {
  replace: jest.fn(),
};

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const codePayload = {
  history,
};

const codeVerify = '123456';
const codeMFA = '234567';
const email = 'test@test.com';
const password = 'testPassword1!';

describe('uiThunkAccount', () => {
  describe('secondButtonCodeVerifyPhone', () => {
    afterEach(() => {
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
        await store.dispatch(secondButtonCodeVerifyPhone(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('creates the correct actions with the correct payload, inputs all have values', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { status } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      status[statusNames.SIGN_UP].status = requestStatusTypes.SUCCESS;
      status[statusNames.LOGIN].status = requestStatusTypes.SUCCESS;
      status[statusNames.LOGIN_MFA].status = requestStatusTypes.SUCCESS;
      status[statusNames.VERIFY_PHONE].status = requestStatusTypes.SUCCESS;
      status[statusNames.SIGN_OUT_DEVICES].status = requestStatusTypes.SUCCESS;

      forms[formNames.CODE_MFA_PHONE].inputs[
        inputNames[formNames.CODE_MFA_PHONE].CODE
      ].value = codeMFA;
      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = codeVerify;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;

      const codeCodeMFAPhone =
        forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];
      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];
      const infoEmail = forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL];
      const forgotPasswordEmail =
        forms[formNames.FORGOT_PASSWORD].inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];

      const payloadCodeCodeMFAPhone = JSON.parse(JSON.stringify(codeCodeMFAPhone));
      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));
      const payloadLoginEmail = JSON.parse(JSON.stringify(loginEmail));
      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));
      const payloadInfoEmail = JSON.parse(JSON.stringify(infoEmail));
      const payloadForgotPasswordEmail = JSON.parse(JSON.stringify(forgotPasswordEmail));

      payloadCodeCodeMFAPhone.value = '';
      payloadCodeCodeMFAPhone.errorMessage = '';

      payloadCodeCodeVerifyPhone.value = '';
      payloadCodeCodeVerifyPhone.errorMessage = '';

      payloadLoginEmail.value = '';
      payloadLoginEmail.errorMessage = '';

      payloadLoginPassword.value = '';
      payloadLoginPassword.errorMessage = '';

      payloadInfoEmail.value = '';
      payloadInfoEmail.errorMessage = '';

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
            id: statusNames.LOGIN,
            status: requestStatusTypes.IDLE,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
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
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.IDLE,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeMFAPhone,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
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
          payload: payloadInfoEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadForgotPasswordEmail,
        },
      ];

      const result = await store.dispatch(secondButtonCodeVerifyPhone(codePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
    });

    it('creates the correct actions with the correct payload, inputs all are blank', async () => {
      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [];

      const result = await store.dispatch(secondButtonCodeVerifyPhone(codePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
    });
  });
});
