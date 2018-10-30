import { codeTypeNames } from '../../Constants/dataConstantsAuth';
import { formNames } from '../../Constants/uiConstantsAccount';
import handleCancel from './handleCancel';

const handleClickSecondButton = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'resetStripeElement')) {
    throw new Error(
      `Please enter a value for the 'resetStripeElement' key - ${JSON.stringify(payload)}`,
    );
  }

  return (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.internal.account;

    switch (forms.current) {
      case formNames.BILLING: {
        payload.resetStripeElement();
        break;
      }
      default:
        break;
    }

    dispatch(handleCancel());

    return null;
  };
};

export default handleClickSecondButton;
