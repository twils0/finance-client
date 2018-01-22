import { combineReducers } from 'redux';

import {
  actionTypes,
  formNames,
  buttonNames,
  buttonTexts,
  inputNames,
} from '../Constants/uiConstantsAccount';

export const initialState = {
  utilities: {
    pageBody: {},
    list: {
      springSettings: { stiffness: 300, damping: 50 },
      width: 300,
      widthBuffer: 60,
      heightBuffer: 60,
      rowWidthIndent: 10,
      rowHeight: 50,
      rowHeightBufferBottom: 10,
    },
    separatorLine: {
      width: 4,
      height: 320,
      heightBuffer: 40,
    },
    forms: {
      springSettings: { stiffness: 200, damping: 26 },
      width: 400,
      widthBuffer: 60,
      rowWidthIndent: 10,
      headerWidthBufferRight: 10,
      formArrayFormsHeight: 350,
      formsHeightBuffer: 60,
      rowHeight: 60,
      rowHeightBuffer: 18,
    },
    buttons: {
      springSettings: { stiffness: 170, damping: 26 },
      width: 100,
      widthBuffer: 10,
      heightBuffer: 60,
    },
  },
  forms: {
    current: formNames.PROFILE,
    list: [...Object.values(formNames)],
    [formNames.CODE]: {
      id: formNames.CODE,
      height: 0,
      edit: false,
      inputsList: [...Object.values(inputNames[formNames.CODE])],
      inputs: {
        [inputNames[formNames.CODE].CODE_PHONE]: {
          parentId: formNames.CODE,
          id: inputNames[formNames.CODE].CODE_PHONE,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.CODE].CODE_EMAIL]: {
          parentId: formNames.CODE,
          id: inputNames[formNames.CODE].CODE_EMAIL,
          value: '',
          errorMessage: '',
        },
      },
    },
    [formNames.PROFILE]: {
      id: formNames.PROFILE,
      height: 240,
      edit: false,
      inputsList: [...Object.values(inputNames[formNames.PROFILE])],
      inputs: {
        [inputNames[formNames.PROFILE].NAME]: {
          parentId: formNames.PROFILE,
          id: inputNames[formNames.PROFILE].NAME,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.PROFILE].EMAIL]: {
          parentId: formNames.PROFILE,
          id: inputNames[formNames.PROFILE].EMAIL,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.PROFILE].EMAIL_ADDITIONAL]: {
          parentId: formNames.PROFILE,
          id: inputNames[formNames.PROFILE].EMAIL_ADDITIONAL,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.PROFILE].PHONE]: {
          parentId: formNames.PROFILE,
          id: inputNames[formNames.PROFILE].PHONE,
          value: '',
          errorMessage: '',
        },
      },
    },
    [formNames.BILLING]: {
      id: formNames.BILLING,
      height: 0,
      edit: false,
      inputsList: [...Object.values(inputNames[formNames.BILLING])],
      inputs: {
        [inputNames[formNames.BILLING].NAME_ON_CARD]: {
          parentId: formNames.BILLING,
          id: inputNames[formNames.BILLING].NAME_ON_CARD,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.BILLING].PROMO_CODE]: {
          parentId: formNames.BILLING,
          id: inputNames[formNames.BILLING].PROMO_CODE,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.BILLING].STRIPE]: {
          parentId: formNames.BILLING,
          id: inputNames[formNames.BILLING].STRIPE,
          value: '',
          errorMessage: '',
        },
      },
    },
    [formNames.CHANGE_PASSWORD]: {
      id: formNames.CHANGE_PASSWORD,
      height: 0,
      inputsList: [...Object.values(inputNames[formNames.CHANGE_PASSWORD])],
      inputs: {
        [inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD]: {
          parentId: formNames.CHANGE_PASSWORD,
          id: inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD]: {
          parentId: formNames.CHANGE_PASSWORD,
          id: inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2]: {
          parentId: formNames.CHANGE_PASSWORD,
          id: inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2,
          value: '',
          errorMessage: '',
        },
      },
    },
    [formNames.DELETE_ACCOUNT]: {
      id: formNames.DELETE_ACCOUNT,
      height: 0,
      edit: false,
      inputsList: [...Object.values(inputNames[formNames.DELETE_ACCOUNT])],
      inputs: {
        [inputNames[formNames.DELETE_ACCOUNT].CONFIRM]: {
          parentId: formNames.DELETE_ACCOUNT,
          id: inputNames[formNames.DELETE_ACCOUNT].CONFIRM,
          value: '',
          errorMessage: '',
        },
      },
    },
  },
  buttons: {
    list: [...Object.values(buttonNames)],
    [buttonNames.FIRST]: { id: buttonNames.FIRST, text: buttonTexts.EDIT, visible: true },
    [buttonNames.SECOND]: { id: buttonNames.SECOND, text: buttonTexts.CANCEL, visible: false },
  },
};

initialState.utilities.pageBody.mediaWidth =
  50 +
  initialState.utilities.list.width +
  initialState.utilities.list.widthBuffer +
  initialState.utilities.separatorLine.width +
  initialState.utilities.forms.width +
  initialState.utilities.forms.widthBuffer;

export const utilities = (state = initialState.utilities) => state;

export const forms = (state = initialState.forms, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_FORM:
      return {
        ...state,
        ...action.payload,
      };
    case actionTypes.SET_FORM_HEIGHT:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case actionTypes.SET_FORM_EDIT:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case actionTypes.SET_INPUT_VALUE_ERROR:
      return {
        ...state,
        [action.payload.parentId]: {
          ...state[action.payload.parentId],
          inputs: {
            ...state[action.payload.parentId].inputs,
            [action.payload.id]: {
              ...state[action.payload.parentId].inputs[action.payload.id],
              ...action.payload,
            },
          },
        },
      };
    default:
      return state;
  }
};

export const buttons = (state = initialState.buttons, action) => {
  switch (action.type) {
    case actionTypes.SET_BUTTON_TEXT:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case actionTypes.SET_BUTTON_VISIBLE:
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

const uiReducersAccount = combineReducers({
  utilities,
  forms,
  buttons,
});

export default uiReducersAccount;
