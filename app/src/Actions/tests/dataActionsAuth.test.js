import configureMockStore from 'redux-mock-store';
import { initialState } from '../../Reducers/dataReducersAuth';
import { requestStatusTypes, pathNames } from '../../Constants/universalConstants';
import { actionTypes } from '../../Constants/dataConstantsAuth';
import {
  setAuthenticated,
  setRedirectURL,
  setAuthStatus,
  setCodeType,
  resetAuthState,
} from '../dataActionsAuth';

const middleware = [];
const mockStore = configureMockStore(middleware);

describe('dataActionsAuth', () => {
  describe('setAuthenticated', () => {
    it("fails when not provided a payload with a 'authenticated' key", () => {
      const store = mockStore(initialState);

      const payload = {};

      expect(() => store.dispatch(setAuthenticated(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with an 'authenticated' key that is not a boolean", () => {
      const store = mockStore(initialState);

      const payload = { authenticated: 'authenticated' };

      expect(() => store.dispatch(setAuthenticated(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { authenticated: true };
      const expectedActions = [
        {
          type: actionTypes.SET_AUTHENTICATED,
          payload,
        },
      ];

      store.dispatch(setAuthenticated(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setRedirectURL', () => {
    it("fails when not provided a payload with a 'redirectURL' key", () => {
      const store = mockStore(initialState);

      const payload = {};

      expect(() => store.dispatch(setRedirectURL(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { redirectURL: pathNames.ACCOUNT };
      const expectedActions = [
        {
          type: actionTypes.SET_REDIRECT_URL,
          payload,
        },
      ];

      store.dispatch(setRedirectURL(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setAuthStatus', () => {
    it("fails when not provided a payload with a 'id' key", () => {
      const store = mockStore(initialState);

      const payload = { status: requestStatusTypes.SUCCESS };

      expect(() => store.dispatch(setAuthStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'status' key", () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId' };

      expect(() => store.dispatch(setAuthStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId', status: requestStatusTypes.SUCCESS };
      const expectedActions = [
        {
          type: actionTypes.SET_AUTH_STATUS,
          payload,
        },
      ];

      store.dispatch(setAuthStatus(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setCodeType', () => {
    it("fails when not provided a payload with a 'id' key", () => {
      const store = mockStore(initialState);

      const payload = { needed: false };

      expect(() => store.dispatch(setCodeType(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'needed' key", () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId' };

      expect(() => store.dispatch(setCodeType(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with a 'needed' key that is not a boolean", () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId', needed: 'needed' };

      expect(() => store.dispatch(setCodeType(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId', needed: false };
      const expectedActions = [
        {
          type: actionTypes.SET_CODE_TYPE,
          payload,
        },
      ];

      store.dispatch(setCodeType(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('resetAuthState', () => {
    it('creates the correct action', () => {
      const store = mockStore(initialState);

      const expectedActions = [
        {
          type: actionTypes.RESET_AUTH_STATE,
        },
      ];

      store.dispatch(resetAuthState());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});
