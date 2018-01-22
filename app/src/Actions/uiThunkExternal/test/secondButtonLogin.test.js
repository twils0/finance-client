import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { pathNames } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import secondButtonLogin from '../secondButtonLogin';

const history = {
  replace: jest.fn(),
};

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const loginPayload = {
  history,
};

const email = 'test@test.com';
const password = 'testPassword1!';

describe('uiThunkAccount', () => {
  describe('secondButtonLogin', () => {
    afterEach(() => {
      history.replace.mockReset();
    });

    it("fails and throws an error when missing 'history' key in payload", async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const emptyPayload = {};
      const expectedActions = [];

      try {
        await store.dispatch(secondButtonLogin(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('creates the correct actions with the correct payload, inputs all have values', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadLoginEmail = JSON.parse(JSON.stringify(loginEmail));
      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadLoginEmail.value = '';
      payloadLoginEmail.errorMessage = '';

      payloadLoginPassword.value = '';
      payloadLoginPassword.errorMessage = '';

      const store = mockStore({
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

      const result = await store.dispatch(secondButtonLogin(loginPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(history.replace).toBeCalledWith(pathNames.SIGN_UP);
    });

    it('creates the correct actions with the correct payload, inputs all are blank', async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [];

      const result = await store.dispatch(secondButtonLogin(loginPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(history.replace).toBeCalledWith(pathNames.SIGN_UP);
    });
  });
});
