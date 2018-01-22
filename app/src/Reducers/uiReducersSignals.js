import { combineReducers } from 'redux';

export const initialState = {
  utilities: {
    pageBody: {
      mediaWidth: 925,
    },
    tables: {
      widthBuffer: 120,
      rowHeight: 60,
      heightBuffer: 60,
    },
  },
};

export const utilities = (state = initialState.utilities) => state;

const uiReducersWatchlist = combineReducers({
  utilities,
});

export default uiReducersWatchlist;
