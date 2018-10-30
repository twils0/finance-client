import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import {
  actionTypes as actionTypesUIAccount,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsAccount';
import cancelCode from '../cancelCode';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('uiThunkAccount', () => {
  describe('cancelCode', () => {
    it('creates the correct actions with blank payloads, when in edit mode and when input values present', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms } = stateBeforeUIAccount;

      const codeCodePhone = forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE];

      const payloadCodeCodePhone = JSON.parse(JSON.stringify(codeCodePhone));

      codeCodePhone.value = 'testValue';

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodePhone,
        },
      ];

      const result = store.dispatch(cancelCode());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with blank payloads, when input errorMessages present', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms } = stateBeforeUIAccount;

      const codeCodePhone = forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE];

      const payloadCodeCodePhone = JSON.parse(JSON.stringify(codeCodePhone));

      codeCodePhone.errorMessage = 'testError';

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodePhone,
        },
      ];

      const result = store.dispatch(cancelCode());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates no actions with blank payloads, when unnecessary', async () => {
      const store = mockStore({ ui: { internal: { account: initialStateUIAccount } } });

      const expectedActions = [];

      const result = store.dispatch(cancelCode());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });
  });
});
