import { initialState, utilities, forms, buttons } from '../../Reducers/uiReducersAccount';
import {
  actionTypes,
  formNames,
  inputNames,
  buttonNames,
} from '../../Constants/uiConstantsAccount';

describe('uiReducersAccount', () => {
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
      const current = formNames.BILLING;
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
      const id = formNames.BILLING;
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

    it('correctly handles SET_FORM_EDIT action', () => {
      const type = actionTypes.SET_FORM_EDIT;
      const id = formNames.BILLING;
      const edit = true;
      const action = {
        type,
        payload: {
          id,
          edit,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.forms));

      stateAfter[id].edit = edit;

      expect(forms(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_INPUT_VALUE_ERROR action', () => {
      const type = actionTypes.SET_INPUT_VALUE_ERROR;
      const parentId = formNames.BILLING;
      const id = inputNames[formNames.BILLING].NAME_ON_CARD;
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

    it('correctly handles SET_BUTTON_VISIBLE action', () => {
      const type = actionTypes.SET_BUTTON_VISIBLE;
      const id = buttonNames.FIRST;
      const visible = true;
      const action = {
        type,
        payload: {
          id,
          visible,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.buttons));

      stateAfter[id].visible = visible;

      expect(buttons(undefined, action)).toEqual(stateAfter);
    });
  });
});
