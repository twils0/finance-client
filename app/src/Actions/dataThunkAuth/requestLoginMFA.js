import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames, codeTypeNames } from '../../Constants/dataConstantsAuth';
import { setAuthStatus } from '../dataActionsAuth';
import requestVerifyEmail from './requestVerifyEmail';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';
import loadAWSFields from '../dataThunkAccount/loadAWSFields';
import loadSecurities from '../dataThunkWatchlist/loadSecurities';

const requestLoginMFA = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'code')) {
    throw new Error(`Please enter a value for the 'code' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    let state = getState();

    if (state.data.auth.status[statusNames.LOGIN_MFA].status !== requestStatusTypes.LOADING) {
      dispatch(
        setAuthStatus({
          id: statusNames.LOGIN_MFA,
          status: requestStatusTypes.LOADING,
        }),
      );

      let { user } = state.data.aws;

      try {
        if (!user) {
          ({ user } = await dispatch(requestAWSUser()));
        }

        await Auth.confirmSignIn(user, payload.code);

        dispatch(loadSecurities());

        await dispatch(loadAWSFields());

        state = getState();

        if (
          state.data.auth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed
          || state.data.auth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed
        ) {
          await dispatch(requestVerifyEmail());
        }
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(
          setAuthStatus({
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.ERROR,
          }),
        );

        if (
          typeof error === 'object'
          && error
          && (error.code === 'LimitExceededException'
            || error.code === 'ExpiredCodeException'
            || error.code === 'CodeMismatchException')
        ) {
          return Promise.reject(error);
        }

        raven.captureException(error, {
          logger: 'requestLoginMFA',
        });

        return Promise.reject(error);
      }

      dispatch(
        setAuthStatus({
          id: statusNames.LOGIN_MFA,
          status: requestStatusTypes.SUCCESS,
        }),
      );
    }
    return null;
  };
};

export default requestLoginMFA;
