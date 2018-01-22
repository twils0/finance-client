import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
} from '../../../Constants/uiConstantsExternal';
import handleClickFirstButton from '../handleClickFirstButton';
import firstButtonResetPassword from '../firstButtonResetPassword';
import firstButtonForgotPassword from '../firstButtonForgotPassword';
import firstButtonLogin from '../firstButtonLogin';
import firstButtonSignUp from '../firstButtonSignUp';
import firstButtonCodeMFAPhone from '../firstButtonCodeMFAPhone';
import firstButtonCodeVerifyPhone from '../firstButtonCodeVerifyPhone';
import firstButtonCodeVerifyEmail from '../firstButtonCodeVerifyEmail';
import firstButtonDevice from '../firstButtonDevice';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('../firstButtonResetPassword', () => jest.fn());
jest.mock('../firstButtonForgotPassword', () => jest.fn());
jest.mock('../firstButtonLogin', () => jest.fn());
jest.mock('../firstButtonSignUp', () => jest.fn());
jest.mock('../firstButtonCodeMFAPhone', () => jest.fn());
jest.mock('../firstButtonCodeVerifyPhone', () => jest.fn());
jest.mock('../firstButtonCodeVerifyEmail', () => jest.fn());
jest.mock('../firstButtonDevice', () => jest.fn());

const history = { test: 'testHistory' };
const match = { test: 'testMatch' };
const stripeElement = { test: 'testStripeElement' };
const resetStripeElement = { test: 'testReset' };
const handlerPayload = {
  history,
  match,
  stripeElement,
  resetStripeElement,
};

describe('uiThunkExternal', () => {
  describe('handleClickFirstButton', () => {
    afterEach(() => {
      firstButtonResetPassword.mockReset();
      firstButtonForgotPassword.mockReset();
      firstButtonLogin.mockReset();
      firstButtonSignUp.mockReset();
      firstButtonCodeMFAPhone.mockReset();
      firstButtonCodeVerifyPhone.mockReset();
      firstButtonCodeVerifyEmail.mockReset();
      firstButtonDevice.mockReset();
    });

    it("fails and throws an error when missing 'history' key in payload", async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const emptyPayload = {};

      try {
        await store.dispatch(handleClickFirstButton(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }
    });

    it("fails and throws an error when missing 'history' key in payload", async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const emptyPayload = { history };

      try {
        await store.dispatch(handleClickFirstButton(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }
    });

    it("fails and throws an error when missing 'stripeElement' key in payload", async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const wrongPayload = { history, match };

      try {
        await store.dispatch(handleClickFirstButton(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }
    });

    it("fails and throws an error when missing 'resetStripeElement' key in payload", async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const wrongPayload = { history, match, stripeElement };

      try {
        await store.dispatch(handleClickFirstButton(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }
    });

    it('calls nothing when forms current is wrong', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = 'testForm';

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
    });

    it('calls firstButtonResetPassword when form current is RESET_PASSWORD', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.RESET_PASSWORD;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      firstButtonResetPassword.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonResetPassword).toBeCalled();
    });

    it('calls firstButtonForgotPassword when form current is FORGOT_PASSWORD', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.FORGOT_PASSWORD;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      firstButtonForgotPassword.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonForgotPassword).toBeCalledWith({ history });
    });

    it('calls firstButtonLogin when form current is LOGIN', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.LOGIN;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      firstButtonLogin.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonLogin).toBeCalledWith({ history });
    });

    it('calls firstButtonLogin when form current is CARD', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.CARD;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.INFO,
          },
        },
      ];

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('calls firstButtonLogin when form current is INFO', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.INFO;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.SIGN_UP,
          },
        },
      ];

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('calls firstButtonSignUp when form current is SIGN_UP', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.SIGN_UP;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      firstButtonSignUp.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonSignUp).toBeCalledWith({ history, stripeElement, resetStripeElement });
    });

    it('calls firstButtonCodeMFAPhone when form current is CODE_MFA_PHONE', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.CODE_MFA_PHONE;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      firstButtonCodeMFAPhone.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonCodeMFAPhone).toBeCalled();
    });

    it('calls firstButtonCodeVerifyPhone when form current is CODE_VERIFY_PHONE', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.CODE_VERIFY_PHONE;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      firstButtonCodeVerifyPhone.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonCodeVerifyPhone).toBeCalledWith({ history });
    });

    it('calls firstButtonCodeVerifyEmail when form current is CODE_VERIFY_EMAIL', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.CODE_VERIFY_EMAIL;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      firstButtonCodeVerifyEmail.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonCodeVerifyEmail).toBeCalledWith({ history, match });
    });

    it('calls firstButtonDevice when form current is DEVICE', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.DEVICE;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      firstButtonDevice.mockReturnValue(() => null);

      const result = store.dispatch(handleClickFirstButton(handlerPayload));

      expect(result).toEqual(null);
      expect(firstButtonDevice).toBeCalled();
    });
  });
});
