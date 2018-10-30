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
import requestForgotPassword from '../../dataThunkAuth/requestForgotPassword';
import firstButtonForgotPassword from '../firstButtonForgotPassword';

const history = {
  replace: jest.fn(),
};
jest.mock('../../dataThunkAuth/requestForgotPassword', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const email = 'test@test.com';
const password = 'testPassword1!';

describe('uiThunkExternal', () => {
  describe('firstButtonForgotPassword', () => {
    afterEach(() => {
      requestForgotPassword.mockReset();
      history.replace.mockReset();
    });

    it("fails and throws an error when missing 'history' key in payload", async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const emptyPayload = {};
      const expectedActions = [];

      try {
        await store.dispatch(firstButtonForgotPassword(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('creates the correct actions with the correct payload, no forgot password email', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      const forgotPasswordEmail = forms[formNames.FORGOT_PASSWORD]
        .inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];

      const payloadForgotPasswordEmail = JSON.parse(JSON.stringify(forgotPasswordEmail));

      payloadForgotPasswordEmail.errorMessage = errorMessages.NO_EMAIL;

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadForgotPasswordEmail,
        },
      ];

      requestForgotPassword.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonForgotPassword({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestForgotPassword).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload, invalid forgot password email', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL].value = 'wrongEmail';

      const forgotPasswordEmail = forms[formNames.FORGOT_PASSWORD]
        .inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];

      const payloadForgotPasswordEmail = JSON.parse(JSON.stringify(forgotPasswordEmail));

      payloadForgotPasswordEmail.errorMessage = errorMessages.INVALID_EMAIL;

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadForgotPasswordEmail,
        },
      ];

      requestForgotPassword.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonForgotPassword({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestForgotPassword).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const forgotPasswordEmail = forms[formNames.FORGOT_PASSWORD]
        .inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];
      const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadForgotPasswordEmail = JSON.parse(JSON.stringify(forgotPasswordEmail));
      const payloadLoginEmail = JSON.parse(JSON.stringify(loginEmail));
      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadForgotPasswordEmail.errorMessage = errorMessages.INVALID_EMAIL;

      payloadLoginEmail.value = '';
      payloadLoginEmail.errorMessage = '';

      payloadLoginPassword.value = '';
      payloadLoginPassword.errorMessage = '';

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.RESET_PASSWORD,
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
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.FORGOT_PASSWORD,
            status: requestStatusTypes.IDLE,
          },
        },
      ];

      requestForgotPassword.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonForgotPassword({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestForgotPassword).toBeCalledWith({ email });
    });

    it("requestForgotPassword throws a 'LimitExceededException' error", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;

      const forgotPasswordEmail = forms[formNames.FORGOT_PASSWORD]
        .inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];

      const payloadForgotPasswordEmail = JSON.parse(JSON.stringify(forgotPasswordEmail));

      payloadForgotPasswordEmail.errorMessage = errorMessages.LIMIT_EXCEEDED;

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
          payload: payloadForgotPasswordEmail,
        },
      ];

      requestForgotPassword.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonForgotPassword({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestForgotPassword).toBeCalledWith({ email });
    });

    it("requestForgotPassword throws a 'UserNotFoundException' error", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;

      const forgotPasswordEmail = forms[formNames.FORGOT_PASSWORD]
        .inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];

      const payloadForgotPasswordEmail = JSON.parse(JSON.stringify(forgotPasswordEmail));

      payloadForgotPasswordEmail.errorMessage = errorMessages.EMAIL_NOT_FOUND;

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'UserNotFoundException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadForgotPasswordEmail,
        },
      ];

      requestForgotPassword.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonForgotPassword({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestForgotPassword).toBeCalledWith({ email });
    });

    it('requestForgotPassword throws an unexpected error', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;

      const forgotPasswordEmail = forms[formNames.FORGOT_PASSWORD]
        .inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];

      const payloadForgotPasswordEmail = JSON.parse(JSON.stringify(forgotPasswordEmail));

      payloadForgotPasswordEmail.errorMessage = errorMessages.INTERNAL_ERROR;

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
          payload: payloadForgotPasswordEmail,
        },
      ];

      requestForgotPassword.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonForgotPassword({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestForgotPassword).toBeCalledWith({ email });
    });
  });
});
