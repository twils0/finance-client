import { combineReducers } from 'redux';

import { requestStatusTypes } from '../Constants/universalConstants';
import { actionTypes, statusNames } from '../Constants/dataConstantsWatchlist';

export const initialState = {
  status: {
    [statusNames.SECURITIES]: {
      id: statusNames.SECURITIES,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.GET_SECURITY_DATA]: {
      id: statusNames.GET_SECURITY_DATA,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.UPDATE_SECURITIES]: {
      id: statusNames.UPDATE_SECURITIES,
      status: requestStatusTypes.IDLE,
    },
  },
  securities: {
    current: null,
    list: [],
  },
};

export const status = (state = initialState.status, action) => {
  switch (action.type) {
    case actionTypes.SET_WATCHLIST_STATUS:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case actionTypes.RESET_WATCHLIST_STATE:
      return initialState.status;
    default:
      return state;
  }
};

export const securities = (state = initialState.securities, action) => {
  switch (action.type) {
    case actionTypes.SET_SECURITIES_CURRENT:
      return {
        ...state,
        ...action.payload,
      };
    case actionTypes.SET_SECURITIES_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case actionTypes.SET_SECURITIES_ALL:
      return {
        ...action.payload.securities,
      };
    case actionTypes.SET_SECURITY:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case actionTypes.SET_SECURITY_DATA: {
      if (!state[action.payload.id]) {
        return {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            ...action.payload,
          },
        };
      }

      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          data: {
            ...state[action.payload.id].data,
            ...action.payload.data,
          },
        },
      };
    }
    case actionTypes.RESET_WATCHLIST_STATE:
      return initialState.securities;
    default:
      return state;
  }
};

const dataReducersWatchlist = combineReducers({
  status,
  securities,
});

export default dataReducersWatchlist;
