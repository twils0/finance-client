import { formNames } from '../../Constants/uiConstantsAccount';

import firstButtonCode from './firstButtonCode';
import firstButtonProfile from './firstButtonProfile';
import firstButtonBilling from './firstButtonBilling';
import firstButtonChangePassword from './firstButtonChangePassword';
import firstButtonDeleteAccount from './firstButtonDeleteAccount';

const handleClickFirstButton = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'stripeElement')) {
    throw new Error(`Please enter a value for the 'stripeElement' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'resetStripeElement')) {
    throw new Error(`Please enter a value for the 'resetStripeElement' key - ${JSON.stringify(payload)}`);
  }

  return (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.internal.account;

    switch (forms.current) {
      case formNames.CODE:
        dispatch(firstButtonCode());
        break;
      case formNames.PROFILE:
        dispatch(firstButtonProfile());
        break;
      case formNames.BILLING: {
        const { stripeElement, resetStripeElement } = payload;

        dispatch(firstButtonBilling({ stripeElement, resetStripeElement }));
        break;
      }
      case formNames.CHANGE_PASSWORD:
        dispatch(firstButtonChangePassword());
        break;
      case formNames.DELETE_ACCOUNT: {
        dispatch(firstButtonDeleteAccount());
        break;
      }
      default:
        break;
    }

    return null;
  };
};

export default handleClickFirstButton;
