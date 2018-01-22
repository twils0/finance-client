import { actionTypes } from '../Constants/dataConstantsAccount';

export const setAccountStatus = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'status')) {
    throw new Error(`Please enter a value for the 'status' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_ACCOUNT_STATUS,
    payload,
  };
};

export const setField = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'value')) {
    throw new Error(`Please enter a value for the 'value' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_FIELD,
    payload,
  };
};

export const setFields = (payload) => {
  Object.keys(payload).forEach((key) => {
    const field = payload[key];

    if (!Object.prototype.hasOwnProperty.call(field, 'id')) {
      throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(field)}`);
    }
    if (!Object.prototype.hasOwnProperty.call(field, 'value')) {
      throw new Error(`Please enter a value for the 'value' key - ${JSON.stringify(field)}`);
    }
  });

  return {
    type: actionTypes.SET_FIELDS,
    payload,
  };
};

export const resetAccountState = () => ({ type: actionTypes.RESET_ACCOUNT_STATE });
