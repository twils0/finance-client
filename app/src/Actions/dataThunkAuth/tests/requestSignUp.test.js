import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIApp } from '../../../Reducers/uiReducersApp';
import { requestStatusTypes, URLs, axiosConfig } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import requestSignUp from '../requestSignUp';

jest.mock('axios', () => ({
  post: jest.fn(),
}));

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const tokenId = 'testTokenId';
const plan = 'basic_plan';
const postPayload = {
  promoCode: 'testPromo',
  email: 'testEmail',
  password: 'testPassword1!',
  phone: '+12395550000',
  name: 'testName',
  token: tokenId,
  plan,
};
const signUpPayload = {
  ...postPayload,
  element: { test: 'testElement' },
  nameOnCard: 'testNameOnCard',
};

describe('dataThunkAuth', () => {
  describe('requestSignUp', () => {
    afterEach(() => {
      axios.post.mockReset();
    });

    it("fails and throws an error when missing 'element' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const emptyPayload = {};

      try {
        await store.dispatch(requestSignUp(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(axios.post).not.toBeCalled();
    });

    it("fails when provided a payload with an 'element' key that is not an object", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      axios.post.mockReturnValue(Promise.resolve());

      const wrongPayload = { element: 'testElement' };

      try {
        await store.dispatch(requestSignUp(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(axios.post).not.toBeCalled();
    });

    it("fails and throws an error when missing 'nameOnCard' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const wrongPayload = { element: { test: 'testElement' } };

      try {
        await store.dispatch(requestSignUp(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(axios.post).not.toBeCalled();
    });

    it("fails and throws an error when missing 'promoCode' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const wrongPayload = { element: { test: 'testElement' }, nameOnCard: 'testNameOnCard' };

      try {
        await store.dispatch(requestSignUp(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(axios.post).not.toBeCalled();
    });

    it("fails and throws an error when missing 'email' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const wrongPayload = {
        element: { test: 'testElement' },
        nameOnCard: 'testNameOnCard',
        promoCode: 'testPromoCode',
      };

      try {
        await store.dispatch(requestSignUp(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(axios.post).not.toBeCalled();
    });

    it("fails and throws an error when missing 'password' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      axios.post.mockReturnValue(Promise.resolve());

      const wrongPayload = {
        element: { test: 'testElement' },
        nameOnCard: 'testNameOnCard',
        promoCode: 'testPromoCode',
        email: 'testEmail',
      };

      try {
        await store.dispatch(requestSignUp(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(axios.post).not.toBeCalled();
    });

    it("fails and throws an error when missing 'phone' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      axios.post.mockReturnValue(Promise.resolve());

      const wrongPayload = {
        element: { test: 'testElement' },
        nameOnCard: 'testNameOnCard',
        promoCode: 'testPromoCode',
        email: 'testEmail',
        password: 'testPassword1!',
      };

      try {
        await store.dispatch(requestSignUp(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(axios.post).not.toBeCalled();
    });

    it("fails and throws an error when missing 'name' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      axios.post.mockReturnValue(Promise.resolve());

      const wrongPayload = {
        element: { test: 'testElement' },
        nameOnCard: 'testNameOnCard',
        promoCode: 'testPromoCode',
        email: 'testEmail',
        password: 'testPassword1!',
        phone: '+12395550000',
      };

      try {
        await store.dispatch(requestSignUp(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(axios.post).not.toBeCalled();
    });

    it('fails and returns promise reject when stripe.createToken throws an error', async () => {
      const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
      const tokenResult = {
        token: { id: tokenId },
        error: { code: 'testCode', message: 'testMessage' },
      };
      const createToken = jest.fn();
      createToken.mockReturnValue(Promise.resolve(tokenResult));
      stateBeforeUIApp.stripe.stripeObject = { createToken };

      const store = mockStore({ data: { auth: initialStateAuth }, ui: { app: stateBeforeUIApp } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_UP,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_UP,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      try {
        await store.dispatch(requestSignUp(signUpPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(tokenResult.error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(axios.post).not.toBeCalled();
    });

    it('fails and returns promise reject when axios.post throws an error', async () => {
      const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
      const tokenResult = { token: { id: tokenId } };
      const createToken = jest.fn();
      createToken.mockReturnValue(Promise.resolve(tokenResult));
      stateBeforeUIApp.stripe.stripeObject = { createToken };

      const store = mockStore({ data: { auth: initialStateAuth }, ui: { app: stateBeforeUIApp } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_UP,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_UP,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.post.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestSignUp(signUpPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(axios.post).toBeCalledWith(URLs.CUSTOMERS, postPayload, axiosConfig.STRIPE);
    });

    it('creates the correct actions with the correct payloads', async () => {
      const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
      const tokenResult = { token: { id: tokenId } };
      const createToken = jest.fn();
      createToken.mockReturnValue(Promise.resolve(tokenResult));
      stateBeforeUIApp.stripe.stripeObject = { createToken };

      const store = mockStore({ data: { auth: initialStateAuth }, ui: { app: stateBeforeUIApp } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_UP,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_UP,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      axios.post.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestSignUp(signUpPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(axios.post).toBeCalledWith(URLs.CUSTOMERS, postPayload, axiosConfig.STRIPE);
    });
  });
});
