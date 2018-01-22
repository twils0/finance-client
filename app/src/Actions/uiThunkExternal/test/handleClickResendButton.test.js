import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { formNames } from '../../../Constants/uiConstantsExternal';
import handleClickResendButton from '../handleClickResendButton';
import resendButtonCodeVerifyPhone from '../resendButtonCodeVerifyPhone';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('../resendButtonCodeVerifyPhone', () => jest.fn());

const history = { test: 'testHistory' };
const handlerPayload = {
  history,
  resetStripeElement: jest.fn(),
};

describe('uiThunkExternal', () => {
  afterEach(() => {
    resendButtonCodeVerifyPhone.mockReset();
  });

  describe('handleClickResendButton', () => {
    it("fails and throws an error when missing 'history' key in payload", async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const emptyPayload = {};

      try {
        await store.dispatch(handleClickResendButton(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }
    });

    it('calls nothing when forms current is wrong', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = 'testForm';

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      const result = store.dispatch(handleClickResendButton(handlerPayload));

      expect(result).toEqual(null);
    });

    it('calls resendButtonCodeVerifyPhone when form current is CODE_VERIFY_PHONE', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.CODE_VERIFY_PHONE;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      resendButtonCodeVerifyPhone.mockReturnValue(() => null);

      const result = store.dispatch(handleClickResendButton(handlerPayload));

      expect(result).toEqual(null);
      expect(resendButtonCodeVerifyPhone).toBeCalledWith({ history });
    });
  });
});
