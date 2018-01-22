import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import {
  actionTypes as actionTypesUIAccount,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsAccount';
import cancelChangePassword from '../cancelChangePassword';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('uiThunkAccount', () => {
  describe('cancelChangePassword', () => {
    it('creates the correct actions with blank payloads, when in edit mode and when input values present', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms } = stateBeforeUIAccount;

      const changePasswordOldPassword =
        forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD];
      const changePasswordNewPassword =
        forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD];
      const changePasswordNewPassword2 =
        forms[formNames.CHANGE_PASSWORD].inputs[
          inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
        ];

      const payloadChangePasswordOldPassword = JSON.parse(
        JSON.stringify(changePasswordOldPassword),
      );
      const payloadChangePasswordNewPassword = JSON.parse(
        JSON.stringify(changePasswordNewPassword),
      );
      const payloadChangePasswordNewPassword2 = JSON.parse(
        JSON.stringify(changePasswordNewPassword2),
      );

      changePasswordOldPassword.value = 'testValue';
      changePasswordNewPassword.value = 'testValue';
      changePasswordNewPassword2.value = 'testValue';

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadChangePasswordOldPassword,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadChangePasswordNewPassword,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadChangePasswordNewPassword2,
        },
      ];

      const result = store.dispatch(cancelChangePassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with blank payloads, when input errorMessages present', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms } = stateBeforeUIAccount;

      const changePasswordOldPassword =
        forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD];
      const changePasswordNewPassword =
        forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD];
      const changePasswordNewPassword2 =
        forms[formNames.CHANGE_PASSWORD].inputs[
          inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
        ];

      const payloadChangePasswordOldPassword = JSON.parse(
        JSON.stringify(changePasswordOldPassword),
      );
      const payloadChangePasswordNewPassword = JSON.parse(
        JSON.stringify(changePasswordNewPassword),
      );
      const payloadChangePasswordNewPassword2 = JSON.parse(
        JSON.stringify(changePasswordNewPassword2),
      );

      changePasswordOldPassword.errorMessage = 'testError';
      changePasswordNewPassword.errorMessage = 'testError';
      changePasswordNewPassword2.errorMessage = 'testError';

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadChangePasswordOldPassword,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadChangePasswordNewPassword,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadChangePasswordNewPassword2,
        },
      ];

      const result = store.dispatch(cancelChangePassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates no actions with blank payloads, when unnecessary', async () => {
      const store = mockStore({ ui: { internal: { account: initialStateUIAccount } } });

      const expectedActions = [];

      const result = store.dispatch(cancelChangePassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });
  });
});
