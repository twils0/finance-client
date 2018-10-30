import axios from 'axios';
import raven from 'raven-js';

import { requestStatusTypes, URLs, axiosConfig } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsWatchlist';
import { setWatchlistStatus } from '../dataActionsWatchlist';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';
import requestLogout from '../dataThunkAuth/requestLogout';

import handleErrorCatch from '../../handleErrorCatch';

import { demo } from '../../../../mode.config.json';

const requestUpdateSecurities = () => async (dispatch, getState) => {
  const state = getState();

  if (
    state.data.watchlist.status[statusNames.UPDATE_SECURITIES].status !== requestStatusTypes.LOADING
  ) {
    dispatch(
      setWatchlistStatus({
        id: statusNames.UPDATE_SECURITIES,
        status: requestStatusTypes.LOADING,
      }),
    );

    let { user } = state.data.aws;
    const { current, list } = state.data.watchlist.securities;

    try {
      if (!demo) {
        if (!user) {
          ({ user } = await dispatch(requestAWSUser()));
        }

        const idToken = user.signInUserSession.idToken.jwtToken;
        const accessToken = user.signInUserSession.accessToken.jwtToken;

        await axios.put(
          URLs.USERS,
          { current, list },
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
        setWatchlistStatus({
          id: statusNames.UPDATE_SECURITIES,
          status: requestStatusTypes.ERROR,
        }),
      );

      if (typeof error === 'object' && error && error.code === 'NotAuthorizedException') {
        dispatch(requestLogout());

        return null;
      }

      if (!demo) {
        raven.captureException(error, {
          logger: 'requestUpdateSecurities',
        });
      }

      return Promise.reject(error);
    }

    dispatch(
      setWatchlistStatus({
        id: statusNames.UPDATE_SECURITIES,
        status: requestStatusTypes.SUCCESS,
      }),
    );
  }

  return null;
};

export default requestUpdateSecurities;
