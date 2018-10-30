import { formNames } from '../../Constants/uiConstantsExternal';
import { setCurrentForm } from '../uiActionsExternal';

import secondButtonResetPassword from './secondButtonResetPassword';
import secondButtonForgotPassword from './secondButtonForgotPassword';
import secondButtonLogin from './secondButtonLogin';
import secondButtonCard from './secondButtonCard';
import secondButtonSignUp from './secondButtonSignUp';
import secondButtonCodeMFAPhone from './secondButtonCodeMFAPhone';
import secondButtonCodeVerifyEmail from './secondButtonCodeVerifyEmail';
import secondButtonDevice from './secondButtonDevice';

const handleClickSecondButton = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'history')) {
    throw new Error(`Please enter a value for the 'history' key - ${JSON.stringify(payload)}`);
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
        dispatch(secondButtonResetPassword());
        break;
      case formNames.FORGOT_PASSWORD:
        dispatch(secondButtonForgotPassword());
        break;
      case formNames.LOGIN: {
        const { history } = payload;

        dispatch(secondButtonLogin({ history }));
        break;
      }
      case formNames.CARD: {
        const { history, resetStripeElement } = payload;

        dispatch(secondButtonCard({ history, resetStripeElement }));
        break;
      }
      case formNames.INFO:
        dispatch(setCurrentForm({ current: formNames.CARD }));
        break;
      case formNames.SIGN_UP:
        dispatch(secondButtonSignUp());
        break;
      case formNames.CODE_MFA_PHONE: {
        const { history } = payload;

        dispatch(secondButtonCodeMFAPhone({ history }));
        break;
      }
      case formNames.CODE_VERIFY_EMAIL: {
        const { history } = payload;

        dispatch(secondButtonCodeVerifyEmail({ history }));
        break;
      }
      case formNames.DEVICE: {
        const { history } = payload;

        dispatch(secondButtonDevice({ history }));
        break;
      }
      default:
        break;
    }

    return null;
  };
};

export default handleClickSecondButton;
