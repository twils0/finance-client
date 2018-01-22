import { codeTypeNames } from '../../Constants/dataConstantsAuth';
import { formNames } from '../../Constants/uiConstantsAccount';
import requestVerifyField from '../dataThunkAuth/requestVerifyField';
import handleCancel from '../uiThunkAccount/handleCancel';

const handleClickSecondButton = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'resetStripeElement')) {
    throw new Error(
      `Please enter a value for the 'resetStripeElement' key - ${JSON.stringify(payload)}`,
    );
  }

  return (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.internal.account;
    const { codeTypes } = state.data.auth;

    switch (forms.current) {
      case formNames.CODE: {
        if (codeTypes[codeTypeNames.VERIFY_PHONE].needed) {
          dispatch(requestVerifyField({ field: 'phone_number' }));
        }
        break;
      }
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
