import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateWatchlist } from '../../../Reducers/dataReducersWatchlist';
import { requestStatusTypes, URLs, axiosConfig } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesWatchlist,
  statusNames,
} from '../../../Constants/dataConstantsWatchlist';
import requestLogout from '../../dataThunkAuth/requestLogout';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import loadSecurities from '../loadSecurities';

jest.mock('axios', () => ({
  get: jest.fn(),
}));
jest.mock('../../dataThunkAuth/requestLogout', () => jest.fn());
jest.mock('../../dataThunkAWS/requestAWSUser', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const userObject = {
  user: {
    signInUserSession: {
      idToken: { jwtToken: 'testIdToken' },
      accessToken: { jwtToken: 'testAccessToken' },
    },
  },
};
const idToken = userObject.user.signInUserSession.idToken.jwtToken;
const accessToken = userObject.user.signInUserSession.accessToken.jwtToken;
const securitiesResponse = {
  data: {
    body: {
      securities: {
        current: 'testId0',
        list: ['testId0', 'testId1', 'testId2'],
        testId0: {
          id: 'testId0',
          name: 'testName0',
          category: 'testCategory0',
          exchange: 'testExchange0',
          tickerCusip: 'testTickerCusip0',
        },
        testId1: {
          id: 'testId1',
          name: 'testName1',
          category: 'testCategory1',
          exchange: 'testExchange1',
          tickerCusip: 'testTickerCusip1',
        },
        testId2: {
          id: 'testId2',
          name: 'testName2',
          category: 'testCategory2',
          exchange: 'testExchange2',
          tickerCusip: 'testTickerCusip2',
        },
      },
    },
  },
};
const mockAxiosConfig = {
  headers: {
    Authorization: idToken,
  },
  params: {
    accessToken,
  },
  ...axiosConfig.DB,
};

describe('dataThunkWatchlist', () => {
  describe('loadSecurities', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      axios.get.mockReset();
      requestLogout.mockReset();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, watchlist: initialStateWatchlist } });

      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      axios.get.mockReturnValue(Promise.resolve(securitiesResponse));

      await store.dispatch(loadSecurities());

      expect(requestAWSUser).toBeCalled();
      expect(axios.get).toBeCalledWith(URLs.USERS, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('fails and returns promise reject when requestAWSUser throws an error', async () => {
      const store = mockStore({ data: { aws: initialStateAWS, watchlist: initialStateWatchlist } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.SECURITIES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.SECURITIES,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(loadSecurities());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).toBeCalled();
      expect(axios.get).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestLogout when axios throws 'NotAuthorizedException' error", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, watchlist: initialStateWatchlist } });

      const error = { code: 'NotAuthorizedException', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.SECURITIES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.SECURITIES,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.get.mockReturnValue(Promise.reject(error));
      requestLogout.mockReturnValue(() => null);

      try {
        await store.dispatch(loadSecurities());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(null);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.get).toBeCalledWith(URLs.USERS, mockAxiosConfig);
      expect(requestLogout).toBeCalled();
    });

    it('fails and returns promise reject when axios throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, watchlist: initialStateWatchlist } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.SECURITIES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.SECURITIES,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.get.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(loadSecurities());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.get).toBeCalledWith(URLs.USERS, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('does not call setSecuritiesAll action when securities list length is 0', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      stateBeforeAWS.user = userObject.user;
      const store = mockStore({ data: { aws: stateBeforeAWS, watchlist: initialStateWatchlist } });

      const emptySecuritiesResponse = {
        data: {
          body: {
            securities: {
              current: null,
              list: [],
            },
          },
        },
      };

      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.SECURITIES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.SECURITIES,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      axios.get.mockReturnValue(Promise.resolve(emptySecuritiesResponse));

      const result = await store.dispatch(loadSecurities());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.get).toBeCalledWith(URLs.USERS, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('creates the correct actions with the correct payloads', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      stateBeforeAWS.user = userObject.user;
      const store = mockStore({ data: { aws: stateBeforeAWS, watchlist: initialStateWatchlist } });

      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.SECURITIES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesWatchlist.SET_SECURITIES_ALL,
          payload: {
            securities: securitiesResponse.data.body.securities,
          },
        },
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.SECURITIES,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      axios.get.mockReturnValue(Promise.resolve(securitiesResponse));

      const result = await store.dispatch(loadSecurities());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.get).toBeCalledWith(URLs.USERS, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });
  });
});
