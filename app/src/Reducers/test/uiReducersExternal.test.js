import { initialState, utilities, forms, buttons } from '../../Reducers/uiReducersExternal';
import {
  actionTypes,
  formNames,
  inputNames,
  buttonNames,
} from '../../Constants/uiConstantsExternal';

describe('uiReducersExternal', () => {
  describe('utilities', () => {
    it('returns the initial state', () => {
      const action = {};
      const stateAfter = JSON.parse(JSON.stringify(initialState.utilities));

      expect(utilities(undefined, action)).toEqual(stateAfter);
    });
  });

  describe('forms', () => {
    it('returns the initial state', () => {
      const action = {};
      const stateAfter = JSON.parse(JSON.stringify(initialState.forms));

      expect(forms(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_CURRENT_FORM action', () => {
      const type = actionTypes.SET_CURRENT_FORM;
      const current = formNames.RESET_PASSWORD;
      const action = {
        type,
        payload: {
          current,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.forms));

      stateAfter.current = current;

      expect(forms(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_FORM_HEIGHT action', () => {
      const type = actionTypes.SET_FORM_HEIGHT;
      const id = formNames.RESET_PASSWORD;
      const height = 200;
      const action = {
        type,
        payload: {
          id,
          height,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.forms));

      stateAfter[id].height = height;

      expect(forms(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_INPUT_VALUE_ERROR action', () => {
      const type = actionTypes.SET_INPUT_VALUE_ERROR;
      const parentId = formNames.RESET_PASSWORD;
      const id = inputNames[formNames.RESET_PASSWORD].CODE;
      const value = 'testValue';
      const errorMessage = 'testMessage';
      const action = {
        type,
        payload: {
          id,
          parentId,
          value,
          errorMessage,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.forms));

      stateAfter[parentId].inputs[id].parentId = parentId;
      stateAfter[parentId].inputs[id].id = id;
      stateAfter[parentId].inputs[id].value = value;
      stateAfter[parentId].inputs[id].errorMessage = errorMessage;

      expect(forms(undefined, action)).toEqual(stateAfter);
    });
  });

  describe('buttons', () => {
    it('returns the initial state', () => {
      const action = {};

      const stateAfter = JSON.parse(JSON.stringify(initialState.buttons));

      expect(buttons(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_BUTTON_TEXT action', () => {
      const type = actionTypes.SET_BUTTON_TEXT;
      const id = buttonNames.FIRST;
      const text = 'testText';
      const action = {
        type,
        payload: {
          id,
          text,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.buttons));

      stateAfter[id].text = text;

      expect(buttons(undefined, action)).toEqual(stateAfter);
    });
  });
});
