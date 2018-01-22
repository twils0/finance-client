import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { initialState as initialStateUIApp } from '../../../Reducers/uiReducersApp';
import { requestStatusTypes, URLs, axiosConfig } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesAccount,
  statusNames,
} from '../../../Constants/dataConstantsAccount';
import requestLogout from '../../dataThunkAuth/requestLogout';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import requestUpdateStripeFields from '../requestUpdateStripeFields';

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
const element = { test: 'testElement' };
const name = 'testName';
const stripePayloadNoCard = {
  email: 'testEmail',
  promoCode: 'testPromo',
};
const stripePayload = {
  element,
  name,
  ...stripePayloadNoCard,
};
const tokenId = 'testTokenId';
const plan = 'Basic_450';
const putPayloadNoCard = {
  token: null,
  ...stripePayloadNoCard,
  plan,
};
const putPayload = {
  token: tokenId,
  ...stripePayloadNoCard,
  plan,
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
  describe('requestUpdateStripeFields', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      axios.put.mockReset();
      requestLogout.mockReset();
    });

    it("fails and throws an error when missing 'element', 'name', 'email', and/or 'promoCode' keys in payload", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
      const tokenResult = { token: { id: tokenId } };
      const createToken = jest.fn();
      stateBeforeAWS.user = userObject.user;
      createToken.mockReturnValue(Promise.resolve(tokenResult));
      stateBeforeUIApp.stripe.stripeObject = { createToken };

      const store = mockStore({
        data: { aws: stateBeforeAWS, account: initialStateAccount },
        ui: { app: stateBeforeUIApp },
      });

      axios.put.mockReturnValue(Promise.resolve());

      const emptyPayload = {};

      try {
        await store.dispatch(requestUpdateStripeFields(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(axios.put).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
      const tokenResult = { token: { id: tokenId } };
      const createToken = jest.fn();
      createToken.mockReturnValue(Promise.resolve(tokenResult));
      stateBeforeUIApp.stripe.stripeObject = { createToken };

      const store = mockStore({
        data: { aws: initialStateAWS, account: initialStateAccount },
        ui: { app: stateBeforeUIApp },
      });

      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      axios.put.mockReturnValue(Promise.resolve());

      await store.dispatch(requestUpdateStripeFields(stripePayload));

      expect(requestAWSUser).toBeCalled();
      expect(stateBeforeUIApp.stripe.stripeObject.createToken).toBeCalledWith(element, { name });
      expect(axios.put).toBeCalledWith(URLs.CUSTOMERS, putPayload, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('fails and returns promise reject when requestAWSUser throws an error', async () => {
      const store = mockStore({
        data: { aws: initialStateAWS, account: initialStateAccount },
        ui: { app: initialStateUIApp },
      });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestUpdateStripeFields(stripePayload));
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
      const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
      const tokenResult = { token: { id: tokenId } };
      const createToken = jest.fn();
      stateBeforeAWS.user = userObject.user;
      createToken.mockReturnValue(Promise.resolve(tokenResult));
      stateBeforeUIApp.stripe.stripeObject = { createToken };

      const store = mockStore({
        data: { aws: stateBeforeAWS, account: initialStateAccount },
        ui: { app: stateBeforeUIApp },
      });

      const error = { code: 'NotAuthorizedException', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
            status: requestStatusTypes.SUCCESS,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_REQUEST,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_REQUEST,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.reject(error));
      requestLogout.mockReturnValue(() => null);

      try {
        await store.dispatch(requestUpdateStripeFields(stripePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(null);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.put).toBeCalledWith(URLs.CUSTOMERS, putPayload, mockAxiosConfig);
      expect(requestLogout).toBeCalled();
    });

    it('fails and returns promise reject when stripe.createToken throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
      const tokenResult = {
        token: { id: tokenId },
        error: { code: 'testCode', message: 'testMessage' },
      };
      const createToken = jest.fn();
      stateBeforeAWS.user = userObject.user;
      createToken.mockReturnValue(Promise.resolve(tokenResult));
      stateBeforeUIApp.stripe.stripeObject = { createToken };

      const store = mockStore({
        data: { aws: stateBeforeAWS, account: initialStateAccount },
        ui: { app: stateBeforeUIApp },
      });

      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.resolve());

      try {
        await store.dispatch(requestUpdateStripeFields(stripePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(tokenResult.error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(stateBeforeUIApp.stripe.stripeObject.createToken).toBeCalledWith(element, { name });
      expect(axios.put).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it('fails and returns promise reject when axios throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
      const tokenResult = { token: { id: tokenId } };
      const createToken = jest.fn();
      stateBeforeAWS.user = userObject.user;
      createToken.mockReturnValue(Promise.resolve(tokenResult));
      stateBeforeUIApp.stripe.stripeObject = { createToken };

      const store = mockStore({
        data: { aws: stateBeforeAWS, account: initialStateAccount },
        ui: { app: stateBeforeUIApp },
      });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
            status: requestStatusTypes.SUCCESS,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_REQUEST,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_REQUEST,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestUpdateStripeFields(stripePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(createToken).toBeCalledWith(element, { name });
      expect(axios.put).toBeCalledWith(URLs.CUSTOMERS, putPayload, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('skips stripe.createToken when element and name key missing from payload', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
      const tokenResult = { token: { id: tokenId } };
      const createToken = jest.fn();
      stateBeforeAWS.user = userObject.user;
      createToken.mockReturnValue(Promise.resolve(tokenResult));
      stateBeforeUIApp.stripe.stripeObject = { createToken };

      const store = mockStore({
        data: { aws: stateBeforeAWS, account: initialStateAccount },
        ui: { app: stateBeforeUIApp },
      });

      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
            status: requestStatusTypes.SUCCESS,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_REQUEST,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_REQUEST,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestUpdateStripeFields(stripePayloadNoCard));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(createToken).not.toBeCalled();
      expect(axios.put).toBeCalledWith(URLs.CUSTOMERS, putPayloadNoCard, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('creates the correct actions with the correct payloads', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
      const tokenResult = { token: { id: tokenId } };
      const createToken = jest.fn();
      stateBeforeAWS.user = userObject.user;
      createToken.mockReturnValue(Promise.resolve(tokenResult));
      stateBeforeUIApp.stripe.stripeObject = { createToken };

      const store = mockStore({
        data: { aws: stateBeforeAWS, account: initialStateAccount },
        ui: { app: stateBeforeUIApp },
      });

      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_TOKEN,
            status: requestStatusTypes.SUCCESS,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_REQUEST,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_STRIPE_FIELDS_REQUEST,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestUpdateStripeFields(stripePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(createToken).toBeCalledWith(element, { name });
      expect(axios.put).toBeCalledWith(URLs.CUSTOMERS, putPayload, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });
  });
});
