import axios from 'axios';
import raven from 'raven-js';

import { requestStatusTypes, URLs, axiosConfig } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsWatchlist';
import { setWatchlistStatus, setSecuritiesAll } from '../dataActionsWatchlist';
import requestLogout from '../dataThunkAuth/requestLogout';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';

import handleErrorCatch from '../../handleErrorCatch';

import { demo } from '../../../../mode.config.json';
import demoLoadSecurities from '../../../../demoConfig/demoLoadSecurities';

const loadSecurities = () => async (dispatch, getState) => {
  const state = getState();

  if (state.data.watchlist.status[statusNames.SECURITIES].status !== requestStatusTypes.LOADING) {
    dispatch(
      setWatchlistStatus({
        id: statusNames.SECURITIES,
        status: requestStatusTypes.LOADING,
      }),
    );

    let { user } = state.data.aws;
    let securities = null;

    if (demo) {
      securities = demoLoadSecurities;
    }

    try {
      if (!user) {
        ({ user } = await dispatch(requestAWSUser()));
      }

      if (!demo) {
        const idToken = user.signInUserSession.idToken.jwtToken;
        const accessToken = user.signInUserSession.accessToken.jwtToken;

        const response = await axios.get(URLs.USERS, {
          headers: {
            Authorization: idToken,
          },
          params: {
            accessToken,
          },
          ...axiosConfig.DB,
        });

        ({ securities } = response.data.body);
      }
    } catch (errorCatch) {
      const error = handleErrorCatch(errorCatch);

      dispatch(
        setWatchlistStatus({
          id: statusNames.SECURITIES,
          status: requestStatusTypes.ERROR,
        }),
      );

      if (typeof error === 'object' && error && error.code === 'NotAuthorizedException') {
        dispatch(requestLogout());

        return null;
      }

      if (!demo) {
        raven.captureException(error, {
          logger: 'loadSecurities',
        });
      }

      return Promise.reject(error);
    }

    if (securities.list.length > 0) {
      dispatch(setSecuritiesAll({ securities }));
    }

    dispatch(
      setWatchlistStatus({
        id: statusNames.SECURITIES,
        status: requestStatusTypes.SUCCESS,
      }),
    );
  }

  return null;
};

export default loadSecurities;
