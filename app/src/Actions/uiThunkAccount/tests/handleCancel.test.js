import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import { formNames } from '../../../Constants/uiConstantsAccount';
import handleCancel from '../handleCancel';
import cancelCode from '../cancelCode';
import cancelProfile from '../cancelProfile';
import cancelBilling from '../cancelBilling';
import cancelChangePassword from '../cancelChangePassword';
import cancelDeleteAccount from '../cancelDeleteAccount';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('../cancelCode', () => jest.fn());
jest.mock('../cancelProfile', () => jest.fn());
jest.mock('../cancelBilling', () => jest.fn());
jest.mock('../cancelChangePassword', () => jest.fn());
jest.mock('../cancelDeleteAccount', () => jest.fn());

describe('uiThunkAccount', () => {
  afterEach(() => {
    cancelCode.mockReset();
    cancelProfile.mockReset();
    cancelBilling.mockReset();
    cancelChangePassword.mockReset();
    cancelDeleteAccount.mockReset();
  });

  describe('handleCancel', () => {
    it('calls nothing when forms current is wrong', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = 'testForm';

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      const result = store.dispatch(handleCancel());

      expect(result).toEqual(null);
    });

    it('calls cancelCode when form current is CODE', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.CODE;

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      cancelCode.mockReturnValue(() => null);

      const result = store.dispatch(handleCancel());

      expect(result).toEqual(null);
      expect(cancelCode).toBeCalled();
    });

    it('calls cancelProfile when form current is PROFILE', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.PROFILE;

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      cancelProfile.mockReturnValue(() => null);

      const result = store.dispatch(handleCancel());

      expect(result).toEqual(null);
      expect(cancelProfile).toBeCalled();
    });

    it('calls cancelBilling when form current is BILLING', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.BILLING;

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      cancelBilling.mockReturnValue(() => null);

      const result = store.dispatch(handleCancel());

      expect(result).toEqual(null);
      expect(cancelBilling).toBeCalled();
    });

    it('calls cancelChangePassword when form current is CHANGE_PASSWORD', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.CHANGE_PASSWORD;

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      cancelChangePassword.mockReturnValue(() => null);

      const result = store.dispatch(handleCancel());

      expect(result).toEqual(null);
      expect(cancelChangePassword).toBeCalled();
    });

    it('calls cancelDeleteAccount when form current is DELETE_ACCOUNT', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.DELETE_ACCOUNT;

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      cancelDeleteAccount.mockReturnValue(() => null);

      const result = store.dispatch(handleCancel());

      expect(result).toEqual(null);
      expect(cancelDeleteAccount).toBeCalled();
    });
  });
});
