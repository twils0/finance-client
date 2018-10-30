import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
} from '../../../Constants/uiConstantsExternal';
import handleClickSecondButton from '../handleClickSecondButton';
import secondButtonResetPassword from '../secondButtonResetPassword';
import secondButtonForgotPassword from '../secondButtonForgotPassword';
import secondButtonLogin from '../secondButtonLogin';
import secondButtonCard from '../secondButtonCard';
import secondButtonSignUp from '../secondButtonSignUp';
import secondButtonCodeMFAPhone from '../secondButtonCodeMFAPhone';
import secondButtonCodeVerifyEmail from '../secondButtonCodeVerifyEmail';
import secondButtonDevice from '../secondButtonDevice';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('../secondButtonResetPassword', () => jest.fn());
jest.mock('../secondButtonForgotPassword', () => jest.fn());
jest.mock('../secondButtonLogin', () => jest.fn());
jest.mock('../secondButtonCard', () => jest.fn());
jest.mock('../secondButtonSignUp', () => jest.fn());
jest.mock('../secondButtonCodeMFAPhone', () => jest.fn());
jest.mock('../secondButtonCodeVerifyEmail', () => jest.fn());
jest.mock('../secondButtonDevice', () => jest.fn());

const history = { test: 'testHistory' };
const handlerPayload = {
  history,
  resetStripeElement: jest.fn(),
};

describe('uiThunkExternal', () => {
  describe('handleClickSecondButton', () => {
    afterEach(() => {
      secondButtonResetPassword.mockReset();
      secondButtonForgotPassword.mockReset();
      secondButtonLogin.mockReset();
      secondButtonSignUp.mockReset();
      secondButtonCodeMFAPhone.mockReset();
      secondButtonCodeVerifyEmail.mockReset();
      secondButtonDevice.mockReset();
    });

    it("fails and throws an error when missing 'history' key in payload", async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const emptyPayload = {};

      try {
        await store.dispatch(handleClickSecondButton(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }
    });

    it("fails and throws an error when missing 'resetStripeElement' key in payload", async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const wrongPayload = { history };

      try {
        await store.dispatch(handleClickSecondButton(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }
    });

    it('calls nothing when forms current is wrong', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = 'testForm';

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      expect(result).toEqual(null);
    });

    it('calls secondButtonResetPassword when form current is RESET_PASSWORD', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.RESET_PASSWORD;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      secondButtonResetPassword.mockReturnValue(() => null);

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      expect(result).toEqual(null);
      expect(secondButtonResetPassword).toBeCalled();
    });

    it('calls secondButtonForgotPassword when form current is FORGOT_PASSWORD', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.FORGOT_PASSWORD;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      secondButtonForgotPassword.mockReturnValue(() => null);

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      expect(result).toEqual(null);
      expect(secondButtonForgotPassword).toBeCalled();
    });

    it('calls secondButtonLogin when form current is LOGIN', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.LOGIN;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      secondButtonLogin.mockReturnValue(() => null);

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      expect(result).toEqual(null);
      expect(secondButtonLogin).toBeCalledWith({ history });
    });

    it('calls secondButtonCard when form current is CARD', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.CARD;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      secondButtonCard.mockReturnValue(() => null);

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      expect(result).toEqual(null);
      expect(secondButtonCard).toBeCalledWith(handlerPayload);
    });

    it('calls secondButtonLogin when form current is INFO', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.INFO;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.CARD,
          },
        },
      ];

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('calls secondButtonSignUp when form current is SIGN_UP', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.SIGN_UP;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      secondButtonSignUp.mockReturnValue(() => null);

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      expect(result).toEqual(null);
      expect(secondButtonSignUp).toBeCalled();
    });

    it('calls secondButtonCodeMFAPhone when form current is CODE_MFA_PHONE', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.CODE_MFA_PHONE;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      secondButtonCodeMFAPhone.mockReturnValue(() => null);

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      expect(result).toEqual(null);
      expect(secondButtonCodeMFAPhone).toBeCalledWith({ history });
    });

    it('calls secondButtonCodeVerifyEmail when form current is CODE_VERIFY_EMAIL', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.CODE_VERIFY_EMAIL;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      secondButtonCodeVerifyEmail.mockReturnValue(() => null);

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      expect(result).toEqual(null);
      expect(secondButtonCodeVerifyEmail).toBeCalledWith({ history });
    });

    it('calls secondButtonDevice when form current is DEVICE', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      stateBeforeUIExternal.forms.current = formNames.DEVICE;

      const store = mockStore({ ui: { external: stateBeforeUIExternal } });

      secondButtonDevice.mockReturnValue(() => null);

      const result = store.dispatch(handleClickSecondButton(handlerPayload));

      expect(result).toEqual(null);
      expect(secondButtonDevice).toBeCalledWith({ history });
    });
  });
});
