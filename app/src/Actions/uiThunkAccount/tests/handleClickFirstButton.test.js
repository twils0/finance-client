import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import { formNames } from '../../../Constants/uiConstantsAccount';
import handleClickFirstButton from '../handleClickFirstButton';
import firstButtonCode from '../firstButtonCode';
import firstButtonProfile from '../firstButtonProfile';
import firstButtonBilling from '../firstButtonBilling';
import firstButtonChangePassword from '../firstButtonChangePassword';
import firstButtonDeleteAccount from '../firstButtonDeleteAccount';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('../firstButtonCode', () => jest.fn());
jest.mock('../firstButtonProfile', () => jest.fn());
jest.mock('../firstButtonBilling', () => jest.fn());
jest.mock('../firstButtonChangePassword', () => jest.fn());
jest.mock('../firstButtonDeleteAccount', () => jest.fn());

const stripeElement = { test: 'testStripeElement' };
const handlerPayload = {
  stripeElement,
  resetStripeElement: jest.fn(),
};

describe('uiThunkAccount', () => {
  afterEach(() => {
    firstButtonCode.mockReset();
    firstButtonProfile.mockReset();
    firstButtonBilling.mockReset();
    firstButtonChangePassword.mockReset();
    firstButtonDeleteAccount.mockReset();
  });

  describe('handleClickFirstButton', () => {
    it("fails and throws an error when missing 'stripeElement' key in payload", async () => {
      const store = mockStore({
        ui: { internal: { account: initialStateUIAccount } },
      });

      const emptyPayload = {};

      try {
        await store.dispatch(handleClickFirstButton(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }
    });

    it("fails and throws an error when missing 'resetStripeElement' key in payload", async () => {
      const store = mockStore({
        ui: { internal: { account: initialStateUIAccount } },
      });

      const wrongPayload = { stripeElement };

      try {
        await store.dispatch(handleClickFirstButton(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }
    });

    it('calls nothing when forms current is wrong', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = 'testForm';

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
    });

    it('calls firstButtonCode when form current is CODE', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.CODE;

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      firstButtonCode.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonCode).toBeCalled();
    });

    it('calls firstButtonProfile when form current is PROFILE', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.PROFILE;

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      firstButtonProfile.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonProfile).toBeCalled();
    });

    it('calls firstButtonBilling when form current is BILLING', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.BILLING;

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      firstButtonBilling.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonBilling).toBeCalledWith(handlerPayload);
    });

    it('calls firstButtonChangePassword when form current is CHANGE_PASSWORD', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.CHANGE_PASSWORD;

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      firstButtonChangePassword.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonChangePassword).toBeCalled();
    });

    it('calls firstButtonDeleteAccount when form current is DELETE_ACCOUNT', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.DELETE_ACCOUNT;

      const store = mockStore({ ui: { internal: { account: stateBeforeUIAccount } } });

      firstButtonDeleteAccount.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonDeleteAccount).toBeCalled();
    });
  });
});
