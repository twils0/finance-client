import { fieldNames } from '../../Constants/dataConstantsAccount';
import {
  buttonNames,
  buttonTexts,
  formNames,
  inputNames,
} from '../../Constants/uiConstantsAccount';
import {
  setInputValueError,
  setFormEdit,
  setButtonText,
  setButtonVisible,
} from '../uiActionsAccount';

const cancelBilling = () => (dispatch, getState) => {
  const state = getState();

  const { forms } = state.ui.internal.account;
  const { fields } = state.data.account;

  const billingNameOnCard =
    forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
  const billingPromoCode =
    forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];
  const billingStripe = forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE];

  if (state.ui.internal.account.forms[formNames.BILLING].edit) {
    dispatch(setFormEdit({ id: formNames.BILLING, edit: false }));
  }
  if (state.ui.internal.account.buttons[buttonNames.FIRST].text !== buttonTexts.EDIT) {
    dispatch(setButtonText({ id: buttonNames.FIRST, text: buttonTexts.EDIT }));
  }
  if (state.ui.internal.account.buttons[buttonNames.SECOND].visible) {
    dispatch(setButtonVisible({ id: buttonNames.SECOND, visible: false }));
  }

  if (
    fields[fieldNames.NAME_ON_CARD].value !== billingNameOnCard.value ||
    billingNameOnCard.errorMessage
  ) {
    billingNameOnCard.value = fields[fieldNames.NAME_ON_CARD].value;
    billingNameOnCard.errorMessage = '';

    dispatch(setInputValueError(billingNameOnCard));
  }

  if (
    fields[fieldNames.PROMO_CODE].value !== billingPromoCode.value ||
    billingPromoCode.errorMessage
  ) {
    billingPromoCode.value = fields[fieldNames.PROMO_CODE].value;
    billingPromoCode.errorMessage = '';

    dispatch(setInputValueError(billingPromoCode));
  }

  if (billingStripe.value || billingStripe.errorMessage) {
    billingStripe.value = '';
    billingStripe.errorMessage = '';

    dispatch(setInputValueError(billingStripe));
  }

  return null;
};

export default cancelBilling;
