import configureMockStore from 'redux-mock-store';
import { initialState } from '../../Reducers/uiReducersApp';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { actionTypes } from '../../Constants/uiConstantsApp';
import {
  setFontsStatus,
  setImageStatus,
  setStripeStatus,
  setStripeElementLoaded,
  setStripeObject,
} from '../uiActionsApp';

const middleware = [];
const mockStore = configureMockStore(middleware);

describe('uiActionsApp', () => {
  describe('setFontsStatus', () => {
    it("fails when not provided a payload with a 'status' key", () => {
      const store = mockStore(initialState);

      const payload = {};

      expect(() => store.dispatch(setFontsStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { status: requestStatusTypes.SUCCESS };
      const expectedActions = [
        {
          type: actionTypes.SET_FONTS_STATUS,
          payload,
        },
      ];

      store.dispatch(setFontsStatus(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setImageStatus', () => {
    it("fails when not provided a payload with a 'id' key", () => {
      const store = mockStore(initialState);

      const payload = { status: requestStatusTypes.SUCCESS };

      expect(() => store.dispatch(setImageStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'status' key", () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId' };

      expect(() => store.dispatch(setImageStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId', status: requestStatusTypes.SUCCESS };
      const expectedActions = [
        {
          type: actionTypes.SET_IMAGE_STATUS,
          payload,
        },
      ];

      store.dispatch(setImageStatus(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setStripeStatus', () => {
    it("fails when not provided a payload with a 'status' key", () => {
      const store = mockStore(initialState);

      const payload = {};

      expect(() => store.dispatch(setStripeStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { status: requestStatusTypes.SUCCESS };
      const expectedActions = [
        {
          type: actionTypes.SET_STRIPE_STATUS,
          payload,
        },
      ];

      store.dispatch(setStripeStatus(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setStripeElementLoaded', () => {
    it("fails when not provided a payload with a 'id' key", () => {
      const store = mockStore(initialState);

      const payload = { loaded: true };

      expect(() => store.dispatch(setImageStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'loaded' key", () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId' };

      expect(() => store.dispatch(setImageStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with a 'loaded' key that is not a boolean", () => {
      const store = mockStore(initialState);

      const payload = { loaded: 'loaded' };

      expect(() => store.dispatch(setStripeElementLoaded(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId', loaded: true };
      const expectedActions = [
        {
          type: actionTypes.SET_STRIPE_ELEMENT_LOADED,
          payload,
        },
      ];

      store.dispatch(setStripeElementLoaded(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setStripeObject', () => {
    it("fails when not provided a payload with a 'stripeObject' key", () => {
      const store = mockStore(initialState);

      const payload = {};

      expect(() => store.dispatch(setStripeObject(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with a 'stripeObject' key that is not an object", () => {
      const store = mockStore(initialState);

      const payload = { stripeObject: [] };

      expect(() => store.dispatch(setStripeObject(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { stripeObject: {} };
      const expectedActions = [
        {
          type: actionTypes.SET_STRIPE_OBJECT,
          payload,
        },
      ];

      store.dispatch(setStripeObject(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});
