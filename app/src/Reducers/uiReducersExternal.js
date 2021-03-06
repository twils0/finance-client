import { combineReducers } from 'redux';

import {
  formNames,
  inputNames,
  buttonNames,
  buttonTexts,
  actionTypes,
} from '../Constants/uiConstantsExternal';

export const initialState = {
  utilities: {
    forms: {
      springSettings: { stiffness: 170, damping: 26 },
      width: 300,
      widthBuffer: 60,
      mediaWidth: 700,
      heightBuffer: 50,
      inputs: {
        heightBuffer: 15,
      },
    },
    buttons: {
      width: 300,
      heightBuffer: 20,
      heightBottomBuffer: 30,
    },
    terms: {
      bufferPage: 30,
      bufferHeightParagraphTop: 20,
      bufferHeightParagraphBottom: 30,
      bufferHeight: 20,
    },
  },
  forms: {
    current: formNames.LOGIN,
    list: [...Object.values(formNames)],
    [formNames.RESET_PASSWORD]: {
      id: formNames.RESET_PASSWORD,
      height: 384,
      inputsList: [...Object.values(inputNames[formNames.RESET_PASSWORD])],
      inputs: {
        [inputNames[formNames.RESET_PASSWORD].CODE]: {
          parentId: formNames.RESET_PASSWORD,
          id: inputNames[formNames.RESET_PASSWORD].CODE,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.RESET_PASSWORD].PASSWORD]: {
          parentId: formNames.RESET_PASSWORD,
          id: inputNames[formNames.RESET_PASSWORD].PASSWORD,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.RESET_PASSWORD].PASSWORD2]: {
          parentId: formNames.RESET_PASSWORD,
          id: inputNames[formNames.RESET_PASSWORD].PASSWORD2,
          value: '',
          errorMessage: '',
        },
      },
    },
    [formNames.FORGOT_PASSWORD]: {
      id: formNames.FORGOT_PASSWORD,
      height: 250,
      inputsList: [...Object.values(inputNames[formNames.FORGOT_PASSWORD])],
      inputs: {
        [inputNames[formNames.FORGOT_PASSWORD].EMAIL]: {
          parentId: formNames.FORGOT_PASSWORD,
          id: inputNames[formNames.FORGOT_PASSWORD].EMAIL,
          value: '',
          errorMessage: '',
        },
      },
    },
    [formNames.LOGIN]: {
      id: formNames.LOGIN,
      height: 240,
      inputsList: [...Object.values(inputNames[formNames.LOGIN])],
      inputs: {
        [inputNames[formNames.LOGIN].EMAIL]: {
          parentId: formNames.LOGIN,
          id: inputNames[formNames.LOGIN].EMAIL,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.LOGIN].PASSWORD]: {
          parentId: formNames.LOGIN,
          id: inputNames[formNames.LOGIN].PASSWORD,
          value: '',
          errorMessage: '',
        },
      },
    },
    [formNames.CARD]: {
      id: formNames.CARD,
      height: 360,
      inputsList: [...Object.values(inputNames[formNames.CARD])],
      inputs: {
        [inputNames[formNames.CARD].NAME_ON_CARD]: {
          parentId: formNames.CARD,
          id: inputNames[formNames.CARD].NAME_ON_CARD,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.CARD].PROMO_CODE]: {
          parentId: formNames.CARD,
          id: inputNames[formNames.CARD].PROMO_CODE,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.CARD].STRIPE]: {
          parentId: formNames.CARD,
          id: inputNames[formNames.CARD].STRIPE,
          value: '',
          errorMessage: '',
        },
      },
    },
    [formNames.INFO]: {
      id: formNames.INFO,
      height: 303,
      inputsList: [...Object.values(inputNames[formNames.INFO])],
      inputs: {
        [inputNames[formNames.INFO].NAME]: {
          parentId: formNames.INFO,
          id: inputNames[formNames.INFO].NAME,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.INFO].EMAIL]: {
          parentId: formNames.INFO,
          id: inputNames[formNames.INFO].EMAIL,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.INFO].PHONE]: {
          parentId: formNames.INFO,
          id: inputNames[formNames.INFO].PHONE,
          value: '',
          errorMessage: '',
        },
      },
    },
    [formNames.SIGN_UP]: {
      id: formNames.SIGN_UP,
      height: 398,
      inputsList: [...Object.values(inputNames[formNames.SIGN_UP])],
      inputs: {
        [inputNames[formNames.SIGN_UP].PASSWORD]: {
          parentId: formNames.SIGN_UP,
          id: inputNames[formNames.SIGN_UP].PASSWORD,
          value: '',
          errorMessage: '',
        },
        [inputNames[formNames.SIGN_UP].PASSWORD2]: {
          parentId: formNames.SIGN_UP,
          id: inputNames[formNames.SIGN_UP].PASSWORD2,
          value: '',
          errorMessage: '',
        },
      },
    },
    [formNames.CODE_MFA_PHONE]: {
      id: formNames.CODE_MFA_PHONE,
      height: 191,
      inputsList: [...Object.values(inputNames[formNames.CODE_MFA_PHONE])],
      inputs: {
        [inputNames[formNames.CODE_MFA_PHONE].CODE]: {
          parentId: formNames.CODE_MFA_PHONE,
          id: inputNames[formNames.CODE_MFA_PHONE].CODE,
          value: '',
          errorMessage: '',
        },
      },
    },
    [formNames.CODE_VERIFY_EMAIL]: {
      id: formNames.CODE_VERIFY_EMAIL,
      height: 235,
      inputsList: [],
      inputs: {},
    },
    [formNames.DEVICE]: {
      id: formNames.DEVICE,
      height: 183,
      inputsList: [],
      inputs: {},
    },
  },
  buttons: {
    list: [...Object.values(buttonNames)],
    [buttonNames.FIRST]: { id: buttonNames.FIRST, text: buttonTexts.LOG_IN },
    [buttonNames.SECOND]: { id: buttonNames.SECOND, text: buttonTexts.SIGN_UP },
    [buttonNames.FORGOT_PASSWORD]: {
      id: buttonNames.FORGOT_PASSWORD,
      text: buttonTexts.FORGOT_PASSWORD,
    },
  },
};

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
    default:
      return state;
  }
};

const uiReducersExternal = combineReducers({
  utilities,
  forms,
  buttons,
});

export default uiReducersExternal;
