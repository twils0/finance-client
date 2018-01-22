import configureMockStore from 'redux-mock-store';
import { initialState } from '../../Reducers/dataReducersWatchlist';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { actionTypes } from '../../Constants/dataConstantsWatchlist';
import {
  setWatchlistStatus,
  setSecuritiesCurrent,
  setSecuritiesList,
  setSecuritiesAll,
  setSecurity,
  setSecurityData,
  resetWatchlistState,
} from '../dataActionsWatchlist';

const middleware = [];
const mockStore = configureMockStore(middleware);

describe('dataActionsWatchlist', () => {
  describe('setWatchlistStatus', () => {
    it("fails when not provided a payload with an 'id' key", () => {
      const store = mockStore(initialState);

      const payload = { status: requestStatusTypes.SUCCESS };

      expect(() => store.dispatch(setWatchlistStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'status' key", () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId' };

      expect(() => store.dispatch(setWatchlistStatus(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId', status: requestStatusTypes.SUCCESS };
      const expectedActions = [
        {
          type: actionTypes.SET_WATCHLIST_STATUS,
          payload,
        },
      ];

      store.dispatch(setWatchlistStatus(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setSecuritiesCurrent', () => {
    it("fails when not provided a payload with a 'current' key", () => {
      const store = mockStore(initialState);

      const payload = {};

      expect(() => store.dispatch(setSecuritiesCurrent(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { current: 'testId' };
      const expectedActions = [
        {
          type: actionTypes.SET_SECURITIES_CURRENT,
          payload,
        },
      ];

      store.dispatch(setSecuritiesCurrent(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setSecuritiesList', () => {
    it("fails when not provided a payload with a 'list' key", () => {
      const store = mockStore(initialState);

      const payload = {};

      expect(() => store.dispatch(setSecuritiesList(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with a 'list' key that is not an array", () => {
      const store = mockStore(initialState);

      const payload = { list: {} };

      expect(() => store.dispatch(setSecuritiesList(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { list: ['testId1', 'testId2'] };
      const expectedActions = [
        {
          type: actionTypes.SET_SECURITIES_LIST,
          payload,
        },
      ];

      store.dispatch(setSecuritiesList(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setSecuritiesAll', () => {
    it("fails when not provided a payload with an 'securities' key", () => {
      const store = mockStore(initialState);

      const payload = {
        current: 'testId',
        list: ['testId1', 'testId2'],
        testId1: {
          id: 'testId1',
          name: 'testName1',
          exchange: null,
          tickerCusip: 'testTickerCusip1',
          category: 'testCategory1',
        },
        testId2: {
          id: 'testId2',
          name: 'testName2',
          exchange: null,
          tickerCusip: 'testTickerCusip2',
          category: 'testCategory2',
        },
      };

      expect(() => store.dispatch(setSecuritiesAll(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with an 'securities' key that is not an object", () => {
      const store = mockStore(initialState);

      const payload = {
        securities: [],
      };

      expect(() => store.dispatch(setSecuritiesAll(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'current' key", () => {
      const store = mockStore(initialState);

      const payload = {
        securities: {
          list: ['testId1', 'testId2'],
          testId1: {
            id: 'testId1',
            name: 'testName1',
            exchange: null,
            tickerCusip: 'testTickerCusip1',
            category: 'testCategory1',
          },
          testId2: {
            id: 'testId2',
            name: 'testName2',
            exchange: null,
            tickerCusip: 'testTickerCusip2',
            category: 'testCategory2',
          },
        },
      };

      expect(() => store.dispatch(setSecuritiesAll(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with a 'list' key", () => {
      const store = mockStore(initialState);

      const payload = {
        securities: {
          current: 'testId1',
          testId1: {
            id: 'testId1',
            name: 'testName1',
            exchange: null,
            tickerCusip: 'testTickerCusip1',
            category: 'testCategory1',
          },
          testId2: {
            id: 'testId2',
            name: 'testName2',
            exchange: null,
            tickerCusip: 'testTickerCusip2',
            category: 'testCategory2',
          },
        },
      };

      expect(() => store.dispatch(setSecuritiesAll(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with a 'list' key that is not an array", () => {
      const store = mockStore(initialState);

      const payload = {
        securities: {
          current: 'testId1',
          list: {},
          testId1: {
            id: 'testId1',
            name: 'testName1',
            exchange: null,
            tickerCusip: 'testTickerCusip1',
            category: 'testCategory1',
          },
          testId2: {
            id: 'testId2',
            name: 'testName2',
            exchange: null,
            tickerCusip: 'testTickerCusip2',
            category: 'testCategory2',
          },
        },
      };

      expect(() => store.dispatch(setSecuritiesAll(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with an security that does not have an 'id' key", () => {
      const store = mockStore(initialState);

      const payload = {
        securities: {
          current: 'testId1',
          list: ['testId1', 'testId2'],
          testId1: {
            id: 'testId1',
            name: 'testName1',
            exchange: null,
            tickerCusip: 'testTickerCusip1',
            category: 'testCategory1',
          },
          testId2: {
            name: 'testName2',
            exchange: null,
            tickerCusip: 'testTickerCusip2',
            category: 'testCategory2',
          },
        },
      };

      expect(() => store.dispatch(setSecuritiesAll(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with an security that does not have an 'name' key", () => {
      const store = mockStore(initialState);

      const payload = {
        securities: {
          current: 'testId1',
          list: ['testId1', 'testId2'],
          testId1: {
            id: 'testId1',
            name: 'testName1',
            exchange: null,
            tickerCusip: 'testTickerCusip1',
            category: 'testCategory1',
          },
          testId2: {
            id: 'testId2',
            exchange: null,
            tickerCusip: 'testTickerCusip2',
            category: 'testCategory2',
          },
        },
      };

      expect(() => store.dispatch(setSecuritiesAll(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with an security that does not have an 'exchange' key", () => {
      const store = mockStore(initialState);

      const payload = {
        securities: {
          current: 'testId1',
          list: ['testId1', 'testId2'],
          testId1: {
            id: 'testId1',
            name: 'testName1',
            exchange: null,
            tickerCusip: 'testTickerCusip1',
            category: 'testCategory1',
          },
          testId2: {
            id: 'testId2',
            name: 'testName2',
            tickerCusip: 'testTickerCusip2',
            category: 'testCategory2',
          },
        },
      };

      expect(() => store.dispatch(setSecuritiesAll(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with an security that does not have an 'tickerCusip' key", () => {
      const store = mockStore(initialState);

      const payload = {
        securities: {
          current: 'testId1',
          list: ['testId1', 'testId2'],
          testId1: {
            id: 'testId1',
            name: 'testName1',
            exchange: null,
            tickerCusip: 'testTickerCusip1',
            category: 'testCategory1',
          },
          testId2: {
            id: 'testId2',
            name: 'testName2',
            exchange: null,
            category: 'testCategory2',
          },
        },
      };

      expect(() => store.dispatch(setSecuritiesAll(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with an security that does not have an 'category' key", () => {
      const store = mockStore(initialState);

      const payload = {
        securities: {
          current: 'testId1',
          list: ['testId1', 'testId2'],
          testId1: {
            id: 'testId1',
            name: 'testName1',
            exchange: null,
            tickerCusip: 'testTickerCusip1',
            category: 'testCategory1',
          },
          testId2: {
            id: 'testId2',
            name: 'testName2',
            exchange: null,
            tickerCusip: 'testTickerCusip2',
          },
        },
      };

      expect(() => store.dispatch(setSecuritiesAll(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = {
        securities: {
          current: 'testId1',
          list: ['testId1', 'testId2'],
          testId1: {
            id: 'testId1',
            name: 'testName1',
            exchange: null,
            tickerCusip: 'testTickerCusip1',
            category: 'testCategory1',
          },
          testId2: {
            id: 'testId2',
            name: 'testName2',
            exchange: null,
            tickerCusip: 'testTickerCusip2',
            category: 'testCategory2',
          },
        },
      };
      const expectedActions = [
        {
          type: actionTypes.SET_SECURITIES_ALL,
          payload,
        },
      ];

      store.dispatch(setSecuritiesAll(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setSecurity', () => {
    it("fails when not provided a payload with an 'id' key", () => {
      const store = mockStore(initialState);

      const payload = {
        name: 'testName',
        exchange: null,
        tickerCusip: 'testTickerCusip',
        category: 'testCategory',
      };

      expect(() => store.dispatch(setSecurity(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with an 'name' key", () => {
      const store = mockStore(initialState);

      const payload = {
        id: 'testId',
        exchange: null,
        tickerCusip: 'testTickerCusip',
        category: 'testCategory',
      };

      expect(() => store.dispatch(setSecurity(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with an 'exchange' key", () => {
      const store = mockStore(initialState);

      const payload = {
        id: 'testId',
        name: 'testName',
        tickerCusip: 'testTickerCusip',
        category: 'testCategory',
      };

      expect(() => store.dispatch(setSecurity(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with an 'tickerCusip' key", () => {
      const store = mockStore(initialState);

      const payload = {
        id: 'testId',
        name: 'testName',
        exchange: null,
        category: 'testCategory',
      };

      expect(() => store.dispatch(setSecurity(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with an 'category' key", () => {
      const store = mockStore(initialState);

      const payload = {
        id: 'testId',
        name: 'testName',
        exchange: null,
        tickerCusip: 'testTickerCusip',
      };

      expect(() => store.dispatch(setSecurity(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = {
        id: 'testId',
        name: 'testName',
        exchange: null,
        tickerCusip: 'testTickerCusip',
        category: 'testCategory',
      };
      const expectedActions = [
        {
          type: actionTypes.SET_SECURITY,
          payload,
        },
      ];

      store.dispatch(setSecurity(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('setSecurityData', () => {
    it("fails when not provided a payload with an 'id' key", () => {
      const store = mockStore(initialState);

      const payload = {
        data: {
          description: 'testDescription',
        },
      };

      expect(() => store.dispatch(setSecurityData(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when not provided a payload with an 'data' key", () => {
      const store = mockStore(initialState);

      const payload = {
        id: 'testId',
      };

      expect(() => store.dispatch(setSecurityData(payload))).toThrowErrorMatchingSnapshot();
    });

    it("fails when provided a payload with a 'data' key that is not an object", () => {
      const store = mockStore(initialState);

      const payload = { id: 'testId', data: [] };

      expect(() => store.dispatch(setSecurityData(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = {
        id: 'testId',
        data: {
          description: 'testDescription',
        },
      };
      const expectedActions = [
        {
          type: actionTypes.SET_SECURITY_DATA,
          payload,
        },
      ];

      store.dispatch(setSecurityData(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('resetWatchlistState', () => {
    it('creates the correct action', () => {
      const store = mockStore(initialState);

      const expectedActions = [
        {
          type: actionTypes.RESET_WATCHLIST_STATE,
        },
      ];

      store.dispatch(resetWatchlistState());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});
