import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { setAWSStatus, setAWSUser } from '../dataActionsAWS';
import requestLogout from '../dataThunkAuth/requestLogout';

import { demo } from '../../../../mode.config.json';

const requestAWSUser = () => async (dispatch, getState) => {
  const state = getState();

  if (state.data.aws.status !== requestStatusTypes.LOADING) {
    dispatch(setAWSStatus({ status: requestStatusTypes.LOADING }));

    let user = null;

    try {
      if (!demo) {
        user = await Auth.currentUserPoolUser();
      }
    } catch (errorCatch) {
      const error = handleErrorCatch(errorCatch);

      dispatch(setAWSStatus({ status: requestStatusTypes.ERROR }));

      if (
        (typeof error === 'string'
          && (error === 'not authenticated' || error === 'No current user in userPool'))
        || (typeof error === 'object' && error && error.code === 'NotAuthorizedException')
      ) {
        dispatch(requestLogout());

        return null;
      }

      if (!demo) {
        raven.captureException(error, {
          logger: 'requestAWSUser',
        });
      }

      return Promise.reject(error);
    }

    if (!demo) {
      dispatch(setAWSUser({ user }));
    }
    dispatch(setAWSStatus({ status: requestStatusTypes.SUCCESS }));

    return { user };
  }

  return null;
};

export default requestAWSUser;
