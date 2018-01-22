import { combineReducers } from 'redux';

import { requestStatusTypes, pathNames } from '../Constants/universalConstants';
import { actionTypes, statusNames, codeTypeNames } from '../Constants/dataConstantsAuth';

export const initialState = {
  authenticated: false,
  redirectURL: pathNames.WATCHLIST,
  status: {
    [statusNames.LOGIN]: {
      id: statusNames.LOGIN,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.SIGN_OUT_DEVICES]: {
      id: statusNames.SIGN_OUT_DEVICES,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.LOGIN_MFA]: {
      id: statusNames.LOGIN_MFA,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.SIGN_UP]: {
      id: statusNames.SIGN_UP,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.VERIFY_PHONE]: {
      id: statusNames.VERIFY_PHONE,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.VERIFY_PHONE_CODE]: {
      id: statusNames.VERIFY_PHONE_CODE,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.VERIFY_EMAIL]: {
      id: statusNames.VERIFY_EMAIL,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.VERIFY_EMAIL_LINK]: {
      id: statusNames.VERIFY_EMAIL_LINK,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.FORGOT_PASSWORD]: {
      id: statusNames.FORGOT_PASSWORD,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.RESET_PASSWORD]: {
      id: statusNames.RESET_PASSWORD,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.CHANGE_PASSWORD]: {
      id: statusNames.CHANGE_PASSWORD,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.LOGOUT]: {
      id: statusNames.LOGOUT,
      status: requestStatusTypes.SUCCESS,
    },
    [statusNames.DELETE_ACCOUNT]: {
      id: statusNames.DELETE_ACCOUNT,
      status: requestStatusTypes.SUCCESS,
    },
  },
  codeTypes: {
    [codeTypeNames.VERIFY_PHONE]: {
      id: codeTypeNames.VERIFY_PHONE,
      needed: true,
    },
    [codeTypeNames.VERIFY_EMAIL]: {
      id: codeTypeNames.VERIFY_EMAIL,
      needed: true,
    },
    [codeTypeNames.VERIFY_EMAIL_ADDITIONAL]: {
      id: codeTypeNames.VERIFY_EMAIL_ADDITIONAL,
      needed: true,
    },
  },
};

export const authenticated = (state = initialState.authenticated, action) => {
  switch (action.type) {
    case actionTypes.SET_AUTHENTICATED:
      return action.payload.authenticated;
    case actionTypes.RESET_AUTH_STATE:
      return initialState.authenticated;
    default:
      return state;
  }
};

export const redirectURL = (state = initialState.redirectURL, action) => {
  switch (action.type) {
    case actionTypes.SET_REDIRECT_URL:
      return action.payload.redirectURL;
    default:
      return state;
  }
};

export const status = (state = initialState.status, action) => {
  switch (action.type) {
    case actionTypes.SET_AUTH_STATUS:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case actionTypes.RESET_AUTH_STATE:
      return initialState.status;
    default:
      return state;
  }
};

export const codeTypes = (state = initialState.codeTypes, action) => {
  switch (action.type) {
    case actionTypes.SET_CODE_TYPE:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case actionTypes.RESET_AUTH_STATE:
      return initialState.codeTypes;
    default:
      return state;
  }
};

const dataReducersAuth = combineReducers({
  authenticated,
  redirectURL,
  status,
  codeTypes,
});

export default dataReducersAuth;
