import configureMockStore from 'redux-mock-store';
import { initialState } from '../../Reducers/dataReducersAccount';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { actionTypes } from '../../Constants/dataConstantsAccount';
import { setAccountStatus, setField, setFields, resetAccountState } from '../dataActionsAccount';

const middleware = [];
const mockStore = configureMockStore(middleware);

describe('dataActionsAccount', () => {
  describe('setAccountStatus', () => {
    it("fails when not provided a payload with an 'id' key", () => {
      const store = mockStore(initialState);

      const payload = { status: requestStatusTypes.SUCCESS };

      expect(() => store.dispatch(setAccountStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'status' key", () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId' };

      expect(() => store.dispatch(setAccountStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId', status: requestStatusTypes.SUCCESS };
      const expectedActions = [
        {
          type: actionTypes.SET_ACCOUNT_STATUS,
          payload,
        },
      ];

      store.dispatch(setAccountStatus(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setField', () => {
    it("fails when not provided a payload with an 'id' key", () => {
      const store = mockStore(initialState);

      const payload = { value: 'testValue' };

      expect(() => store.dispatch(setField(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'value' key", () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId' };

      expect(() => store.dispatch(setField(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId', value: 'testValue' };
      const expectedActions = [
        {
          type: actionTypes.SET_FIELD,
          payload,
        },
      ];

      store.dispatch(setField(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setFields', () => {
    it("fails when not provided a payload with an 'id' key", () => {
      const store = mockStore(initialState);

      const payload = {
        testId1: { id: 'testId1', value: 'testValue1' },
        testId2: { value: 'testValue2' },
      };

      expect(() => store.dispatch(setFields(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'value' key", () => {
      const store = mockStore(initialState);

      const payload = {
        testId1: { id: 'testId1', value: 'testValue1' },
        testId2: { id: 'testId2' },
      };

      expect(() => store.dispatch(setFields(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = {
        testId1: { id: 'testId1', value: 'testValue1' },
        testId2: { id: 'testId2', value: 'testValue2' },
      };
      const expectedActions = [
        {
          type: actionTypes.SET_FIELDS,
          payload,
        },
      ];

      store.dispatch(setFields(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('resetAccountState', () => {
    it('creates the correct action', () => {
      const store = mockStore(initialState);

      const expectedActions = [
        {
          type: actionTypes.RESET_ACCOUNT_STATE,
        },
      ];

      store.dispatch(resetAccountState());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});
