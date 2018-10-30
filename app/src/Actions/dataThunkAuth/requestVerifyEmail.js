import axios from 'axios';
import raven from 'raven-js';

import { requestStatusTypes, URLs, axiosConfig } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';
import requestLogout from './requestLogout';
import { setAuthStatus } from '../dataActionsAuth';

import handleErrorCatch from '../../handleErrorCatch';

import { demo } from '../../../../mode.config.json';

const requestVerifyEmail = () => async (dispatch, getState) => {
  const state = getState();

  if (state.data.auth.status[statusNames.VERIFY_EMAIL].status !== requestStatusTypes.LOADING) {
    dispatch(
      setAuthStatus({
        id: statusNames.VERIFY_EMAIL,
        status: requestStatusTypes.LOADING,
      }),
    );

    let { user } = state.data.aws;

    try {
      if (!user) {
        ({ user } = await dispatch(requestAWSUser()));
      }

      if (!demo) {
        const idToken = user.signInUserSession.idToken.jwtToken;
        const accessToken = user.signInUserSession.accessToken.jwtToken;

        await axios.post(
          URLs.EMAILS,
          {},
          {
            headers: {
              Authorization: idToken,
            },
            params: {
              accessToken,
            },
            ...axiosConfig.DB,
          },
        );
      }
    } catch (errorCatch) {
      const error = handleErrorCatch(errorCatch);

      dispatch(
        setAuthStatus({
          id: statusNames.VERIFY_EMAIL,
          status: requestStatusTypes.ERROR,
        }),
      );

      if (typeof error === 'object' && error && error.code === 'NotAuthorizedException') {
        dispatch(requestLogout());

        return null;
      }

      if (!demo) {
        raven.captureException(error, {
          logger: 'requestVerifyEmail',
        });
      }

      return Promise.reject(error);
    }

    dispatch(
      setAuthStatus({
        id: statusNames.VERIFY_EMAIL,
        status: requestStatusTypes.SUCCESS,
      }),
    );
  }

  return null;
};

export default requestVerifyEmail;
