import configureMockStore from 'redux-mock-store';
import { initialState } from '../../Reducers/dataReducersAWS';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { actionTypes } from '../../Constants/dataConstantsAWS';
import { setAWSStatus, setAWSUser, resetAWSState } from '../dataActionsAWS';

const middleware = [];
const mockStore = configureMockStore(middleware);

describe('dataActionsAWS', () => {
  describe('setAWSStatus', () => {
    it("fails when not provided a payload with a 'status' key", () => {
      const store = mockStore(initialState);

      const payload = {};

      expect(() => store.dispatch(setAWSStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { status: requestStatusTypes.SUCCESS };
      const expectedActions = [
        {
          type: actionTypes.SET_AWS_STATUS,
          payload,
        },
      ];

      store.dispatch(setAWSStatus(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setAWSUser', () => {
    it("fails when not provided a payload with an 'user' key", () => {
      const store = mockStore(initialState);

      const payload = {};

      expect(() => store.dispatch(setAWSUser(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with an 'user' key that is not an object", () => {
      const store = mockStore(initialState);

      const payload = { user: [] };

      expect(() => store.dispatch(setAWSUser(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { user: {} };
      const expectedActions = [
        {
          type: actionTypes.SET_AWS_USER,
          payload,
        },
      ];

      store.dispatch(setAWSUser(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('resetAWSState', () => {
    it('creates the correct action', () => {
      const store = mockStore(initialState);

      const expectedActions = [
        {
          type: actionTypes.RESET_AWS_STATE,
        },
      ];

      store.dispatch(resetAWSState());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});
