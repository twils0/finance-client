import isEmail from 'validator/lib/isEmail';
import equals from 'validator/lib/equals';
import isMobilePhone from 'validator/lib/isMobilePhone';

import { pathNames, requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { errorMessages } from '../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { setAuthStatus } from '../dataActionsAuth';
import requestSignUp from '../dataThunkAuth/requestSignUp';
import { setCurrentForm, setInputValueError } from '../uiActionsExternal';

const firstButtonSignUp = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'history')) {
    throw new Error(`Please enter a value for the 'history' key - ${JSON.stringify(payload)}`);
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

  return async (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.external;

    const cardNameOnCard = forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD];
    const cardPromoCode = forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE];
    const cardStripe = forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE];

    const infoName = forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME];
    const infoEmail = forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL];
    const infoPhone = forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE];

    const signUpPassword = forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD];
    const signUpPassword2 = forms[formNames.SIGN_UP]
      .inputs[inputNames[formNames.SIGN_UP].PASSWORD2];
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

    if (!cardNameOnCard.value) {
      cardNameOnCard.errorMessage = errorMessages.NO_NAME_ON_CARD;
    }

    if (cardStripe.value !== 'complete') {
      if (!cardStripe.value) {
        cardStripe.errorMessage = errorMessages.NO_STRIPE;
      } else {
        cardStripe.errorMessage = cardStripe.value;
      }
    }

    if (!infoName.value) {
      infoName.errorMessage = errorMessages.NO_NAME;
    }

    if (!infoEmail.value) {
      infoEmail.errorMessage = errorMessages.NO_EMAIL;
    } else if (!isEmail(infoEmail.value)) {
      infoEmail.errorMessage = errorMessages.INVALID_EMAIL;
    }

    const sanitizedPhone = infoPhone.value.replace(/[-() ]/g, '');
    if (!sanitizedPhone) {
      infoPhone.errorMessage = errorMessages.NO_PHONE;
    } else if (!isMobilePhone(sanitizedPhone, 'en-US')) {
      infoPhone.errorMessage = errorMessages.INVALID_PHONE;
    }

    if (!signUpPassword.value) {
      signUpPassword.errorMessage = errorMessages.NO_PASSWORD;
    } else if (!signUpPassword.value || !passwordRegex.test(signUpPassword.value)) {
      signUpPassword.errorMessage = errorMessages.INVALID_PASSWORD;
    }

    if (!equals(signUpPassword.value, signUpPassword2.value)) {
      signUpPassword2.errorMessage = errorMessages.NO_MATCH_PASSWORD;
    }

    if (
      cardNameOnCard.errorMessage
      || cardPromoCode.errorMessage
      || cardStripe.errorMessage
      || infoName.errorMessage
      || infoEmail.errorMessage
      || infoPhone.errorMessage
      || signUpPassword.errorMessage
      || signUpPassword2.errorMessage
    ) {
      dispatch(setInputValueError(cardNameOnCard));
      dispatch(setInputValueError(cardPromoCode));
      dispatch(setInputValueError(cardStripe));
      dispatch(setInputValueError(infoName));
      dispatch(setInputValueError(infoEmail));
      dispatch(setInputValueError(infoPhone));
      dispatch(setInputValueError(signUpPassword));
      dispatch(setInputValueError(signUpPassword2));

      if (!(signUpPassword.errorMessage || signUpPassword2.errorMessage)) {
        if (cardNameOnCard.errorMessage || cardPromoCode.errorMessage || cardStripe.errorMessage) {
          dispatch(setCurrentForm({ current: formNames.CARD }));

          signUpPassword.value = '';
          signUpPassword2.value = '';

          dispatch(setInputValueError(signUpPassword));
          dispatch(setInputValueError(signUpPassword2));
        } else if (infoName.errorMessage || infoEmail.errorMessage || infoPhone.errorMessage) {
          dispatch(setCurrentForm({ current: formNames.INFO }));

          signUpPassword.value = '';
          signUpPassword2.value = '';

          dispatch(setInputValueError(signUpPassword));
          dispatch(setInputValueError(signUpPassword2));
        }
      }
    } else {
      const E164Phone = `+1${sanitizedPhone}`;
      const signUpPayload = {
        element: payload.stripeElement,
        nameOnCard: cardNameOnCard.value,
        promoCode: cardPromoCode.value,
        email: infoEmail.value,
        phone: E164Phone,
        name: infoName.value,
        password: signUpPassword.value,
      };

      try {
        await dispatch(requestSignUp(signUpPayload));

        payload.history.replace(pathNames.LOGIN);

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

        if (infoPhone.value || infoPhone.errorMessage) {
          infoPhone.value = '';
          infoPhone.errorMessage = '';

          dispatch(setInputValueError(infoPhone));
        }

        if (infoEmail.value || infoEmail.errorMessage) {
          infoEmail.value = '';
          infoEmail.errorMessage = '';

          dispatch(setInputValueError(infoEmail));
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

        dispatch(
          setAuthStatus({
            id: statusNames.SIGN_UP,
            status: requestStatusTypes.IDLE,
          }),
        );
      } catch (error) {
        if (typeof error === 'object' && error && error.raw) {
          cardStripe.value = error.raw.message;
          cardStripe.errorMessage = error.raw.message;

          dispatch(setInputValueError(cardStripe));

          dispatch(setCurrentForm({ current: formNames.CARD }));
        } else if (typeof error === 'object' && error && error.code) {
          switch (error.code) {
            case 'UsernameExistsException': {
              infoEmail.errorMessage = errorMessages.EMAIL_IN_USE;
              dispatch(setInputValueError(infoEmail));

              dispatch(setCurrentForm({ current: formNames.INFO }));
              break;
            }
            case 'coupon_invalid': {
              cardPromoCode.errorMessage = errorMessages.PROMO_CODE_INVALID;
              dispatch(setInputValueError(cardPromoCode));

              dispatch(setCurrentForm({ current: formNames.CARD }));
              break;
            }
            case 'coupon_expired': {
              cardPromoCode.errorMessage = errorMessages.PROMO_CODE_EXPIRED;
              dispatch(setInputValueError(cardPromoCode));

              dispatch(setCurrentForm({ current: formNames.CARD }));
              break;
            }
            default: {
              signUpPassword2.errorMessage = errorMessages.INTERNAL_ERROR;
              break;
            }
          }
        }

        signUpPassword.value = '';
        signUpPassword2.value = '';

        dispatch(setInputValueError(signUpPassword));
        dispatch(setInputValueError(signUpPassword2));
      }
    }

    return null;
  };
};

export default firstButtonSignUp;
