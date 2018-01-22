import { pathNames } from '../../Constants/universalConstants';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { setInputValueError } from '../uiActionsExternal';

const secondButtonCard = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'history')) {
    throw new Error(`Please enter a value for the 'history' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'resetStripeElement')) {
    throw new Error(`Please enter a value for the 'resetStripeElement' key - ${JSON.stringify(payload)}`);
  }

  return (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.external;
    const { history } = payload;

    const cardNameOnCard = forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD];
    const cardPromoCode = forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE];
    const cardStripe = forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE];

    const infoName = forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME];
    const infoEmail = forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL];
    const infoPhone = forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE];

    const signUpPassword = forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD];
    const signUpPassword2 =
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

    history.replace(pathNames.LOGIN);

    if (cardNameOnCard.value || cardNameOnCard.errorMessage) {
      cardNameOnCard.value = '';
      cardNameOnCard.errorMessage = '';

      dispatch(setInputValueError(cardNameOnCard));
    }

    if (cardPromoCode.value || cardPromoCode.errorMessage) {
      cardPromoCode.value = '';
      cardPromoCode.errorMessage = '';

      dispatch(setInputValueError(cardPromoCode));
    }

    if (cardStripe.value || cardStripe.errorMessage) {
      cardStripe.value = '';
      cardStripe.errorMessage = '';

      dispatch(setInputValueError(cardStripe));
      payload.resetStripeElement();
    }

    if (infoName.value || infoName.errorMessage) {
      infoName.value = '';
      infoName.errorMessage = '';

      dispatch(setInputValueError(infoName));
    }

    if (infoEmail.value || infoEmail.errorMessage) {
      infoEmail.value = '';
      infoEmail.errorMessage = '';

      dispatch(setInputValueError(infoEmail));
    }

    if (infoPhone.value || infoPhone.errorMessage) {
      infoPhone.value = '';
      infoPhone.errorMessage = '';

      dispatch(setInputValueError(infoPhone));
    }

    if (signUpPassword.value || signUpPassword.errorMessage) {
      signUpPassword.value = '';
      signUpPassword.errorMessage = '';

      dispatch(setInputValueError(signUpPassword));
    }

    if (signUpPassword2.value || signUpPassword2.errorMessage) {
      signUpPassword2.value = '';
      signUpPassword2.errorMessage = '';

      dispatch(setInputValueError(signUpPassword2));
    }

    return null;
  };
};

export default secondButtonCard;
