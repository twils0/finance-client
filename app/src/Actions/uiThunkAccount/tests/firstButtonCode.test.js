import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import { errorMessages } from '../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIAccount,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsAccount';
import requestVerifyFieldConfirm from '../../dataThunkAuth/requestVerifyFieldConfirm';
import handleCancel from '../handleCancel';
import firstButtonCode from '../firstButtonCode';

jest.mock('../../dataThunkAuth/requestVerifyFieldConfirm', () => jest.fn());
jest.mock('../handleCancel', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const codePhone = '123456';

describe('uiThunkAccount', () => {
  describe('firstButtonCode', () => {
    afterEach(() => {
      handleCancel.mockReset();
    });

    it('creates the correct actions with the correct payload, phone and email need no phone and email code', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms } = stateBeforeUIAccount;

      const codeCodePhone = forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE];

      const payloadCodeCodePhone = JSON.parse(JSON.stringify(codeCodePhone));

      payloadCodeCodePhone.errorMessage = errorMessages.NO_VERIFICATION_CODE_PHONE;

      const store = mockStore({
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodePhone,
        },
      ];

      const result = await store.dispatch(firstButtonCode());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(handleCancel).not.toBeCalled();
    });

    it("requestVerifyFieldConfirm throws a 'CodeMismatchException' error", async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms } = stateBeforeUIAccount;

      forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE].value = codePhone;

      const codeCodePhone = forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE];

      const errorPayloadCodeCodePhone = JSON.parse(JSON.stringify(codeCodePhone));

      errorPayloadCodeCodePhone.errorMessage = errorMessages.INVALID_VERIFICATION_CODE;

      const store = mockStore({
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const error = {
        field: 'phone_number',
        error: {
          code: 'CodeMismatchException',
          message: 'testMessage',
        },
      };
      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadCodeCodePhone,
        },
      ];

      requestVerifyFieldConfirm.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonCode());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestVerifyFieldConfirm).toBeCalledWith({
        field: 'phone_number',
        code: codePhone,
      });
      expect(handleCancel).not.toBeCalled();
    });

    it('requestVerifyFieldConfirm throws an unexpected error', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms } = stateBeforeUIAccount;

      forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE].value = codePhone;

      const codeCodePhone = forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE];

      const errorPayloadCodeCodePhone = JSON.parse(JSON.stringify(codeCodePhone));

      errorPayloadCodeCodePhone.errorMessage = errorMessages.INTERNAL_ERROR;

      const store = mockStore({
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const error = {
        field: 'phone_number',
        error: {
          code: 'testCode',
          message: 'testMessage',
        },
      };
      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadCodeCodePhone,
        },
      ];

      requestVerifyFieldConfirm.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonCode());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestVerifyFieldConfirm).toBeCalledWith({
        field: 'phone_number',
        code: codePhone,
      });
      expect(handleCancel).not.toBeCalled();
    });
  });
});
