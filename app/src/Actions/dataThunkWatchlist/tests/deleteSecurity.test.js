import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateWatchlist } from '../../../Reducers/dataReducersWatchlist';
import { actionTypes as actionTypesWatchlist } from '../../../Constants/dataConstantsWatchlist';
import deleteSecurity from '../deleteSecurity';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const securities = {
  current: 'testId0',
  list: ['testId0', 'testId1', 'testId2'],
  testId0: {
    id: 'testId0',
    name: 'testName0',
    category: 'testCategory0',
    exchange: 'testExchange0',
    tickerCusip: 'testTickerCusip0',
    data: {
      description: 'testDescription0',
    },
  },
  testId1: {
    id: 'testId1',
    name: 'testName1',
    category: 'testCategory1',
    exchange: 'testExchange1',
    tickerCusip: 'testTickerCusip1',
    data: {
      description: 'testDescription1',
    },
  },
  testId2: {
    id: 'testId2',
    name: 'testName2',
    category: 'testCategory2',
    exchange: 'testExchange2',
    tickerCusip: 'testTickerCusip2',
    data: {
      description: 'testDescription2',
    },
  },
};

describe('dataThunkWatchlist', () => {
  describe('deleteSecurity', () => {
    it("fails and throws an error when missing 'id' key in payload", async () => {
      const store = mockStore({ data: { watchlist: initialStateWatchlist } });

      const emptyPayload = {};

      expect(() => store.dispatch(deleteSecurity(emptyPayload))).toThrowErrorMatchingSnapshot();
    });

    it('deletes index 0 list security, which is not current security', async () => {
      const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
      stateBeforeWatchlist.securities = JSON.parse(JSON.stringify(securities));
      [, stateBeforeWatchlist.securities.current] = securities.list;
      const store = mockStore({ data: { watchlist: stateBeforeWatchlist } });

      const deletePayload = { id: 'testId0' };
      const newSecurities = JSON.parse(JSON.stringify(securities));
      [, newSecurities.current] = securities.list;
      newSecurities.list.splice(0, 1);
      delete newSecurities[securities.list[0]];

      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_SECURITIES_ALL,
          payload: {
            securities: newSecurities,
          },
        },
      ];

      store.dispatch(deleteSecurity(deletePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('deletes index 0 list security, which is current security, and changes index 1 list security to current security', async () => {
      const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
      stateBeforeWatchlist.securities = JSON.parse(JSON.stringify(securities));
      const store = mockStore({ data: { watchlist: stateBeforeWatchlist } });

      const deletePayload = { id: 'testId0' };
      const newSecurities = JSON.parse(JSON.stringify(securities));
      [, newSecurities.current] = securities.list;
      newSecurities.list.splice(0, 1);
      delete newSecurities[securities.list[0]];

      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_SECURITIES_ALL,
          payload: {
            securities: newSecurities,
          },
        },
      ];

      store.dispatch(deleteSecurity(deletePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('deletes index 1 list security, which is not current security', async () => {
      const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
      stateBeforeWatchlist.securities = JSON.parse(JSON.stringify(securities));
      [, , stateBeforeWatchlist.securities.current] = securities.list;
      const store = mockStore({ data: { watchlist: stateBeforeWatchlist } });

      const deletePayload = { id: 'testId1' };
      const newSecurities = JSON.parse(JSON.stringify(securities));
      [, , newSecurities.current] = securities.list;
      newSecurities.list.splice(1, 1);
      delete newSecurities[securities.list[1]];

      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_SECURITIES_ALL,
          payload: {
            securities: newSecurities,
          },
        },
      ];

      store.dispatch(deleteSecurity(deletePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('deletes index 1 list security, which is current security, and changes index 0 list security to current security', async () => {
      const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
      stateBeforeWatchlist.securities = JSON.parse(JSON.stringify(securities));
      [, stateBeforeWatchlist.securities.current] = securities.list;
      const store = mockStore({ data: { watchlist: stateBeforeWatchlist } });

      const deletePayload = { id: 'testId1' };
      const newSecurities = JSON.parse(JSON.stringify(securities));
      [newSecurities.current] = securities.list;
      newSecurities.list.splice(1, 1);
      delete newSecurities[securities.list[1]];

      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_SECURITIES_ALL,
          payload: {
            securities: newSecurities,
          },
        },
      ];

      store.dispatch(deleteSecurity(deletePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('delete last security in list correctly', async () => {
      const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
      stateBeforeWatchlist.securities = JSON.parse(JSON.stringify(securities));
      stateBeforeWatchlist.securities.list.splice(1, 2);
      delete stateBeforeWatchlist.securities[securities.list[1]];
      delete stateBeforeWatchlist.securities[securities.list[2]];
      const store = mockStore({ data: { watchlist: stateBeforeWatchlist } });

      const deletePayload = { id: 'testId0' };
      const newSecurities = JSON.parse(JSON.stringify(securities));
      newSecurities.current = null;
      newSecurities.list = [];
      delete newSecurities[securities.list[0]];
      delete newSecurities[securities.list[1]];
      delete newSecurities[securities.list[2]];

      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_SECURITIES_ALL,
          payload: {
            securities: newSecurities,
          },
        },
      ];

      store.dispatch(deleteSecurity(deletePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});
