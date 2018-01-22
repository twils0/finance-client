import { initialState, status, securities } from '../dataReducersWatchlist';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { actionTypes, statusNames } from '../../Constants/dataConstantsWatchlist';

describe('dataReducersWatchlist', () => {
  describe('status', () => {
    it('returns the initial state', () => {
      const action = {};
      const stateAfter = JSON.parse(JSON.stringify(initialState.status));

      expect(status(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_WATCHLIST_STATUS action', () => {
      const type = actionTypes.SET_WATCHLIST_STATUS;
      const id = statusNames.SECURITIES;
      const statusSuccess = requestStatusTypes.SUCCESS;
      const action = {
        type,
        payload: {
          id,
          status: statusSuccess,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.status));

      stateAfter[id].status = statusSuccess;

      expect(status(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles RESET_WATCHLIST_STATE action', () => {
      const type = actionTypes.RESET_WATCHLIST_STATE;
      const id = statusNames.SECURITIES;
      const statusSuccess = requestStatusTypes.SUCCESS;
      const action = {
        type,
      };
      const stateBefore = JSON.parse(JSON.stringify(initialState.status));
      const stateAfter = JSON.parse(JSON.stringify(initialState.status));

      stateBefore[id].status = statusSuccess;

      expect(status(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('securities', () => {
    it('returns the initial state', () => {
      const action = {};

      const stateAfter = JSON.parse(JSON.stringify(initialState.securities));

      expect(securities(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_SECURITIES_CURRENT action', () => {
      const type = actionTypes.SET_SECURITIES_CURRENT;
      const current = 'testId';
      const action = {
        type,
        payload: {
          current,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.securities));

      stateAfter.current = current;

      expect(securities(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_SECURITIES_LIST action', () => {
      const type = actionTypes.SET_SECURITIES_LIST;
      const list = ['testId1', 'testId2'];
      const action = {
        type,
        payload: {
          list,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.securities));

      stateAfter.list = list;

      expect(securities(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_SECURITIES_ALL action', () => {
      const type = actionTypes.SET_SECURITIES_ALL;
      const securitiesObject = {
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
      };
      const action = {
        type,
        payload: {
          securities: securitiesObject,
        },
      };
      const stateAfter = securitiesObject;

      expect(securities(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_SECURITY action', () => {
      const type = actionTypes.SET_SECURITY;
      const id = 'testId1';
      const payload = {
        id,
        name: 'testName1',
        exchange: null,
        tickerCusip: 'testTickerCusip1',
        category: 'testCategory1',
      };
      const action = {
        type,
        payload,
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.securities));

      stateAfter[id] = payload;

      expect(securities(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_SECURITY_DATA action, when security missing', () => {
      const type = actionTypes.SET_SECURITY_DATA;
      const id = 'testId';
      const payload = {
        id,
        data: {
          description: 'testDescription',
        },
      };
      const action = {
        type,
        payload,
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.securities));

      stateAfter[id] = payload;

      expect(securities(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_SECURITY_DATA action, when security present', () => {
      const stateBefore = JSON.parse(JSON.stringify(initialState.securities));

      const type = actionTypes.SET_SECURITY_DATA;
      const id = 'testId';
      const payload = {
        id,
        data: {
          description: 'testDescription',
        },
      };

      stateBefore[payload.id] = { id: payload.id };

      const action = {
        type,
        payload,
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.securities));

      stateAfter[id] = payload;

      expect(securities(stateBefore, action)).toEqual(stateAfter);
    });

    it('correctly handles RESET_WATCHLIST_STATE action', () => {
      const type = actionTypes.RESET_WATCHLIST_STATE;
      const securitiesObject = {
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
      };
      const action = {
        type,
        payload: {
          securities: securitiesObject,
        },
      };
      const stateBefore = JSON.parse(JSON.stringify(initialState.securities));
      const stateAfter = JSON.parse(JSON.stringify(initialState.securities));

      stateBefore.securities = securitiesObject;

      expect(securities(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
