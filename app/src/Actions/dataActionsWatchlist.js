import { actionTypes } from '../Constants/dataConstantsWatchlist';

export const setWatchlistStatus = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'status')) {
    throw new Error(`Please enter a value for the 'status' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_WATCHLIST_STATUS,
    payload,
  };
};

export const setSecuritiesCurrent = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'current')) {
    throw new Error(`Please enter a value for the 'current' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_SECURITIES_CURRENT,
    payload,
  };
};

export const setSecuritiesList = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'list')) {
    throw new Error(`Please enter a value for the 'list' key - ${JSON.stringify(payload)}`);
  }
  if (payload.list.constructor !== Array) {
    throw new Error(`Please enter an array value for the 'list' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_SECURITIES_LIST,
    payload,
  };
};

export const setSecuritiesAll = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'securities')) {
    throw new Error(`Please enter a value for the 'securities' key - ${JSON.stringify(payload)}`);
  }
  if (typeof payload.securities !== 'object' || payload.securities.constructor === Array) {
    throw new Error(
      `Please enter an object value for the 'securities' key - ${JSON.stringify(payload)}`,
    );
  }
  if (!Object.prototype.hasOwnProperty.call(payload.securities, 'current')) {
    throw new Error(
      `Please enter a value for the 'current' key - ${JSON.stringify(payload.securities)}`,
    );
  }
  if (!Object.prototype.hasOwnProperty.call(payload.securities, 'list')) {
    throw new Error(`Please enter a value for the 'list' key - ${JSON.stringify(payload.securities)}`);
  }
  if (payload.securities.list.constructor !== Array) {
    throw new Error(
      `Please enter an array value for the 'list' key - ${JSON.stringify(payload.securities)}`,
    );
  }

  const verifiedPayload = { ...payload };

  Object.keys(verifiedPayload.securities)
    .filter((key) => {
      if (key !== 'current' && key !== 'list') {
        return true;
      }
      return false;
    })
    .forEach((key) => {
      const security = verifiedPayload.securities[key];

      if (!Object.prototype.hasOwnProperty.call(security, 'id')) {
        delete verifiedPayload[key];
        throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(security)}`);
      }
      if (!Object.prototype.hasOwnProperty.call(security, 'name')) {
        delete verifiedPayload[key];
        throw new Error(`Please enter a value for the 'name' key - ${JSON.stringify(security)}`);
      }
      if (!Object.prototype.hasOwnProperty.call(security, 'exchange')) {
        delete verifiedPayload[key];
        throw new Error(`Please enter a value for the 'exchange' key - ${JSON.stringify(security)}`);
      }
      if (!Object.prototype.hasOwnProperty.call(security, 'tickerCusip')) {
        delete verifiedPayload[key];
        throw new Error(`Please enter a value for the 'tickerCusip' key - ${JSON.stringify(security)}`);
      }
      if (!Object.prototype.hasOwnProperty.call(security, 'category')) {
        delete verifiedPayload[key];
        throw new Error(`Please enter a value for the 'category' key - ${JSON.stringify(security)}`);
      }
    });

  return {
    type: actionTypes.SET_SECURITIES_ALL,
    payload: verifiedPayload,
  };
};

export const setSecurity = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'name')) {
    throw new Error(`Please enter a value for the 'name' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'exchange')) {
    throw new Error(`Please enter a value for the 'exchange' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'tickerCusip')) {
    throw new Error(`Please enter a value for the 'tickerCusip' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'category')) {
    throw new Error(`Please enter a value for the 'category' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_SECURITY,
    payload,
  };
};

export const setSecurityData = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'data')) {
    throw new Error(`Please enter a value for the 'data' key - ${JSON.stringify(payload)}`);
  }
  if (typeof payload.data !== 'object' || payload.data.constructor === Array) {
    throw new Error(`Please enter an object value for the 'data' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_SECURITY_DATA,
    payload,
  };
};

export const resetWatchlistState = () => ({ type: actionTypes.RESET_WATCHLIST_STATE });
