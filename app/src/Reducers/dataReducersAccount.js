import { combineReducers } from 'redux';

import { requestStatusTypes } from '../Constants/universalConstants';
import { actionTypes, statusNames, fieldNames } from '../Constants/dataConstantsAccount';

export const initialState = {
  status: {
    [statusNames.AWS_FIELDS]: {
      id: statusNames.AWS_FIELDS,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.STRIPE_FIELDS]: {
      id: statusNames.STRIPE_FIELDS,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.UPDATE_STRIPE_FIELDS_TOKEN]: {
      id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.UPDATE_STRIPE_FIELDS_REQUEST]: {
      id: statusNames.UPDATE_STRIPE_FIELDS_REQUEST,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.UPDATE_DB_FIELDS]: {
      id: statusNames.UPDATE_DB_FIELDS,
      status: requestStatusTypes.IDLE,
    },
    [statusNames.UPDATE_AWS_FIELDS]: {
      id: statusNames.UPDATE_AWS_FIELDS,
      status: requestStatusTypes.IDLE,
    },
  },
  fields: {
    list: [...Object.values(fieldNames)],
    [fieldNames.NAME]: {
      id: fieldNames.NAME,
      value: '',
    },
    [fieldNames.EMAIL]: {
      id: fieldNames.EMAIL,
      value: '',
    },
    [fieldNames.EMAIL_ADDITIONAL]: {
      id: fieldNames.EMAIL_ADDITIONAL,
      value: '',
    },
    [fieldNames.PHONE]: {
      id: fieldNames.PHONE,
      value: '',
    },
    [fieldNames.NAME_ON_CARD]: {
      id: fieldNames.NAME_ON_CARD,
      value: '',
    },
    [fieldNames.PROMO_CODE]: {
      id: fieldNames.PROMO_CODE,
      value: '',
    },
    [fieldNames.PROMO_CODE_VALID]: {
      id: fieldNames.PROMO_CODE_VALID,
      value: true,
    },
    [fieldNames.CUSTOMER]: {
      id: fieldNames.CUSTOMER,
      value: '',
    },
  },
};

export const status = (state = initialState.status, action) => {
  switch (action.type) {
    case actionTypes.SET_ACCOUNT_STATUS:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case actionTypes.RESET_ACCOUNT_STATE:
      return initialState.status;
    default:
      return state;
  }
};

export const fields = (state = initialState.fields, action) => {
  switch (action.type) {
    case actionTypes.SET_FIELD:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case actionTypes.SET_FIELDS:
      return {
        ...state,
        ...action.payload,
      };
    case actionTypes.RESET_ACCOUNT_STATE:
      return initialState.fields;
    default:
      return state;
  }
};

const dataReducersAccount = combineReducers({
  status,
  fields,
});

export default dataReducersAccount;
