import { combineReducers } from 'redux';

import app from './uiReducersApp';
import external from './uiReducersExternal';
import internal from './uiReducersInternal';

const uiReducers = combineReducers({
  app,
  external,
  internal,
});

export default uiReducers;
