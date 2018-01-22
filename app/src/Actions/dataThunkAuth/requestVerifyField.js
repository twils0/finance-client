import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import requestLogout from './requestLogout';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';
import { setAuthStatus } from '../dataActionsAuth';

import handleErrorCatch from '../../handleErrorCatch';

const requestVerifyField = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'field')) {
    throw new Error(`Please enter a value for the 'field' key - ${JSON.stringify(payload)}`);
  }
  if (payload.field !== 'phone_number') {
    throw new Error(
      `Please enter 'phone_number' as the value for the 'field' key - ${JSON.stringify(payload)}`,
    );
  }

  return async (dispatch, getState) => {
    const state = getState();

    if (state.data.auth.status[statusNames.VERIFY_PHONE].status !== requestStatusTypes.LOADING) {
      switch (payload.field) {
        case 'phone_number':
          dispatch(
            setAuthStatus({
              id: statusNames.VERIFY_PHONE,
              status: requestStatusTypes.LOADING,
            }),
          );
          break;
        default:
          break;
      }

      let { user } = state.data.aws;

      try {
        if (!user) {
          ({ user } = await dispatch(requestAWSUser()));
        }

        await Auth.verifyUserAttribute(user, payload.field);
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        switch (payload.field) {
          case 'phone_number':
            dispatch(
              setAuthStatus({
                id: statusNames.VERIFY_PHONE,
                status: requestStatusTypes.ERROR,
              }),
            );
            break;
          default:
            break;
        }

        if (typeof error === 'object' && error && error.code === 'NotAuthorizedException') {
          dispatch(requestLogout());

          return null;
        }

        raven.captureException(error, {
          logger: 'requestVerifyField',
        });

        return Promise.reject({ field: payload.field, error });
      }

      switch (payload.field) {
        case 'phone_number':
          dispatch(
            setAuthStatus({
              id: statusNames.VERIFY_PHONE,
              status: requestStatusTypes.SUCCESS,
            }),
          );
          break;
        default:
          break;
      }
    }

    return null;
  };
};

export default requestVerifyField;
