import { combineReducers } from 'redux';

import stripeConfig from '../../../stripe.config.json';
import { requestStatusTypes } from '../Constants/universalConstants';
import { actionTypes, imageNames } from '../Constants/uiConstantsApp';
import {
  formNames as formNamesSignUp,
  inputNames as inputNamesSignUp,
} from '../Constants/uiConstantsExternal';
import {
  formNames as formNamesAccount,
  inputNames as inputNamesAccount,
} from '../Constants/uiConstantsAccount';

import exampleHeader from '../Images/exampleHeader.png';

export const initialState = {
  fonts: {
    status: requestStatusTypes.IDLE,
  },
  images: {
    list: [...Object.values(imageNames)],
    [imageNames.EXAMPLE_HEADER]: {
      id: imageNames.EXAMPLE_HEADER,
      src: exampleHeader,
      status: requestStatusTypes.IDLE,
    },
  },
  stripe: {
    apiKey: stripeConfig.apiKey,
    status: requestStatusTypes.IDLE,
    elements: {
      [inputNamesSignUp[formNamesSignUp.CARD].STRIPE]: {
        id: inputNamesSignUp[formNamesSignUp.CARD].STRIPE,
        loaded: false,
      },
      [inputNamesAccount[formNamesAccount.BILLING].STRIPE]: {
        id: inputNamesAccount[formNamesAccount.BILLING].STRIPE,
        loaded: false,
      },
    },
    stripeObject: null,
  },
};

export const fonts = (state = initialState.fonts, action) => {
  switch (action.type) {
    case actionTypes.SET_FONTS_STATUS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export const images = (state = initialState.images, action) => {
  switch (action.type) {
    case actionTypes.SET_IMAGE_STATUS:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export const stripe = (state = initialState.stripe, action) => {
  switch (action.type) {
    case actionTypes.SET_STRIPE_STATUS:
      return {
        ...state,
        ...action.payload,
      };
    case actionTypes.SET_STRIPE_ELEMENT_LOADED:
      return {
        ...state,
        elements: {
          ...state.elements,
          [action.payload.id]: {
            ...state.elements[action.payload.id],
            ...action.payload,
          },
        },
      };
    case actionTypes.SET_STRIPE_OBJECT:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const uiReducersApp = combineReducers({
  fonts,
  images,
  stripe,
});

export default uiReducersApp;
