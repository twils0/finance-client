import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { setAuthStatus } from '../dataActionsAuth';

import { demo } from '../../../../mode.config.json';

const requestResetPassword = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'email')) {
    throw Error(`Please enter a value for the 'email' key - ${payload}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'code')) {
    throw new Error(`Please enter a value for the 'code' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'password')) {
    throw new Error(`Please enter a value for the 'password' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();

    if (state.data.auth.status[statusNames.RESET_PASSWORD].status !== requestStatusTypes.LOADING) {
      dispatch(
        setAuthStatus({
          id: statusNames.RESET_PASSWORD,
          status: requestStatusTypes.LOADING,
        }),
      );

      try {
        if (!demo) {
          await Auth.forgotPasswordSubmit(payload.email, payload.code, payload.password);
        }
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(
          setAuthStatus({
            id: statusNames.RESET_PASSWORD,
            status: requestStatusTypes.ERROR,
          }),
        );

        if (typeof error === 'object' && error && error.code === 'CodeMismatchException') {
          return Promise.reject(error);
        }

        if (!demo) {
          raven.captureException(error, {
            logger: 'requestResetPassword',
          });
        }

        return Promise.reject(error);
      }

      dispatch(
        setAuthStatus({
          id: statusNames.RESET_PASSWORD,
          status: requestStatusTypes.SUCCESS,
        }),
      );
    }

    return null;
  };
};

export default requestResetPassword;
