import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { setAuthStatus } from '../dataActionsAuth';

import { demo } from '../../../../mode.config.json';

const requestSignUpResendPhone = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'email')) {
    throw Error(`Please enter a value for the 'email' key - ${payload}`);
  }

  return async (dispatch, getState) => {
    const state = getState();

    if (state.data.auth.status[statusNames.VERIFY_PHONE].status !== requestStatusTypes.LOADING) {
      dispatch(
        setAuthStatus({
          id: statusNames.VERIFY_PHONE,
          status: requestStatusTypes.LOADING,
        }),
      );

      try {
        if (!demo) {
          await Auth.resendSignUp(payload.email);
        }
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(
          setAuthStatus({
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.ERROR,
          }),
        );

        if (!demo) {
          raven.captureException(error, {
            logger: 'requestSignUpResendPhone',
          });
        }

        return Promise.reject(error);
      }

      dispatch(
        setAuthStatus({
          id: statusNames.VERIFY_PHONE,
          status: requestStatusTypes.SUCCESS,
        }),
      );
    }

    return null;
  };
};

export default requestSignUpResendPhone;
