import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

import { initialState as initialStateWatchlist } from '../../../Reducers/dataReducersWatchlist';
import { requestStatusTypes, URLs, axiosConfig } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesWatchlist,
  statusNames,
} from '../../../Constants/dataConstantsWatchlist';
import requestSecurityData from '../requestSecurityData';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const id = 'testId';
const tickerCusip = 'testTickerCusip';
const description = 'testDescription';
const amount = 123.45;
const formattedAmount = '$123.45';
const date = '1/31/2018';
const time = '7:00 AM';
const dataPayload = {
  id,
  tickerCusip,
};
const companyResponse = {
  data: {
    description,
  },
};
const quoteResponse = {
  data: {
    latestPrice: amount,
    latestUpdate: 1517400000000,
  },
};
const expectedData = {
  description,
  price: {
    amount: formattedAmount,
    date,
    time,
  },
};

const companyMockAxiosConfig = {
  params: {
    filter: 'description',
  },
  ...axiosConfig.IEX,
};
const quoteMockAxiosConfig = {
  params: {
    filter: 'latestPrice,latestUpdate',
  },
  ...axiosConfig.IEX,
};

describe('dataThunkWatchlist', () => {
  describe('requestSecurityData', () => {
    afterEach(() => {
      axios.get.mockReset();
    });

    it("fails and throws an error when missing 'id' key in payload", async () => {
      const store = mockStore({ data: { watchlist: initialStateWatchlist } });

      const emptyPayload = {};

      try {
        await store.dispatch(requestSecurityData(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(axios.get).not.toBeCalled();
    });

    it("fails and throws an error when missing 'tickerCusip' key in payload", async () => {
      const store = mockStore({ data: { watchlist: initialStateWatchlist } });

      const wrongPayload = { id };

      try {
        await store.dispatch(requestSecurityData(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(axios.get).not.toBeCalled();
    });

    it('fails and returns promise reject when axios throws an unexpected error', async () => {
      const store = mockStore({ data: { watchlist: initialStateWatchlist } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.GET_SECURITY_DATA,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.GET_SECURITY_DATA,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.get.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestSecurityData(dataPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(axios.get).toBeCalledWith(URLs.IEX_COMPANY(tickerCusip), companyMockAxiosConfig);
      expect(axios.get).toBeCalledWith(URLs.IEX_QUOTE(tickerCusip), quoteMockAxiosConfig);
    });

    it('creates the correct actions with the correct payloads', async () => {
      const store = mockStore({ data: { watchlist: initialStateWatchlist } });

      const expectedActions = [
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.GET_SECURITY_DATA,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesWatchlist.SET_SECURITY_DATA,
          payload: {
            id,
            data: expectedData,
          },
        },
        {
          type: actionTypesWatchlist.SET_WATCHLIST_STATUS,
          payload: {
            id: statusNames.GET_SECURITY_DATA,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      axios.get.mockReturnValueOnce(Promise.resolve(companyResponse));
      axios.get.mockReturnValueOnce(Promise.resolve(quoteResponse));

      const result = await store.dispatch(requestSecurityData(dataPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(axios.get).toBeCalledWith(URLs.IEX_COMPANY(tickerCusip), companyMockAxiosConfig);
      expect(axios.get).toBeCalledWith(URLs.IEX_QUOTE(tickerCusip), quoteMockAxiosConfig);
    });
  });
});
