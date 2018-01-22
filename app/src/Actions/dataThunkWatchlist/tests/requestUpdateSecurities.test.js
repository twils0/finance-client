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
import requestUpdateSecurities from '../requestUpdateSecurities';

jest.mock('axios', () => ({
  put: jest.fn(),
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
const securities = {
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
};
const updatePayload = {
  current: securities.current,
  list: securities.list,
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
  describe('requestUpdateSecurities', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      axios.put.mockReset();
      requestLogout.mockReset();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
      stateBeforeWatchlist.securities = securities;
      const store = mockStore({ data: { aws: initialStateAWS, watchlist: stateBeforeWatchlist } });

      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      axios.put.mockReturnValue(Promise.resolve());

      await store.dispatch(requestUpdateSecurities());

      expect(requestAWSUser).toBeCalled();
      expect(axios.put).toBeCalledWith(URLs.USERS, updatePayload, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('fails and returns promise reject when requestAWSUser throws an error', async () => {
      const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
      stateBeforeWatchlist.securities = securities;
      const store = mockStore({ data: { aws: initialStateAWS, watchlist: stateBeforeWatchlist } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.UPDATE_SECURITIES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.UPDATE_SECURITIES,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestUpdateSecurities());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).toBeCalled();
      expect(axios.put).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestLogout when axios throws 'NotAuthorizedException' error", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
      stateBeforeAWS.user = userObject.user;
      stateBeforeWatchlist.securities = securities;

      const store = mockStore({ data: { aws: stateBeforeAWS, watchlist: stateBeforeWatchlist } });

      const error = { code: 'NotAuthorizedException', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.UPDATE_SECURITIES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.UPDATE_SECURITIES,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.reject(error));
      requestLogout.mockReturnValue(() => null);

      try {
        await store.dispatch(requestUpdateSecurities());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(null);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.put).toBeCalledWith(URLs.USERS, updatePayload, mockAxiosConfig);
      expect(requestLogout).toBeCalled();
    });

    it('fails and returns promise reject when axios throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
      stateBeforeAWS.user = userObject.user;
      stateBeforeWatchlist.securities = securities;
      const store = mockStore({ data: { aws: stateBeforeAWS, watchlist: stateBeforeWatchlist } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.UPDATE_SECURITIES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.UPDATE_SECURITIES,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestUpdateSecurities());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.put).toBeCalledWith(URLs.USERS, updatePayload, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('does not call setSecuritiesAll action when securities list length is 0', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
      stateBeforeAWS.user = userObject.user;
      stateBeforeWatchlist.securities = securities;

      const store = mockStore({ data: { aws: stateBeforeAWS, watchlist: stateBeforeWatchlist } });

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
            id: statusNames.UPDATE_SECURITIES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.UPDATE_SECURITIES,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.resolve(emptySecuritiesResponse));

      const result = await store.dispatch(requestUpdateSecurities());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.put).toBeCalledWith(URLs.USERS, updatePayload, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('creates the correct actions with the correct payloads', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
      stateBeforeAWS.user = userObject.user;
      stateBeforeWatchlist.securities = securities;

      const store = mockStore({ data: { aws: stateBeforeAWS, watchlist: stateBeforeWatchlist } });

      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.UPDATE_SECURITIES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.UPDATE_SECURITIES,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestUpdateSecurities());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.put).toBeCalledWith(URLs.USERS, updatePayload, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });
  });
});
