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
import secondButtonCodeMFAPhone from '../secondButtonCodeMFAPhone';

const history = {
  replace: jest.fn(),
};

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const codePayload = {
  history,
};

const codeMFA = '234567';
const email = 'test@test.com';
const password = 'testPassword1!';

describe('uiThunkExternal', () => {
  describe('secondButtonCodeMFAPhone', () => {
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
        await store.dispatch(secondButtonCodeMFAPhone(emptyPayload));
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
      status[statusNames.SIGN_OUT_DEVICES].status = requestStatusTypes.SUCCESS;

      forms[formNames.CODE_MFA_PHONE].inputs[
        inputNames[formNames.CODE_MFA_PHONE].CODE
      ].value = codeMFA;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const codeCodeMFAPhone = forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];

      const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadCodeCodeMFAPhone = JSON.parse(JSON.stringify(codeCodeMFAPhone));
      const payloadLoginEmail = JSON.parse(JSON.stringify(loginEmail));
      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadCodeCodeMFAPhone.value = '';
      payloadCodeCodeMFAPhone.errorMessage = '';

      payloadLoginEmail.value = '';
      payloadLoginEmail.errorMessage = '';

      payloadLoginPassword.value = '';
      payloadLoginPassword.errorMessage = '';

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
          payload: payloadLoginEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginPassword,
        },
      ];

      const result = await store.dispatch(secondButtonCodeMFAPhone(codePayload));

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

      const result = await store.dispatch(secondButtonCodeMFAPhone(codePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
    });
  });
});
