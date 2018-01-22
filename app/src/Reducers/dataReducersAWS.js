import { combineReducers } from 'redux';

import { requestStatusTypes } from '../Constants/universalConstants';
import { actionTypes } from '../Constants/dataConstantsAWS';

export const initialState = {
  status: requestStatusTypes.IDLE,
  user: null,
};

export const status = (state = initialState.status, action) => {
  switch (action.type) {
    case actionTypes.SET_AWS_STATUS:
      return action.payload.status;
    case actionTypes.RESET_AWS_STATE:
      return initialState.status;
    default:
      return state;
  }
};

export const user = (state = initialState.user, action) => {
  switch (action.type) {
    case actionTypes.SET_AWS_USER:
      return action.payload.user;
    case actionTypes.RESET_AWS_STATE:
      return initialState.user;
    default:
      return state;
  }
};

const dataReducersAWS = combineReducers({
  status,
  user,
});

export default dataReducersAWS;
