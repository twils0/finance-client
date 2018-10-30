import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { setAuthStatus } from '../dataActionsAuth';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';

import { demo } from '../../../../mode.config.json';

const requestChangePassword = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'oldPassword')) {
    throw Error(`Please enter a value for the 'oldPassword' key - ${payload}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'newPassword')) {
    throw Error(`Please enter a value for the 'newPassword' key - ${payload}`);
  }

  return async (dispatch, getState) => {
    const state = getState();

    if (state.data.auth.status[statusNames.CHANGE_PASSWORD].status !== requestStatusTypes.LOADING) {
      dispatch(
        setAuthStatus({
          id: statusNames.CHANGE_PASSWORD,
          status: requestStatusTypes.LOADING,
        }),
      );

      let { user } = state.data.aws;

      try {
        if (!user) {
          ({ user } = await dispatch(requestAWSUser()));
        }

        if (!demo) {
          await Auth.changePassword(user, payload.oldPassword, payload.newPassword);
        }
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(
          setAuthStatus({
            id: statusNames.CHANGE_PASSWORD,
            status: requestStatusTypes.ERROR,
          }),
        );

        if (
          typeof error === 'object'
          && error
          && error.code === 'NotAuthorizedException'
          && error.message === 'Incorrect username or password.'
        ) {
          return Promise.reject(error);
        }

        if (!demo) {
          raven.captureException(error, {
            logger: 'requestChangePassword',
          });
        }

        return Promise.reject(error);
      }

      dispatch(
        setAuthStatus({
          id: statusNames.CHANGE_PASSWORD,
          status: requestStatusTypes.SUCCESS,
        }),
      );
    }

    return null;
  };
};

export default requestChangePassword;
