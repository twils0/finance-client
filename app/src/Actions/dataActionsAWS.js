import { actionTypes } from '../Constants/dataConstantsAWS';

export const setAWSStatus = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'status')) {
    throw new Error(`Please enter a value for the 'status' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_AWS_STATUS,
    payload,
  };
};

export const setAWSUser = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'user')) {
    throw new Error(`Please enter a value for the 'user' key - ${JSON.stringify(payload)}`);
  }
  if (typeof payload.user !== 'object' || payload.user.constructor === Array) {
    throw new Error(`Please provide an object value for the 'user' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_AWS_USER,
    payload,
  };
};

export const resetAWSState = () => ({ type: actionTypes.RESET_AWS_STATE });
