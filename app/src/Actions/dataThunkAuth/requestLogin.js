import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames, codeTypeNames } from '../../Constants/dataConstantsAuth';
import { setAuthStatus, setAuthenticated } from '../dataActionsAuth';
import { setAWSStatus, setAWSUser } from '../dataActionsAWS';
import requestSignOutOtherDevices from './requestSignOutOtherDevices';
import loadAWSFields from '../dataThunkAccount/loadAWSFields';
import loadSecurities from '../dataThunkWatchlist/loadSecurities';
import requestVerifyField from './requestVerifyField';
import requestVerifyEmail from './requestVerifyEmail';
import { fieldNames } from '../../Constants/dataConstantsAccount';

import { demo } from '../../../../mode.config.json';

const requestLogin = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'email')) {
    throw new Error(`Please enter a value for the 'email' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'password')) {
    throw new Error(`Please enter a value for the 'password' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    let state = getState();

    if (state.data.auth.status[statusNames.LOGIN].status !== requestStatusTypes.LOADING) {
      dispatch(setAuthStatus({ id: statusNames.LOGIN, status: requestStatusTypes.LOADING }));
      dispatch(setAWSStatus({ status: requestStatusTypes.LOADING }));

      let user = null;

      try {
        if (!demo) {
          raven.setUserContext({
            email: payload.email,
          });

          user = await Auth.signIn(payload.email, payload.password);

          dispatch(setAWSUser({ user }));
          dispatch(setAWSStatus({ status: requestStatusTypes.SUCCESS }));
        }
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(
          setAuthStatus({
            id: statusNames.LOGIN,
            status: requestStatusTypes.ERROR,
          }),
        );
        dispatch(setAWSStatus({ status: requestStatusTypes.ERROR }));

        if (
          typeof error === 'object'
          && error
          && (error.code === 'LimitExceededException'
            || error.code === 'UserNotFoundException'
            || (error.code === 'NotAuthorizedException'
              && error.message === 'Incorrect username or password.')
            || error.code === 'UserNotConfirmedException')
        ) {
          return Promise.reject(error);
        }

        if (!demo) {
          raven.captureException(error, {
            logger: 'requestLogin',
          });
        }

        return Promise.reject(error);
      }

      let mfa = true;

      if (!demo) {
        if (user.challengeName !== 'SMS_MFA') {
          mfa = false;

          try {
            await dispatch(requestSignOutOtherDevices({ ...payload, remembered: true }));

            dispatch(loadSecurities());

            await dispatch(loadAWSFields());

            state = getState();

            if (state.data.auth.codeTypes[codeTypeNames.VERIFY_PHONE].needed) {
              await dispatch(requestVerifyField({ field: 'phone_number' }));
            } else if (
              state.data.auth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed
              || (state.data.auth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed
                && state.data.account.fields[fieldNames.EMAIL_ADDITIONAL].value)
            ) {
              await dispatch(requestVerifyEmail());
            }

            if (
              !state.data.auth.codeTypes[codeTypeNames.VERIFY_PHONE].needed
              && !state.data.auth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed
              && (!state.data.auth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed
                || !state.data.account.fields[fieldNames.EMAIL_ADDITIONAL].value)
            ) {
              dispatch(setAuthenticated({ authenticated: true }));
            }
          } catch (errorCatch) {
            const error = handleErrorCatch(errorCatch);

            dispatch(
              setAuthStatus({
                id: statusNames.LOGIN,
                status: requestStatusTypes.ERROR,
              }),
            );

            if (!demo) {
              raven.captureException(error, {
                logger: 'requestLogin',
              });
            }

            return Promise.reject(error);
          }
        }
      }

      dispatch(
        setAuthStatus({
          id: statusNames.LOGIN,
          status: requestStatusTypes.SUCCESS,
        }),
      );

      return mfa;
    }

    return null;
  };
};

export default requestLogin;
