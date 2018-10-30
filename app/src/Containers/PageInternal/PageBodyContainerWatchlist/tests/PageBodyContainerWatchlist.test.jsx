import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import { initialState as initialStateAWS } from '../../../../Reducers/dataReducersAWS';
import { initialState as initialStateWatchlist } from '../../../../Reducers/dataReducersWatchlist';
import { initialState as initialStateUIInternal } from '../../../../Reducers/uiReducersInternal';
import { initialState as initialStateUIWatchlist } from '../../../../Reducers/uiReducersWatchlist';
import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { statusNames } from '../../../../Constants/dataConstantsWatchlist';

import PageBodyContainerWatchlist from '../PageBodyContainerWatchlist';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const shallowComponent = store => shallow(<PageBodyContainerWatchlist />, {
  context: {
    store,
  },
}).dive();

const testId0 = 'testId0';
const testId1 = 'testId1';
const testId2 = 'testId2';

const securities = {
  current: testId0,
  list: [testId0, testId1, testId2],
  [testId0]: {
    id: testId0,
    name: 'testName0',
    category: 'testCategory0',
    exchange: 'testExchange0',
    tickerCusip: 'testTickerCusip0',
    data: {
      description: 'testDescription0',
    },
  },
  [testId1]: {
    id: testId1,
    name: 'testName1',
    category: 'testCategory1',
    exchange: 'testExchange1',
    tickerCusip: 'testTickerCusip1',
    data: {
      description: 'testDescription1',
    },
  },
  [testId2]: {
    id: testId2,
    name: 'testName2',
    category: 'testCategory2',
    exchange: 'testExchange2',
    tickerCusip: 'testTickerCusip2',
    data: {
      description: 'testDescription2',
    },
  },
};

describe('Containers', () => {
  describe('PageInternal', () => {
    describe('PageBodyContainerWatchlist', () => {
      it('shallow renders correctly', async () => {
        const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
        const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));

        stateBeforeAWS.status = requestStatusTypes.SUCCESS;

        stateBeforeWatchlist.securities = securities;

        const store = mockStore({
          data: {
            aws: stateBeforeAWS,
            watchlist: stateBeforeWatchlist,
          },
          ui: {
            internal: {
              ...initialStateUIInternal,
              watchlist: initialStateUIWatchlist,
            },
          },
        });

        const expectedActions = [];

        const wrapper = shallowComponent(store);

        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
        expect(wrapper).toMatchSnapshot();
      });

      it('shallow renders correctly, with loading indicator', async () => {
        const store = mockStore({
          data: {
            aws: initialStateAWS,
            watchlist: initialStateWatchlist,
          },
          ui: {
            internal: {
              ...initialStateUIInternal,
              watchlist: initialStateUIWatchlist,
            },
          },
        });

        const expectedActions = [];

        const wrapper = shallowComponent(store);

        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
        expect(wrapper).toMatchSnapshot();
      });

      it('shallow renders correctly, statusSecurities equals succcess', async () => {
        const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));

        stateBeforeWatchlist.securities = securities;
        stateBeforeWatchlist.status[statusNames.SECURITIES].status = requestStatusTypes.SUCCESS;

        const store = mockStore({
          data: {
            aws: initialStateAWS,
            watchlist: stateBeforeWatchlist,
          },
          ui: {
            internal: {
              ...initialStateUIInternal,
              watchlist: initialStateUIWatchlist,
            },
          },
        });

        const expectedActions = [];

        const wrapper = shallowComponent(store);

        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
