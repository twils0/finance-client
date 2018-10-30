import axios from 'axios';
import raven from 'raven-js';

import { requestStatusTypes, URLs, axiosConfig } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAccount';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';
import requestLogout from '../dataThunkAuth/requestLogout';
import { setAccountStatus } from '../dataActionsAccount';

import handleErrorCatch from '../../handleErrorCatch';

import { demo } from '../../../../mode.config.json';

const requestUpdateStripeFields = (payload) => {
  if (
    (!Object.prototype.hasOwnProperty.call(payload, 'element')
      || !Object.prototype.hasOwnProperty.call(payload, 'name'))
    && !Object.prototype.hasOwnProperty.call(payload, 'email')
    && !Object.prototype.hasOwnProperty.call(payload, 'promoCode')
  ) {
    throw new Error(
      `Please enter a value for either the 'name', 'email', or 'promoCode' key - ${JSON.stringify(
        payload,
      )}`,
    );
  }

  const plan = 'basic_plan';

  return async (dispatch, getState) => {
    const state = getState();

    if (
      state.data.account.status[statusNames.UPDATE_STRIPE_FIELDS_TOKEN].status
        !== requestStatusTypes.LOADING
      && state.data.account.status[statusNames.UPDATE_STRIPE_FIELDS_REQUEST].status
        !== requestStatusTypes.LOADING
    ) {
      dispatch(
        setAccountStatus({
          id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
          status: requestStatusTypes.LOADING,
        }),
      );

      let { user } = state.data.aws;

      if (!user) {
        ({ user } = await dispatch(requestAWSUser()));
      }

      let tokenId = null;

      if (!demo) {
        if (payload.element && payload.name) {
          const stripe = state.ui.app.stripe.stripeObject;

          try {
            const { token, error } = await stripe.createToken(payload.element, {
              name: payload.name,
            });

            if (error) {
              throw error;
            }

            tokenId = token.id;
          } catch (errorCatch) {
            const error = handleErrorCatch(errorCatch);

            dispatch(
              setAccountStatus({
                id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
                status: requestStatusTypes.ERROR,
              }),
            );

            raven.captureException(error, {
              logger: 'requestUpdateStripeFields',
            });

            return Promise.reject(error);
          }
        }
      }

      dispatch(
        setAccountStatus({
          id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
          status: requestStatusTypes.SUCCESS,
        }),
      );

      dispatch(
        setAccountStatus({
          id: statusNames.UPDATE_STRIPE_FIELDS_REQUEST,
          status: requestStatusTypes.LOADING,
        }),
      );

      try {
        if (!demo) {
          const idToken = user.signInUserSession.idToken.jwtToken;
          const accessToken = user.signInUserSession.accessToken.jwtToken;

          await axios.put(
            URLs.CUSTOMERS,
            {
              token: tokenId,
              email: payload.email,
              promoCode: payload.promoCode,
              plan,
            },
            {
              headers: {
                Authorization: idToken,
              },
              params: {
                accessToken,
              },
              ...axiosConfig.STRIPE,
            },
          );
        }
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(
          setAccountStatus({
            id: statusNames.UPDATE_STRIPE_FIELDS_REQUEST,
            status: requestStatusTypes.ERROR,
          }),
        );

        if (typeof error === 'object' && error && error.code === 'NotAuthorizedException') {
          dispatch(requestLogout());

          return null;
        }

        if (
          typeof error === 'object'
          && error
          && (error.raw
            || error.code === 'coupon_invalid'
            || error.code === 'coupon_expired'
            || error.code === 'UsernameExistsException')
        ) {
          return Promise.reject(error);
        }

        if (!demo) {
          raven.captureException(error, {
            logger: 'requestUpdateStripeFields',
          });
        }

        return Promise.reject(error);
      }

      dispatch(
        setAccountStatus({
          id: statusNames.UPDATE_STRIPE_FIELDS_REQUEST,
          status: requestStatusTypes.SUCCESS,
        }),
      );
    }

    return null;
  };
};

export default requestUpdateStripeFields;
