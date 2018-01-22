import { combineReducers } from 'redux';

import auth from './dataReducersAuth';
import aws from './dataReducersAWS';
import watchlist from './dataReducersWatchlist';
import account from './dataReducersAccount';

const dataReducers = combineReducers({
  auth,
  aws,
  watchlist,
  account,
});

export default dataReducers;
