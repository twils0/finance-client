import { actionTypes } from '../Constants/uiConstantsExternal';

export const setCurrentForm = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'current')) {
    throw new Error(`Please enter a value for the 'current' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_CURRENT_FORM,
    payload,
  };
};

export const setFormHeight = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'height')) {
    throw new Error(`Please enter a value for the 'height' key - ${JSON.stringify(payload)}`);
  }
  if (typeof payload.height !== 'number') {
    throw new Error(`Please enter a number value for the 'height' key - ${JSON.stringify(payload)}`);
  }


  return {
    type: actionTypes.SET_FORM_HEIGHT,
    payload,
  };
};

export const setInputValueError = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'parentId')) {
    throw new Error(`Please enter a value for the 'parentId' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'value')) {
    throw new Error(`Please enter a value for the 'value' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'errorMessage')) {
    throw new Error(`Please enter a value for the 'errorMessage' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_INPUT_VALUE_ERROR,
    payload,
  };
};

export const setButtonText = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'text')) {
    throw new Error(`Please enter a value for the 'text' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_BUTTON_TEXT,
    payload,
  };
};
