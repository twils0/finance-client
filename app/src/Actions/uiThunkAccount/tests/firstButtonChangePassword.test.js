import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import { errorMessages } from '../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIAccount,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsAccount';
import requestChangePassword from '../../dataThunkAuth/requestChangePassword';
import handleCancel from '../handleCancel';
import firstButtonChangePassword from '../firstButtonChangePassword';

jest.mock('../../dataThunkAuth/requestChangePassword', () => jest.fn());
jest.mock('../handleCancel', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('uiThunkAccount', () => {
  describe('firstButtonChangePassword', () => {
    afterEach(() => {
      handleCancel.mockReset();
      requestChangePassword.mockReset();
    });

    it('creates the correct actions with the correct payload, no old password, no new password, ', async () => {
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

      payloadChangePasswordOldPassword.errorMessage = errorMessages.NO_PASSWORD;
      payloadChangePasswordNewPassword.errorMessage = errorMessages.NO_NEW_PASSWORD;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

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
          payload: changePasswordNewPassword2,
        },
      ];

      const result = await store.dispatch(firstButtonChangePassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with the correct payload, wrong new password, new password does not match, ', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms } = stateBeforeUIAccount;

      forms[formNames.CHANGE_PASSWORD].inputs[
        inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
      ].value =
        'oldPassword1';
      forms[formNames.CHANGE_PASSWORD].inputs[
        inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
      ].value =
        'newPassword1!';

      const changePasswordOldPassword =
        forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD];
      const changePasswordNewPassword =
        forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD];
      const changePasswordNewPassword2 =
        forms[formNames.CHANGE_PASSWORD].inputs[
          inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
        ];

      const payloadChangePasswordNewPassword = JSON.parse(
        JSON.stringify(changePasswordNewPassword),
      );
      const payloadChangePasswordNewPassword2 = JSON.parse(
        JSON.stringify(changePasswordNewPassword2),
      );

      payloadChangePasswordNewPassword.errorMessage = errorMessages.INVALID_PASSWORD;
      payloadChangePasswordNewPassword2.errorMessage = errorMessages.NO_MATCH_PASSWORD;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: changePasswordOldPassword,
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

      const result = await store.dispatch(firstButtonChangePassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with the correct payload, when second button visible', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms } = stateBeforeUIAccount;

      forms[formNames.CHANGE_PASSWORD].inputs[
        inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD
      ].value =
        'oldPassword1!';
      forms[formNames.CHANGE_PASSWORD].inputs[
        inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
      ].value =
        'newPassword1!';
      forms[formNames.CHANGE_PASSWORD].inputs[
        inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
      ].value =
        'newPassword1!';

      const changePasswordOldPassword =
        forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD];
      const changePasswordNewPassword =
        forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD];

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [];

      requestChangePassword.mockReturnValue(() => Promise.resolve());
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonChangePassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestChangePassword).toBeCalledWith({
        oldPassword: changePasswordOldPassword.value,
        newPassword: changePasswordNewPassword.value,
      });
      expect(handleCancel).toBeCalled();
    });

    it("requestChangePassword throws 'NotAuthorizedException' error, when second button visible", async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms } = stateBeforeUIAccount;

      forms[formNames.CHANGE_PASSWORD].inputs[
        inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD
      ].value =
        'oldPassword1!';
      forms[formNames.CHANGE_PASSWORD].inputs[
        inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
      ].value =
        'newPassword1!';
      forms[formNames.CHANGE_PASSWORD].inputs[
        inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
      ].value =
        'newPassword1!';

      const changePasswordOldPassword =
        forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD];
      const changePasswordNewPassword =
        forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD];

      const payloadChangePasswordOldPassword = JSON.parse(
        JSON.stringify(changePasswordOldPassword),
      );

      payloadChangePasswordOldPassword.errorMessage = errorMessages.PASSWORD_NOT_FOUND;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const error = {
        code: 'NotAuthorizedException',
        message: 'Incorrect username or password.',
      };
      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadChangePasswordOldPassword,
        },
      ];

      requestChangePassword.mockReturnValue(() => Promise.reject(error));
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonChangePassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestChangePassword).toBeCalledWith({
        oldPassword: changePasswordOldPassword.value,
        newPassword: changePasswordNewPassword.value,
      });
      expect(handleCancel).not.toBeCalled();
    });

    it('requestChangePassword throws an unexpected error, when second button visible', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms } = stateBeforeUIAccount;

      forms[formNames.CHANGE_PASSWORD].inputs[
        inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD
      ].value =
        'oldPassword1!';
      forms[formNames.CHANGE_PASSWORD].inputs[
        inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD
      ].value =
        'newPassword1!';
      forms[formNames.CHANGE_PASSWORD].inputs[
        inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
      ].value =
        'newPassword1!';

      const changePasswordOldPassword =
        forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD];
      const changePasswordNewPassword =
        forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD];
      const changePasswordNewPassword2 =
        forms[formNames.CHANGE_PASSWORD].inputs[
          inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2
        ];

      const payloadChangePasswordNewPassword2 = JSON.parse(
        JSON.stringify(changePasswordNewPassword2),
      );

      payloadChangePasswordNewPassword2.errorMessage = errorMessages.INTERNAL_ERROR;

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
          payload: payloadChangePasswordNewPassword2,
        },
      ];

      requestChangePassword.mockReturnValue(() => Promise.reject(error));
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonChangePassword());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestChangePassword).toBeCalledWith({
        oldPassword: changePasswordOldPassword.value,
        newPassword: changePasswordNewPassword.value,
      });
      expect(handleCancel).not.toBeCalled();
    });
  });
});
