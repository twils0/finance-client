import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import secondButtonSignUp from '../secondButtonSignUp';

const history = {
  replace: jest.fn(),
};

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const password = 'testPassword1!';

describe('uiThunkAccount', () => {
  describe('secondButtonSignUp', () => {
    afterEach(() => {
      history.replace.mockReset();
    });

    it('creates the correct actions with the correct payload, inputs all have values', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD].value = password;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2].value = password;

      const signUpPassword =
        forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD];
      const signUpPassword2 =
        forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

      const payloadSignUpPassword = JSON.parse(JSON.stringify(signUpPassword));
      const payloadSignUpPassword2 = JSON.parse(JSON.stringify(signUpPassword2));

      payloadSignUpPassword.value = '';
      payloadSignUpPassword.errorMessage = '';

      payloadSignUpPassword2.value = '';
      payloadSignUpPassword2.errorMessage = '';

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.INFO,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
      ];

      const result = await store.dispatch(secondButtonSignUp());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with the correct payload, inputs all are blank', async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.INFO,
          },
        },
      ];

      const result = await store.dispatch(secondButtonSignUp());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });
  });
});
