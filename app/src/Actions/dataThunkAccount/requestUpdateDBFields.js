import axios from 'axios';
import raven from 'raven-js';

import { requestStatusTypes, URLs, axiosConfig } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAccount';
import requestLogout from '../dataThunkAuth/requestLogout';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';
import { setAccountStatus } from '../dataActionsAccount';

import handleErrorCatch from '../../handleErrorCatch';

const requestUpdateDBFields = (payload) => {
  if (
    !Object.prototype.hasOwnProperty.call(payload, 'name')
    && !Object.prototype.hasOwnProperty.call(payload, 'phone')
    && !Object.prototype.hasOwnProperty.call(payload, 'email')
    && !Object.prototype.hasOwnProperty.call(payload, 'emailAdditional')
  ) {
    throw new Error(
      `Please enter a value for either the 'name', 'phone', 'email', and/or 'emailAdditional' key(s) - ${JSON.stringify(
        payload,
      )}`,
    );
  }

  return async (dispatch, getState) => {
    const state = getState();

    if (
      state.data.account.status[statusNames.UPDATE_DB_FIELDS].status !== requestStatusTypes.LOADING
    ) {
      dispatch(
        setAccountStatus({
          id: statusNames.UPDATE_DB_FIELDS,
          status: requestStatusTypes.LOADING,
        }),
      );

      let { user } = state.data.aws;

      try {
        if (!user) {
          ({ user } = await dispatch(requestAWSUser()));
        }

        const idToken = user.signInUserSession.idToken.jwtToken;
        const accessToken = user.signInUserSession.accessToken.jwtToken;

        await axios.put(URLs.USERS, payload, {
          headers: {
            Authorization: idToken,
          },
          params: {
            accessToken,
          },
          ...axiosConfig.DB,
        });
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(
          setAccountStatus({
            id: statusNames.UPDATE_DB_FIELDS,
            status: requestStatusTypes.ERROR,
          }),
        );

        if (typeof error === 'object' && error && error.code === 'NotAuthorizedException') {
          dispatch(requestLogout());

          return null;
        }

        if (typeof error === 'object' && error && error.code === 'UsernameExistsException') {
          return Promise.reject(error);
        }

        raven.captureException(error, {
          logger: 'requestUpdateDBFields',
        });

        return Promise.reject(error);
      }

      dispatch(
        setAccountStatus({
          id: statusNames.UPDATE_DB_FIELDS,
          status: requestStatusTypes.SUCCESS,
        }),
      );
    }

    return null;
  };
};

export default requestUpdateDBFields;
