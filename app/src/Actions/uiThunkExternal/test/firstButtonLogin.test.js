import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { pathNames } from '../../../Constants/universalConstants';
import { codeTypeNames } from '../../../Constants/dataConstantsAuth';
import { fieldNames } from '../../../Constants/dataConstantsAccount';
import { errorMessages } from '../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import requestLogin from '../../dataThunkAuth/requestLogin';
import requestSignUpResendPhone from '../../dataThunkAuth/requestSignUpResendPhone';
import firstButtonLogin from '../firstButtonLogin';

const history = {
  replace: jest.fn(),
};
jest.mock('../../dataThunkAuth/requestLogin', () => jest.fn());
jest.mock('../../dataThunkAuth/requestSignUpResendPhone', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const email = 'test1@test.com';
const emailAdditional = 'test2@test.com';
const password = 'testPassword1!';

describe('uiThunkAccount', () => {
  describe('firstButtonLogin', () => {
    afterEach(() => {
      requestLogin.mockReset();
      requestSignUpResendPhone.mockReset();
      history.replace.mockReset();
    });

    it("fails and throws an error when missing 'history' key in payload", async () => {
      const store = mockStore({
        data: { auth: initialStateAuth, account: initialStateAccount },
        ui: { external: initialStateUIExternal },
      });

      const emptyPayload = {};
      const expectedActions = [];

      try {
        await store.dispatch(firstButtonLogin(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('creates the correct actions with the correct payload, no login email or password', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadLoginEmail = JSON.parse(JSON.stringify(loginEmail));
      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadLoginEmail.errorMessage = errorMessages.NO_EMAIL;
      payloadLoginPassword.errorMessage = errorMessages.NO_PASSWORD;

      const store = mockStore({
        data: { auth: initialStateAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginPassword,
        },
      ];

      requestLogin.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonLogin({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLogin).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload, invalid login email', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = 'wrongEmail';
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadLoginEmail = JSON.parse(JSON.stringify(loginEmail));
      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadLoginEmail.errorMessage = errorMessages.INVALID_EMAIL;

      const store = mockStore({
        data: { auth: initialStateAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginPassword,
        },
      ];

      requestLogin.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonLogin({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLogin).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload, requestLogin returns mfa true, phone and email needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = true;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = true;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [];

      requestLogin.mockReturnValue(() => Promise.resolve(true));

      const result = await store.dispatch(firstButtonLogin({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLogin).toBeCalledWith({ email, password });
      expect(history.replace).toBeCalledWith(pathNames.CODE);
    });

    it('creates the correct actions with the correct payload, requestLogin returns mfa false, phone and email needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = true;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = true;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.CODE_VERIFY_PHONE,
          },
        },
      ];

      requestLogin.mockReturnValue(() => Promise.resolve(false));

      const result = await store.dispatch(firstButtonLogin({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLogin).toBeCalledWith({ email, password });
      expect(history.replace).toBeCalledWith(pathNames.CODE);
    });

    it('creates the correct actions with the correct payload, requestLogin returns mfa false, email additional needed and email additional field not blank', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = true;

      stateBeforeAccount.fields[fieldNames.EMAIL_ADDITIONAL].value = emailAdditional;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: stateBeforeAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.CODE_VERIFY_EMAIL,
          },
        },
      ];

      requestLogin.mockReturnValue(() => Promise.resolve(false));

      const result = await store.dispatch(firstButtonLogin({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLogin).toBeCalledWith({ email, password });
      expect(history.replace).toBeCalledWith(pathNames.CODE);
    });

    it('creates the correct actions with the correct payload, requestLogin returns mfa false, email additional needed and email additional field blank', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = true;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [];

      requestLogin.mockReturnValue(() => Promise.resolve(false));

      const result = await store.dispatch(firstButtonLogin({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLogin).toBeCalledWith({ email, password });
      expect(history.replace).not.toBeCalled();
    });

    it("requestLogin throws a 'LimitExceededException' error", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadLoginPassword.errorMessage = errorMessages.LIMIT_EXCEEDED;

      const store = mockStore({
        data: { auth: initialStateAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'LimitExceededException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginPassword,
        },
      ];

      requestLogin.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonLogin({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLogin).toBeCalledWith({ email, password });
    });

    it("requestLogin throws a 'UserNotFoundException' error", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];

      const payloadLoginEmail = JSON.parse(JSON.stringify(loginEmail));

      payloadLoginEmail.errorMessage = errorMessages.EMAIL_NOT_FOUND;

      const store = mockStore({
        data: { auth: initialStateAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'UserNotFoundException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginEmail,
        },
      ];

      requestLogin.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonLogin({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLogin).toBeCalledWith({ email, password });
    });

    it("requestLogin throws a 'NotAuthorizedException' error, 'Incorrect username or password.' message", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadLoginPassword.errorMessage = errorMessages.PASSWORD_NOT_FOUND;

      const store = mockStore({
        data: { auth: initialStateAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'NotAuthorizedException',
        message: 'Incorrect username or password.',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginPassword,
        },
      ];

      requestLogin.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonLogin({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLogin).toBeCalledWith({ email, password });
    });

    it("requestLogin throws a 'NotAuthorizedException' error", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadLoginPassword.errorMessage = errorMessages.INTERNAL_ERROR;

      const store = mockStore({
        data: { auth: initialStateAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'NotAuthorizedException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginPassword,
        },
      ];

      requestLogin.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonLogin({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLogin).toBeCalledWith({ email, password });
    });

    it("requestLogin throws a 'UserNotConfirmedException' error", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadLoginPassword.errorMessage = errorMessages.PASSWORD_NOT_FOUND;

      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'UserNotConfirmedException',
        message: 'Incorrect username or password.',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.CODE_VERIFY_PHONE,
          },
        },
      ];

      requestLogin.mockReturnValue(() => Promise.reject(error));
      requestSignUpResendPhone.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonLogin({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLogin).toBeCalledWith({ email, password });
      expect(requestSignUpResendPhone).toBeCalledWith({ email });
      expect(history.replace).toBeCalledWith(pathNames.CODE);
    });

    it('requestLogin throws an unexpected error', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadLoginPassword.errorMessage = errorMessages.INTERNAL_ERROR;

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
          payload: payloadLoginPassword,
        },
      ];

      requestLogin.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonLogin({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLogin).toBeCalledWith({ email, password });
    });
  });
});
