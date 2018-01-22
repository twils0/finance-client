import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { requestStatusTypes, URLs, axiosConfig } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesAccount,
  statusNames,
  fieldNames,
} from '../../../Constants/dataConstantsAccount';
import requestLogout from '../../dataThunkAuth/requestLogout';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import loadStripeFields from '../loadStripeFields';

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
const stripeResponse = {
  data: {
    body: {
      nameOnCard: 'testName',
      promoCode: 'testPromo',
      promoCodeValid: true,
    },
  },
};
const idToken = userObject.user.signInUserSession.idToken.jwtToken;
const accessToken = userObject.user.signInUserSession.accessToken.jwtToken;
const mockAxiosConfig = {
  headers: {
    Authorization: idToken,
  },
  params: {
    accessToken,
  },
  ...axiosConfig.STRIPE,
};

describe('dataThunkAccount', () => {
  describe('loadStripeFields', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      axios.get.mockReset();
      requestLogout.mockReset();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, account: initialStateAccount } });

      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      axios.get.mockReturnValue(Promise.resolve(stripeResponse));

      await store.dispatch(loadStripeFields());

      expect(requestAWSUser).toBeCalled();
      expect(axios.get).toBeCalledWith(URLs.CUSTOMERS, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('fails and returns promise reject when requestAWSUser throws an error', async () => {
      const store = mockStore({ data: { aws: initialStateAWS, account: initialStateAccount } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.STRIPE_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.STRIPE_FIELDS,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(loadStripeFields());
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

      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      const error = { code: 'NotAuthorizedException', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.STRIPE_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.STRIPE_FIELDS,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.get.mockReturnValue(Promise.reject(error));
      requestLogout.mockReturnValue(() => null);

      try {
        await store.dispatch(loadStripeFields());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(null);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.get).toBeCalledWith(URLs.CUSTOMERS, mockAxiosConfig);
      expect(requestLogout).toBeCalled();
    });

    it('fails and returns promise reject when axios throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.STRIPE_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.STRIPE_FIELDS,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.get.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(loadStripeFields());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.get).toBeCalledWith(URLs.CUSTOMERS, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('creates the correct actions with the correct payloads', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      stateBeforeAWS.user = userObject.user;
      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      const stripePayload = {};

      stripePayload[fieldNames.NAME_ON_CARD] = {
        id: fieldNames.NAME_ON_CARD,
        value: stripeResponse.data.body.nameOnCard,
      };
      stripePayload[fieldNames.PROMO_CODE] = {
        id: fieldNames.PROMO_CODE,
        value: stripeResponse.data.body.promoCode,
      };
      stripePayload[fieldNames.PROMO_CODE_VALID] = {
        id: fieldNames.PROMO_CODE_VALID,
        value: stripeResponse.data.body.promoCodeValid,
      };

      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.STRIPE_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_FIELDS,
          payload: stripePayload,
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.STRIPE_FIELDS,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      axios.get.mockReturnValue(Promise.resolve(stripeResponse));

      const result = await store.dispatch(loadStripeFields());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.get).toBeCalledWith(URLs.CUSTOMERS, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });
  });
});
