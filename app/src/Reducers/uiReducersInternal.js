import { combineReducers } from 'redux';

import { actionTypes, pageBodyNames } from '../Constants/uiConstantsInternal';
import watchlist from './uiReducersWatchlist';
import account from './uiReducersAccount';

export const initialState = {
  utilities: {
    menu: {
      securities: 5, // number of securities in menu
      widthBasis: 600,
      widthBuffer: 60,
      height: 73,
      heightBuffer: 30,
    },
    menuImg: {
      width: 250,
    },
    menuSearchBar: {
      inputLagTime: 200, // time in milliseconds to wait before search
      width: 300,
      height: 45,
      heightBuffer: 10,
    },
    menuSecurity: {
      widthBuffer: 20,
      heightBuffer: 20,
    },
  },
  pageBodies: {
    current: pageBodyNames.WATCHLIST,
    list: [...Object.values(pageBodyNames)],
    [pageBodyNames.WATCHLIST]: { id: pageBodyNames.WATCHLIST },
    [pageBodyNames.ACCOUNT]: { id: pageBodyNames.ACCOUNT },
  },
};

initialState.utilities.menu.mediaWidth = 150
  + 110 // for the searchbar
  + initialState.utilities.menu.widthBasis
  + initialState.utilities.menu.widthBuffer
  + initialState.utilities.menuSearchBar.width
  + initialState.utilities.menu.securities * initialState.utilities.menuSecurity.widthBuffer;

export const utilities = (state = initialState.utilities) => state;

export const pageBodies = (state = initialState.pageBodies, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_PAGE_BODY:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const uiReducersInternal = combineReducers({
  utilities,
  pageBodies,
  watchlist,
  account,
});

export default uiReducersInternal;
