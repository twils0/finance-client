import configureMockStore from 'redux-mock-store';
import { initialState } from '../../Reducers/uiReducersExternal';
import { actionTypes } from '../../Constants/uiConstantsExternal';
import {
  setCurrentForm,
  setFormHeight,
  setInputValueError,
  setButtonText,
} from '../uiActionsExternal';

const middleware = [];
const mockStore = configureMockStore(middleware);

describe('uiActionsExternal', () => {
  describe('setCurrentForm', () => {
    it("fails when not provided a payload with a 'current' key", () => {
      const store = mockStore(initialState);

      const payload = {};

      expect(() => store.dispatch(setCurrentForm(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { current: 'testId' };
      const expectedActions = [
        {
          type: actionTypes.SET_CURRENT_FORM,
          payload,
        },
      ];

      store.dispatch(setCurrentForm(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setFormHeight', () => {
    it("fails when not provided a payload with a 'id' key", () => {
      const store = mockStore(initialState);

      const payload = { height: 1 };

      expect(() => store.dispatch(setFormHeight(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'height' key", () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId' };

      expect(() => store.dispatch(setFormHeight(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with an 'height' key that is not a number", () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId', height: 'height' };

      expect(() => store.dispatch(setFormHeight(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId', height: 1 };
      const expectedActions = [
        {
          type: actionTypes.SET_FORM_HEIGHT,
          payload,
        },
      ];

      store.dispatch(setFormHeight(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setInputValueError', () => {
    it("fails when not provided a payload with a 'id' key", () => {
      const store = mockStore(initialState);

      const payload = {
        parentId: 'testParentId',
        value: 'testValue',
        errorMessage: 'testErrorMessage',
      };

      expect(() => store.dispatch(setInputValueError(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'parentId' key", () => {
      const store = mockStore(initialState);

      const payload = {
        id: 'testId',
        value: 'testValue',
        errorMessage: 'testErrorMessage',
      };

      expect(() => store.dispatch(setInputValueError(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'value' key", () => {
      const store = mockStore(initialState);

      const payload = {
        id: 'testId',
        parentId: 'testParentId',
        errorMessage: 'testErrorMessage',
      };

      expect(() => store.dispatch(setInputValueError(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'errorMessage' key", () => {
      const store = mockStore(initialState);

      const payload = {
        id: 'testId',
        parentId: 'testParentId',
        value: 'testValue',
      };

      expect(() => store.dispatch(setInputValueError(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = {
        id: 'testId',
        parentId: 'testParentId',
        value: 'testValue',
        errorMessage: 'testErrorMessage',
      };
      const expectedActions = [
        {
          type: actionTypes.SET_INPUT_VALUE_ERROR,
          payload,
        },
      ];

      store.dispatch(setInputValueError(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setButtonText', () => {
    it("fails when not provided a payload with a 'id' key", () => {
      const store = mockStore(initialState);

      const payload = { text: 'testText' };

      expect(() => store.dispatch(setButtonText(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'text' key", () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId' };

      expect(() => store.dispatch(setButtonText(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId', text: 'testText' };
      const expectedActions = [
        {
          type: actionTypes.SET_BUTTON_TEXT,
          payload,
        },
      ];

      store.dispatch(setButtonText(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});
