import axios from 'axios';
import raven from 'raven-js';

import { requestStatusTypes, axiosConfig, URLs } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsWatchlist';
import { setWatchlistStatus, setSecurityData } from '../dataActionsWatchlist';

import handleErrorCatch from '../../handleErrorCatch';
import convertPrice from '../../Functions/convertPrice';
import convertDate from '../../Functions/convertDate';
import convertTime from '../../Functions/convertTime';

const requestSecurityData = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for 'id' - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'tickerCusip')) {
    throw new Error(`Please enter a value for 'tickerCusip' - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();

    if (
      state.data.watchlist.status[statusNames.GET_SECURITY_DATA].status
      !== requestStatusTypes.LOADING
    ) {
      dispatch(
        setWatchlistStatus({
          id: statusNames.GET_SECURITY_DATA,
          status: requestStatusTypes.LOADING,
        }),
      );

      const { id, tickerCusip } = payload;
      let data = null;

      try {
        const [responseCompany, responseQuote] = await Promise.all([
          axios.get(URLs.IEX_COMPANY(tickerCusip), {
            params: {
              filter: 'description',
            },
            ...axiosConfig.IEX,
          }),
          axios.get(URLs.IEX_QUOTE(tickerCusip), {
            params: {
              filter: 'latestPrice,latestUpdate',
            },
            ...axiosConfig.IEX,
          }),
        ]);

        const description = responseCompany.data.description.replace('\n ', '\n\n');

        const { latestPrice, latestUpdate } = responseQuote.data;

        data = {
          description,
          price: {
            amount: convertPrice(latestPrice),
            date: convertDate(latestUpdate),
            time: convertTime(latestUpdate),
          },
        };
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(
          setWatchlistStatus({
            id: statusNames.GET_SECURITY_DATA,
            status: requestStatusTypes.ERROR,
          }),
        );

        raven.captureException(error, {
          logger: 'requestSecurityData',
        });

        return Promise.reject(error);
      }

      dispatch(setSecurityData({ id, data }));

      dispatch(
        setWatchlistStatus({
          id: statusNames.GET_SECURITY_DATA,
          status: requestStatusTypes.SUCCESS,
        }),
      );
    }

    return null;
  };
};

export default requestSecurityData;
