import axios from 'axios';
import raven from 'raven-js';

import { requestStatusTypes, URLs, axiosConfig } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { setAuthStatus } from '../dataActionsAuth';

import handleErrorCatch from '../../handleErrorCatch';

import { demo } from '../../../../mode.config.json';

const requestVerifyEmailLink = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'verificationId')) {
    throw Error(`Please enter a value for the 'verificationId' key - ${payload}`);
  }

  return async (dispatch, getState) => {
    const state = getState();

    if (
      state.data.auth.status[statusNames.VERIFY_EMAIL_LINK].status !== requestStatusTypes.LOADING
    ) {
      dispatch(
        setAuthStatus({
          id: statusNames.VERIFY_EMAIL_LINK,
          status: requestStatusTypes.LOADING,
        }),
      );

      const { verificationId } = payload;

      try {
        if (!demo) {
          await axios.put(URLs.EMAILS, { verificationId }, axiosConfig.DB);
        }
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(
          setAuthStatus({
            id: statusNames.VERIFY_EMAIL_LINK,
            status: requestStatusTypes.ERROR,
          }),
        );

        if (!demo) {
          raven.captureException(error, {
            logger: 'requestVerifyEmailLink',
          });
        }

        return Promise.reject(error);
      }

      dispatch(
        setAuthStatus({
          id: statusNames.VERIFY_EMAIL_LINK,
          status: requestStatusTypes.SUCCESS,
        }),
      );
    }

    return null;
  };
};

export default requestVerifyEmailLink;
