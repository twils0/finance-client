import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames, codeTypeNames } from '../../Constants/dataConstantsAuth';
import { setAuthStatus, setCodeType } from '../dataActionsAuth';
import requestLogout from './requestLogout';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';

import handleErrorCatch from '../../handleErrorCatch';

import { demo } from '../../../../mode.config.json';

const requestVerifyFieldConfirm = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'field')) {
    throw new Error(`Please enter a value for the 'field' key - ${JSON.stringify(payload)}`);
  }
  if (payload.field !== 'phone_number') {
    throw new Error(
      `Please enter 'phone_number' as the value for the 'field' key - ${JSON.stringify(payload)}`,
    );
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'code')) {
    throw new Error(`Please enter a value for the 'code' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();

    if (
      payload.field === 'phone_number'
      && state.data.auth.status[statusNames.VERIFY_PHONE_CODE].status !== requestStatusTypes.LOADING
    ) {
      switch (payload.field) {
        case 'phone_number':
          dispatch(
            setAuthStatus({
              id: statusNames.VERIFY_PHONE_CODE,
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

        if (!demo) {
          await Auth.verifyUserAttributeSubmit(user, payload.field, payload.code);
        }
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        switch (payload.field) {
          case 'phone_number':
            dispatch(
              setAuthStatus({
                id: statusNames.VERIFY_PHONE_CODE,
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

        if (
          typeof error === 'object'
          && error
          && (error.code === 'LimitExceededException' || error.code === 'CodeMismatchException')
        ) {
          return Promise.reject({ field: payload.field, error });
        }

        if (!demo) {
          raven.captureException(error, {
            logger: 'requestVerifyFieldConfirm',
          });
        }

        return Promise.reject({ field: payload.field, error });
      }

      switch (payload.field) {
        case 'phone_number':
          dispatch(setCodeType({ id: codeTypeNames.VERIFY_PHONE, needed: false }));
          dispatch(
            setAuthStatus({
              id: statusNames.VERIFY_PHONE_CODE,
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

export default requestVerifyFieldConfirm;
