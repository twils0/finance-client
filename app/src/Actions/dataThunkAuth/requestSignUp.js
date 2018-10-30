import axios from 'axios';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes, URLs, axiosConfig } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { setAuthStatus } from '../dataActionsAuth';

import { demo } from '../../../../mode.config.json';

const requestSignUp = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'element')) {
    throw new Error(`Please enter a value for the 'element' key - ${JSON.stringify(payload)}`);
  }
  if (typeof payload.element !== 'object' || payload.element.constructor === Array) {
    throw new Error(
      `Please provide an object value for the 'element' key - ${JSON.stringify(payload)}`,
    );
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'nameOnCard')) {
    throw new Error(`Please enter a value for the 'name' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'promoCode')) {
    throw new Error(`Please enter a value for the 'promoCode' key - ${JSON.stringify(payload)}`);
  }

  if (!Object.prototype.hasOwnProperty.call(payload, 'email')) {
    throw new Error(`Please enter a value for the 'email' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'password')) {
    throw new Error(`Please enter a value for the 'password' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'phone')) {
    throw new Error(`Please enter a value for the 'phone' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'name')) {
    throw new Error(`Please enter a value for the 'name' key - ${JSON.stringify(payload)}`);
  }

  const plan = 'basic_plan';

  return async (dispatch, getState) => {
    const state = getState();

    if (state.data.auth.status[statusNames.SIGN_UP].status !== requestStatusTypes.LOADING) {
      dispatch(setAuthStatus({ id: statusNames.SIGN_UP, status: requestStatusTypes.LOADING }));

      try {
        if (!demo) {
          const stripe = state.ui.app.stripe.stripeObject;
          const { token, error } = await stripe.createToken(payload.element, {
            name: payload.name,
          });

          if (error) {
            throw error;
          }

          const signUpPayload = { ...payload };
          signUpPayload.token = token.id;
          signUpPayload.plan = plan;
          delete signUpPayload.element;
          delete signUpPayload.nameOnCard;

          await axios.post(URLs.CUSTOMERS, signUpPayload, axiosConfig.STRIPE);
        }
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(
          setAuthStatus({
            id: statusNames.SIGN_UP,
            status: requestStatusTypes.ERROR,
          }),
        );

        if (
          typeof error === 'object'
          && error
          && (error.raw
            || error.code === 'UsernameExistsException'
            || error.code === 'coupon_invalid'
            || error.code === 'coupon_expired'
            || error.code === 'card_declined')
        ) {
          return Promise.reject(error);
        }

        if (!demo) {
          raven.captureException(error, {
            logger: 'requestSignUp',
          });
        }

        return Promise.reject(error);
      }

      dispatch(
        setAuthStatus({
          id: statusNames.SIGN_UP,
          status: requestStatusTypes.SUCCESS,
        }),
      );
    }

    return null;
  };
};

export default requestSignUp;
