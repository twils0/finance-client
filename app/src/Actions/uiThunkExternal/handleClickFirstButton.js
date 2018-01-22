import { formNames } from '../../Constants/uiConstantsExternal';
import { setCurrentForm } from '../uiActionsExternal';

import firstButtonResetPassword from './firstButtonResetPassword';
import firstButtonForgotPassword from './firstButtonForgotPassword';
import firstButtonLogin from './firstButtonLogin';
import firstButtonSignUp from './firstButtonSignUp';
import firstButtonCodeMFAPhone from './firstButtonCodeMFAPhone';
import firstButtonCodeVerifyPhone from './firstButtonCodeVerifyPhone';
import firstButtonCodeVerifyEmail from './firstButtonCodeVerifyEmail';
import firstButtonDevice from './firstButtonDevice';

const handleClickFirstButton = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'history')) {
    throw new Error(`Please enter a value for the 'history' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'match')) {
    throw new Error(`Please enter a value for the 'match' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'stripeElement')) {
    throw new Error(
      `Please enter a value for the 'stripeElement' key - ${JSON.stringify(payload)}`,
    );
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'resetStripeElement')) {
    throw new Error(
      `Please enter a value for the 'resetStripeElement' key - ${JSON.stringify(payload)}`,
    );
  }

  return (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.external;

    switch (forms.current) {
      case formNames.RESET_PASSWORD:
        dispatch(firstButtonResetPassword());
        break;
      case formNames.FORGOT_PASSWORD: {
        const { history } = payload;

        dispatch(firstButtonForgotPassword({ history }));
        break;
      }
      case formNames.LOGIN: {
        const { history } = payload;

        dispatch(firstButtonLogin({ history }));
        break;
      }
      case formNames.CARD:
        dispatch(setCurrentForm({ current: formNames.INFO }));
        break;
      case formNames.INFO:
        dispatch(setCurrentForm({ current: formNames.SIGN_UP }));
        break;
      case formNames.SIGN_UP: {
        const { history, stripeElement, resetStripeElement } = payload;

        dispatch(firstButtonSignUp({ history, stripeElement, resetStripeElement }));
        break;
      }
      case formNames.CODE_MFA_PHONE: {
        dispatch(firstButtonCodeMFAPhone());
        break;
      }
      case formNames.CODE_VERIFY_PHONE: {
        const { history } = payload;

        dispatch(firstButtonCodeVerifyPhone({ history }));
        break;
      }
      case formNames.CODE_VERIFY_EMAIL: {
        const { history, match } = payload;

        dispatch(firstButtonCodeVerifyEmail({ history, match }));
        break;
      }
      case formNames.DEVICE: {
        const { history } = payload;

        dispatch(firstButtonDevice({ history }));
        break;
      }
      default:
        break;
    }

    return null;
  };
};

export default handleClickFirstButton;
