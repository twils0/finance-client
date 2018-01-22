import { fieldNames } from '../../Constants/dataConstantsAccount';
import { errorMessages } from '../../Constants/uiConstantsApp';
import {
  formNames,
  buttonNames,
  buttonTexts,
  inputNames,
} from '../../Constants/uiConstantsAccount';
import { setField } from '../dataActionsAccount';
import requestUpdateStripeFields from '../dataThunkAccount/requestUpdateStripeFields';
import {
  setFormEdit,
  setButtonText,
  setButtonVisible,
  setInputValueError,
} from '../uiActionsAccount';
import handleCancel from '../uiThunkAccount/handleCancel';

const firstButtonBilling = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'stripeElement')) {
    throw new Error(`Please enter a value for the 'stripeElement' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'resetStripeElement')) {
    throw new Error(`Please enter a value for the 'resetStripeElement' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();
    const secondButtonVisible = state.ui.internal.account.buttons[buttonNames.SECOND].visible;

    if (!secondButtonVisible) {
      const billingFormEdit = state.ui.internal.account.forms[formNames.BILLING].edit;
      const firstButtonText = state.ui.internal.account.buttons[buttonNames.FIRST].text;
      const secondButtonText = state.ui.internal.account.buttons[buttonNames.SECOND].text;

      if (!billingFormEdit) {
        dispatch(setFormEdit({ id: formNames.BILLING, edit: true }));
      }
      if (firstButtonText !== buttonTexts.UPDATE) {
        dispatch(setButtonText({ id: buttonNames.FIRST, text: buttonTexts.UPDATE }));
      }
      if (secondButtonText !== buttonTexts.CANCEL) {
        dispatch(setButtonText({ id: buttonNames.SECOND, text: buttonTexts.CANCEL }));
      }

      dispatch(setButtonVisible({ id: buttonNames.SECOND, visible: true }));
    } else {
      const { forms } = state.ui.internal.account;
      const { fields } = state.data.account;

      const billingNameOnCard =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
      const billingPromoCode =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];
      const billingStripe = forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE];

      if (!billingNameOnCard.value) {
        billingNameOnCard.errorMessage = errorMessages.NO_NAME_ON_CARD;
      }

      if (billingStripe.value && billingStripe.value !== 'complete') {
        billingStripe.errorMessage = billingStripe.value;
      }

      if (
        billingNameOnCard.errorMessage ||
        billingPromoCode.errorMessage ||
        billingStripe.errorMessage
      ) {
        dispatch(setInputValueError(billingNameOnCard));
        dispatch(setInputValueError(billingPromoCode));
        dispatch(setInputValueError(billingStripe));
      } else {
        const stripePayload = {};

        if (fields[fieldNames.PROMO_CODE].value !== billingPromoCode.value) {
          stripePayload.promoCode = billingPromoCode.value;
        }

        if (billingStripe.value === 'complete') {
          stripePayload.name = billingNameOnCard.value;
          stripePayload.element = payload.stripeElement;
        }

        if (Object.keys(payload).length > 0) {
          try {
            await dispatch(requestUpdateStripeFields(stripePayload));

            if (fields[fieldNames.NAME_ON_CARD].value !== billingNameOnCard.value) {
              dispatch(setField({ id: fieldNames.NAME_ON_CARD, value: billingNameOnCard.value }));
            }

            if (fields[fieldNames.PROMO_CODE].value !== billingPromoCode.value) {
              dispatch(setField({ id: fieldNames.PROMO_CODE, value: billingPromoCode.value }));
            }

            payload.resetStripeElement();

            dispatch(handleCancel());
          } catch (error) {
            if (typeof error === 'object' && error && error.raw) {
              billingStripe.value = error.raw.message;
              billingStripe.errorMessage = error.raw.message;

              dispatch(setInputValueError(billingStripe));
            } else if (typeof error === 'object' && error && error.code) {
              switch (error.code) {
                case 'coupon_invalid': {
                  billingPromoCode.errorMessage = errorMessages.PROMO_CODE_INVALID;
                  dispatch(setInputValueError(billingPromoCode));
                  break;
                }
                case 'coupon_expired': {
                  billingPromoCode.errorMessage = errorMessages.PROMO_CODE_EXPIRED;
                  dispatch(setInputValueError(billingPromoCode));
                  break;
                }
                default: {
                  billingStripe.errorMessage = errorMessages.INTERNAL_ERROR;
                  dispatch(setInputValueError(billingStripe));
                  break;
                }
              }
            }
          }
        } else {
          dispatch(handleCancel());
        }
      }
    }

    return null;
  };
};

export default firstButtonBilling;
