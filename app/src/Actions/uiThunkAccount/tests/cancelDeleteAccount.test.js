import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import {
  actionTypes as actionTypesUIAccount,
  buttonNames,
  buttonTexts,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsAccount';
import cancelDeleteAccount from '../cancelDeleteAccount';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('uiThunkAccount', () => {
  describe('cancelDeleteAccount', () => {
    it('creates the correct actions with blank payloads, when in edit mode and when input values present', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;
      forms[formNames.DELETE_ACCOUNT].edit = true;
      buttons[buttonNames.FIRST].text = buttonTexts.CONFIRM;
      buttons[buttonNames.SECOND].visible = true;

      const deleteAccountConfirm =
        forms[formNames.DELETE_ACCOUNT].inputs[inputNames[formNames.DELETE_ACCOUNT].CONFIRM];

      const payloadDeleteAccountConfirm = JSON.parse(JSON.stringify(deleteAccountConfirm));

      deleteAccountConfirm.value = 'testValue';

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_FORM_EDIT,
          payload: {
            id: formNames.DELETE_ACCOUNT,
            edit: false,
          },
        },
        {
          type: actionTypesUIAccount.SET_BUTTON_TEXT,
          payload: {
            id: buttonNames.FIRST,
            text: buttonTexts.DELETE,
          },
        },
        {
          type: actionTypesUIAccount.SET_BUTTON_VISIBLE,
          payload: {
            id: buttonNames.SECOND,
            visible: false,
          },
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadDeleteAccountConfirm,
        },
      ];

      const result = store.dispatch(cancelDeleteAccount());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with blank payloads, when input errorMessages present', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      buttons[buttonNames.FIRST].text = buttonTexts.DELETE;

      const deleteAccountConfirm =
        forms[formNames.DELETE_ACCOUNT].inputs[inputNames[formNames.DELETE_ACCOUNT].CONFIRM];

      const payloadDeleteAccountConfirm = JSON.parse(JSON.stringify(deleteAccountConfirm));

      deleteAccountConfirm.errorMessage = 'testError';

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadDeleteAccountConfirm,
        },
      ];

      const result = store.dispatch(cancelDeleteAccount());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates no actions with blank payloads, when unnecessary', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { buttons } = stateBeforeUIAccount;

      buttons[buttonNames.FIRST].text = buttonTexts.DELETE;

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      const expectedActions = [];

      const result = store.dispatch(cancelDeleteAccount());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });
  });
});
