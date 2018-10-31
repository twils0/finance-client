import axios from 'axios';
import raven from 'raven-js';

import { requestStatusTypes, URLs, axiosConfig } from '../../Constants/universalConstants';
import { statusNames, fieldNames } from '../../Constants/dataConstantsAccount';
import requestLogout from '../dataThunkAuth/requestLogout';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';
import { setAccountStatus, setFields } from '../dataActionsAccount';

import handleErrorCatch from '../../handleErrorCatch';

import { demo } from '../../../../mode.config.json';
import demoStripe from '../../../../demoConfig/demoStripe';

const loadStripeFields = () => async (dispatch, getState) => {
  const state = getState();

  if (state.data.account.status[statusNames.STRIPE_FIELDS].status !== requestStatusTypes.LOADING) {
    dispatch(
      setAccountStatus({
        id: statusNames.STRIPE_FIELDS,
        status: requestStatusTypes.LOADING,
      }),
    );

    let { user } = state.data.aws;
    const payload = {};

    try {
      if (!user) {
        ({ user } = await dispatch(requestAWSUser()));
      }

      let stripePayload = null;

      if (!demo) {
        const idToken = user.signInUserSession.idToken.jwtToken;
        const accessToken = user.signInUserSession.accessToken.jwtToken;

        const response = await axios.get(URLs.CUSTOMERS, {
          headers: {
            Authorization: idToken,
          },
          params: {
            accessToken,
          },
          ...axiosConfig.STRIPE,
        });

        stripePayload = response.data.body;
      } else {
        stripePayload = demoStripe;
      }

      payload[fieldNames.NAME_ON_CARD] = {
        id: fieldNames.NAME_ON_CARD,
        value: stripePayload.nameOnCard,
      };
      payload[fieldNames.PROMO_CODE] = {
        id: fieldNames.PROMO_CODE,
        value: stripePayload.promoCode,
      };
      payload[fieldNames.PROMO_CODE_VALID] = {
        id: fieldNames.PROMO_CODE_VALID,
        value: stripePayload.promoCodeValid,
      };
    } catch (errorCatch) {
      const error = handleErrorCatch(errorCatch);

      dispatch(
        setAccountStatus({
          id: statusNames.STRIPE_FIELDS,
          status: requestStatusTypes.ERROR,
        }),
      );

      if (typeof error === 'object' && error && error.code === 'NotAuthorizedException') {
        dispatch(requestLogout());

        return null;
      }

      if (!demo) {
        raven.captureException(error, {
          logger: 'loadStripeFields',
        });
      }

      return Promise.reject(error);
    }

    dispatch(setFields(payload));

    dispatch(
      setAccountStatus({
        id: statusNames.STRIPE_FIELDS,
        status: requestStatusTypes.SUCCESS,
      }),
    );
  }

  return null;
};

export default loadStripeFields;
