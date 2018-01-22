import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import secondButtonForgotPassword from '../secondButtonForgotPassword';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const email = 'test@test.com';

describe('uiThunkAccount', () => {
  describe('secondButtonForgotPassword', () => {
    it('creates the correct actions with the correct payload, inputs all have values', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.FORGOT_PASSWORD].inputs[
        inputNames[formNames.FORGOT_PASSWORD].EMAIL
      ].value = email;

      const forgotPasswordEmail =
        forms[formNames.FORGOT_PASSWORD].inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];

      const payloadForgotPasswordEmail = JSON.parse(JSON.stringify(forgotPasswordEmail));

      payloadForgotPasswordEmail.value = '';
      payloadForgotPasswordEmail.errorMessage = '';

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
      ];

      const result = await store.dispatch(secondButtonForgotPassword());

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
            current: formNames.LOGIN,
          },
        },
      ];

      const result = await store.dispatch(secondButtonForgotPassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });
  });
});
