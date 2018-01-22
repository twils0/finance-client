import { actionTypes } from '../Constants/dataConstantsAuth';

export const setAuthenticated = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'authenticated')) {
    throw new Error(
      `Please enter a value for the 'authenticated' key - ${JSON.stringify(payload)}`,
    );
  }
  if (typeof payload.authenticated !== 'boolean') {
    throw new Error(
      `Please enter a boolean value for the 'authenticated' key - ${JSON.stringify(payload)}`,
    );
  }

  return {
    type: actionTypes.SET_AUTHENTICATED,
    payload,
  };
};

export const setRedirectURL = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'redirectURL')) {
    throw new Error(`Please enter a value for the 'redirectURL' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_REDIRECT_URL,
    payload,
  };
};

export const setAuthStatus = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'status')) {
    throw new Error(`Please enter a value for the 'status' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_AUTH_STATUS,
    payload,
  };
};

export const setCodeType = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'needed')) {
    throw new Error(`Please enter a value for the 'needed' key - ${JSON.stringify(payload)}`);
  }
  if (typeof payload.needed !== 'boolean') {
    throw new Error(
      `Please enter a boolean value for the 'needed' key - ${JSON.stringify(payload)}`,
    );
  }

  return {
    type: actionTypes.SET_CODE_TYPE,
    payload,
  };
};

export const resetAuthState = () => ({ type: actionTypes.RESET_AUTH_STATE });
