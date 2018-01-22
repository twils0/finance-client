import { actionTypes } from '../Constants/uiConstantsApp';

export const setFontsStatus = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'status')) {
    throw new Error(`Please enter a value for the 'status' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_FONTS_STATUS,
    payload,
  };
};

export const setImageStatus = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'status')) {
    throw new Error(`Please enter a value for the 'status' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_IMAGE_STATUS,
    payload,
  };
};

export const setStripeStatus = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'status')) {
    throw new Error(`Please enter a value for the 'status' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_STRIPE_STATUS,
    payload,
  };
};

export const setStripeElementLoaded = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'loaded')) {
    throw new Error(`Please enter a value for the 'loaded' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_STRIPE_ELEMENT_LOADED,
    payload,
  };
};

export const setStripeObject = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'stripeObject')) {
    throw new Error(`Please enter a value for the 'stripeObject' key - ${JSON.stringify(payload)}`);
  }
  if (typeof payload.stripeObject !== 'object' || payload.stripeObject.constructor === Array) {
    throw new Error(`Please provide an object value for the 'stripeObject' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_STRIPE_OBJECT,
    payload,
  };
};
