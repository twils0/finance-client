import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { setAuthStatus } from '../dataActionsAuth';

const requestSignUpResendPhone = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'email')) {
    throw Error(`Please enter a value for the 'email' key - ${payload}`);
  }

  return async (dispatch, getState) => {
    const state = getState();

    if (state.data.auth.status[statusNames.VERIFY_PHONE].status !== requestStatusTypes.LOADING) {
      dispatch(setAuthStatus({
        id: statusNames.VERIFY_PHONE,
        status: requestStatusTypes.LOADING,
      }));

      try {
        await Auth.resendSignUp(payload.email);
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(setAuthStatus({
          id: statusNames.VERIFY_PHONE,
          status: requestStatusTypes.ERROR,
        }));

        raven.captureException(error, {
          logger: 'requestSignUpResendPhone',
        });

        return Promise.reject(error);
      }

      dispatch(setAuthStatus({
        id: statusNames.VERIFY_PHONE,
        status: requestStatusTypes.SUCCESS,
      }));
    }

    return null;
  };
};

export default requestSignUpResendPhone;
