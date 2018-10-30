import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames, codeTypeNames } from '../../Constants/dataConstantsAuth';
import { setCodeType, setAuthStatus } from '../dataActionsAuth';
import requestVerifyFieldConfirm from './requestVerifyFieldConfirm';

import { demo } from '../../../../mode.config.json';

const requestSignUpConfirmPhone = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'email')) {
    throw Error(`Please enter a value for the 'email' key - ${payload}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'code')) {
    throw new Error(`Please enter a value for the 'code' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();

    if (
      state.data.auth.status[statusNames.VERIFY_PHONE_CODE].status !== requestStatusTypes.LOADING
    ) {
      dispatch(
        setAuthStatus({
          id: statusNames.VERIFY_PHONE_CODE,
          status: requestStatusTypes.LOADING,
        }),
      );

      try {
        if (!demo) {
          await Auth.confirmSignUp(payload.email, payload.code);
        }
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        if (error.code === 'NotAuthorizedException' && error.message.indexOf('UNCONFIRMED') > -1) {
          try {
            await dispatch(
              requestVerifyFieldConfirm({
                field: 'phone_number',
                code: payload.code,
              }),
            );

            dispatch(setCodeType({ id: codeTypeNames.VERIFY_PHONE_CODE, needed: false }));
            dispatch(
              setAuthStatus({
                id: statusNames.VERIFY_PHONE_CODE,
                status: requestStatusTypes.SUCCESS,
              }),
            );

            return null;
          } catch (errorCatch2) {
            const error2 = handleErrorCatch(errorCatch2);

            dispatch(
              setAuthStatus({
                id: statusNames.VERIFY_PHONE_CODE,
                status: requestStatusTypes.ERROR,
              }),
            );

            return Promise.reject(error2.error);
          }
        }

        dispatch(
          setAuthStatus({
            id: statusNames.VERIFY_PHONE_CODE,
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

        if (!demo) {
          raven.captureException(error, {
            logger: 'requestSignUpConfirmPhone',
          });
        }

        return Promise.reject(error);
      }

      dispatch(setCodeType({ id: codeTypeNames.VERIFY_PHONE_CODE, needed: false }));
      dispatch(
        setAuthStatus({
          id: statusNames.VERIFY_PHONE_CODE,
          status: requestStatusTypes.SUCCESS,
        }),
      );
    }

    return null;
  };
};

export default requestSignUpConfirmPhone;
