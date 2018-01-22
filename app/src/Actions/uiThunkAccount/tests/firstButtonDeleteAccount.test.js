import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import { errorMessages } from '../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIAccount,
  buttonNames,
  buttonTexts,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsAccount';
import requestDeleteAccount from '../../dataThunkAuth/requestDeleteAccount';
import firstButtonDeleteAccount from '../firstButtonDeleteAccount';

jest.mock('../../dataThunkAuth/requestDeleteAccount', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('uiThunkAccount', () => {
  describe('firstButtonDeleteAccount', () => {
    afterEach(() => {
      requestDeleteAccount.mockReset();
    });

    it('creates the correct actions with the correct payload, when second button not visible', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      forms[formNames.DELETE_ACCOUNT].edit = false;
      buttons[buttonNames.FIRST].text = buttonTexts.SUBMIT;
      buttons[buttonNames.SECOND].text = buttonTexts.RESET;
      buttons[buttonNames.SECOND].visible = false;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_FORM_EDIT,
          payload: {
            id: formNames.DELETE_ACCOUNT,
            edit: true,
          },
        },
        {
          type: actionTypesUIAccount.SET_BUTTON_TEXT,
          payload: {
            id: buttonNames.FIRST,
            text: buttonTexts.CONFIRM,
          },
        },
        {
          type: actionTypesUIAccount.SET_BUTTON_TEXT,
          payload: {
            id: buttonNames.SECOND,
            text: buttonTexts.CANCEL,
          },
        },
        {
          type: actionTypesUIAccount.SET_BUTTON_VISIBLE,
          payload: {
            id: buttonNames.SECOND,
            visible: true,
          },
        },
      ];

      const result = await store.dispatch(firstButtonDeleteAccount());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestDeleteAccount).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload, when second button visible, no delete account value', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      buttons[buttonNames.SECOND].visible = true;

      const deleteAccountConfirm =
        forms[formNames.DELETE_ACCOUNT].inputs[inputNames[formNames.DELETE_ACCOUNT].CONFIRM];

      const payloadDeleteAccountConfirm = JSON.parse(JSON.stringify(deleteAccountConfirm));

      payloadDeleteAccountConfirm.errorMessage = errorMessages.INVALID_DELETE_ACCOUNT;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadDeleteAccountConfirm,
        },
      ];

      const result = await store.dispatch(firstButtonDeleteAccount());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestDeleteAccount).not.toBeCalled();
    });

    it("creates the correct actions with the correct payload, when second button visible, delete account value equals 'delete'", async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.DELETE_ACCOUNT].inputs[inputNames[formNames.DELETE_ACCOUNT].CONFIRM].value =
        'delete';

      const deleteAccountConfirm =
        forms[formNames.DELETE_ACCOUNT].inputs[inputNames[formNames.DELETE_ACCOUNT].CONFIRM];

      const payloadDeleteAccountConfirm = JSON.parse(JSON.stringify(deleteAccountConfirm));

      payloadDeleteAccountConfirm.value = '';

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadDeleteAccountConfirm,
        },
      ];

      requestDeleteAccount.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonDeleteAccount());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestDeleteAccount).toBeCalled();
    });

    it("requestDeleteAccount throws an unexpected error, when second button visible, delete account value equals 'delete'", async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.DELETE_ACCOUNT].inputs[inputNames[formNames.DELETE_ACCOUNT].CONFIRM].value =
        'delete';

      const deleteAccountConfirm =
        forms[formNames.DELETE_ACCOUNT].inputs[inputNames[formNames.DELETE_ACCOUNT].CONFIRM];

      const errorPayloadDeleteAccountConfirm = JSON.parse(JSON.stringify(deleteAccountConfirm));

      errorPayloadDeleteAccountConfirm.value = '';
      errorPayloadDeleteAccountConfirm.errorMessage = errorMessages.INTERNAL_ERROR;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const error = {
        code: 'testCode',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadDeleteAccountConfirm,
        },
      ];

      requestDeleteAccount.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonDeleteAccount());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestDeleteAccount).toBeCalled();
    });
  });
});
