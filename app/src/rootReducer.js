import { combineReducers } from 'redux';

import data from './Reducers/dataReducers';
import ui from './Reducers/uiReducers';

const rootReducer = combineReducers({
  data,
  ui,
});

export default rootReducer;
