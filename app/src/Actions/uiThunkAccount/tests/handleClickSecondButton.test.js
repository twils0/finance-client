import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import { codeTypeNames } from '../../../Constants/dataConstantsAuth';
import { formNames } from '../../../Constants/uiConstantsAccount';
import handleClickSecondButton from '../handleClickSecondButton';
import handleCancel from '../handleCancel';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('../../uiThunkAccount/handleCancel', () => jest.fn());
handleCancel.mockReturnValue(() => null);

const handlerPayload = {
  resetStripeElement: jest.fn(),
};

describe('uiThunkAccount', () => {
  describe('handleClickSecondButton', () => {
    afterEach(() => {
      handlerPayload.resetStripeElement.mockReset();
    });

    it("fails and throws an error when missing 'resetStripeElement' key in payload", async () => {
      const store = mockStore({
        ui: { internal: { account: initialStateUIAccount } },
      });

      const emptyPayload = {};

      try {
        await store.dispatch(handleClickSecondButton(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }
    });

    it('calls nothing when forms current is wrong', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = 'testForm';

      const store = mockStore({
        data: { auth: initialStateAuth, account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      expect(result).toEqual(null);
      expect(handleCancel).toBeCalled();
    });

    it('calls secondButtonCode when form current is not BILLING', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.CODE;

      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_PHONE].needed = true;

      const store = mockStore({
        data: { auth: stateBeforeAuth },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      expect(result).toEqual(null);
      expect(handleCancel).toBeCalled();
    });

    it('calls secondButtonBilling when form current is BILLING', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.BILLING;

      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      expect(result).toEqual(null);
      expect(handlerPayload.resetStripeElement).toBeCalled();
      expect(handleCancel).toBeCalled();
    });
  });
});
