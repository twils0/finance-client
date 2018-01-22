import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { pathNames } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import requestSignUpResendPhone from '../../dataThunkAuth/requestSignUpResendPhone';
import resendButtonCodeVerifyPhone from '../resendButtonCodeVerifyPhone';

const history = {
  replace: jest.fn(),
};
jest.mock('../../dataThunkAuth/requestSignUpResendPhone', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const email = 'test@test.com';
const code = '123456';

describe('uiThunkExternal', () => {
  describe('resendButtonCodeVerifyPhone', () => {
    afterEach(() => {
      requestSignUpResendPhone.mockReset();
      history.replace.mockReset();
    });

    it("fails and throws an error when missing 'history' key in payload", async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const emptyPayload = {};
      const expectedActions = [];

      try {
        await store.dispatch(resendButtonCodeVerifyPhone(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('fails when no email, does not call setInputValueError, redirects to login', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));

      payloadCodeCodeVerifyPhone.value = '';
      payloadCodeCodeVerifyPhone.errorMessage = '';

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [];

      requestSignUpResendPhone.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(resendButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
    });

    it('creates the correct actions with the correct payload, email from info form', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

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
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpResendPhone.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(resendButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpResendPhone).toBeCalledWith({
        email,
      });
    });

    it('creates the correct actions with the correct payload, email from login form', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

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
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpResendPhone.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(resendButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpResendPhone).toBeCalledWith({
        email,
      });
    });

    it('creates the correct actions with the correct payload, email from forgot password form', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;

      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = code;

      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));

      payloadCodeCodeVerifyPhone.value = '';
      payloadCodeCodeVerifyPhone.errorMessage = '';

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpResendPhone.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(resendButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpResendPhone).toBeCalledWith({
        email,
      });
    });

    it('fails when requestSignUpResendPhone throws an error and redirects to login', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;

      forms[formNames.CODE_VERIFY_PHONE].inputs[
        inputNames[formNames.CODE_VERIFY_PHONE].CODE
      ].value = code;

      const codeCodeVerifyPhone =
        forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

      const payloadCodeCodeVerifyPhone = JSON.parse(JSON.stringify(codeCodeVerifyPhone));

      payloadCodeCodeVerifyPhone.value = '';
      payloadCodeCodeVerifyPhone.errorMessage = '';

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
          payload: payloadCodeCodeVerifyPhone,
        },
      ];

      requestSignUpResendPhone.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(resendButtonCodeVerifyPhone({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUpResendPhone).toBeCalledWith({
        email,
      });
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
    });
  });
});
