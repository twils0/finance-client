import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { setAuthStatus } from '../dataActionsAuth';

import { demo } from '../../../../mode.config.json';

const requestForgotPassword = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'email')) {
    throw new Error(`Please enter a value for the 'email' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();

    if (state.data.auth.status[statusNames.FORGOT_PASSWORD].status !== requestStatusTypes.LOADING) {
      dispatch(
        setAuthStatus({
          id: statusNames.FORGOT_PASSWORD,
          status: requestStatusTypes.LOADING,
        }),
      );

      try {
        if (!demo) {
          await Auth.forgotPassword(payload.email);
        }
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(
          setAuthStatus({
            id: statusNames.FORGOT_PASSWORD,
            status: requestStatusTypes.ERROR,
          }),
        );

        if (
          typeof error === 'object'
          && error
          && (error.code === 'LimitExceededException'
            || error.code === 'UserNotFoundException'
            || error.code === 'InvalidParameterException')
        ) {
          return Promise.reject(error);
        }

        if (!demo) {
          raven.captureException(error, {
            logger: 'requestForgotPassword',
          });
        }

        return Promise.reject(error);
      }

      dispatch(
        setAuthStatus({
          id: statusNames.FORGOT_PASSWORD,
          status: requestStatusTypes.SUCCESS,
        }),
      );
    }
    return null;
  };
};

export default requestForgotPassword;
