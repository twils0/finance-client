import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import { initialState as initialStateWatchlist } from '../../../../Reducers/dataReducersWatchlist';
import { initialState as initialStateUIInternal } from '../../../../Reducers/uiReducersInternal';
import { initialState as initialStateUIWatchlist } from '../../../../Reducers/uiReducersWatchlist';

import requestSecurityData from '../../../../Actions/dataThunkWatchlist/requestSecurityData';

import ArticleContainerWatchlist from '../ArticleContainerWatchlist';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('../../../../Actions/dataThunkWatchlist/requestSecurityData', () => jest.fn());

const shallowComponent = store => shallow(<ArticleContainerWatchlist />, {
  context: {
    store,
  },
}).dive();

const testId0 = 'testId0';
const testTickerCusip0 = 'testTickerCusip0';
const testId1 = 'testId1';
const testTickerCusip1 = 'testTickerCusip1';
const testId2 = 'testId2';
const testTickerCusip2 = 'testTickerCusip2';

const securities = {
  current: testId0,
  list: [testId0, testId1, testId2],
  [testId0]: {
    id: testId0,
    name: 'testName0',
    category: 'testCategory0',
    exchange: 'testExchange0',
    tickerCusip: testTickerCusip0,
  },
  [testId1]: {
    id: testId1,
    name: 'testName1',
    category: 'testCategory1',
    exchange: 'testExchange1',
    tickerCusip: testTickerCusip1,
  },
  [testId2]: {
    id: testId2,
    name: 'testName2',
    category: 'testCategory2',
    exchange: 'testExchange2',
    tickerCusip: testTickerCusip2,
  },
};

describe('Containers', () => {
  describe('PageInternal', () => {
    describe('PageBodyContainerWatchlist', () => {
      describe('ArticleContainerWatchlist', () => {
        afterEach(() => {
          requestSecurityData.mockReset();
        });

        it('shallow renders correctly', async () => {
          const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));

          const noDataSecurities = JSON.parse(JSON.stringify({ ...securities }));
          delete noDataSecurities.testId0.data;

          stateBeforeWatchlist.securities = noDataSecurities;

          const store = mockStore({
            data: {
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

          requestSecurityData.mockReturnValue(() => null);

          const wrapper = shallowComponent(store);

          const actions = store.getActions();

          expect(actions).toEqual(expectedActions);
          expect(wrapper).toMatchSnapshot();
          expect(requestSecurityData).toBeCalledWith({
            id: testId0,
            tickerCusip: testTickerCusip0,
          });
        });

        it('shallow renders correctly, with componentWillReceiveProps', async () => {
          const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));

          stateBeforeWatchlist.securities = securities;

          const store = mockStore({
            data: {
              watchlist: stateBeforeWatchlist,
            },
            ui: {
              internal: {
                ...initialStateUIInternal,
                watchlist: initialStateUIWatchlist,
              },
            },
          });

          const nextProps = {
            securities: JSON.parse(JSON.stringify({ ...securities, current: testId1 })),
          };
          delete nextProps.securities.testId1.data;

          const expectedActions = [];

          requestSecurityData.mockReturnValue(() => null);

          const wrapper = shallowComponent(store);

          const instance = wrapper.instance();

          instance.componentWillReceiveProps(nextProps);

          const actions = store.getActions();

          expect(actions).toEqual(expectedActions);
          expect(wrapper).toMatchSnapshot();
          expect(requestSecurityData).toBeCalledWith({
            id: testId1,
            tickerCusip: testTickerCusip1,
          });
        });
      });
    });
  });
});
