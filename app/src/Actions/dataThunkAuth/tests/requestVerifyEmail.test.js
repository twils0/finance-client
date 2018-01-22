import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { requestStatusTypes, URLs, axiosConfig } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import requestLogout from '../../dataThunkAuth/requestLogout';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import requestVerifyEmail from '../requestVerifyEmail';

jest.mock('axios', () => ({
  post: jest.fn(),
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
  ...axiosConfig.DB,
};

describe('dataThunkAuth', () => {
  describe('requestVerifyEmail', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      axios.post.mockReset();
      requestLogout.mockReset();
    });

    it("fails and throws an error when missing 'match' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const emptyPayload = {};

      try {
        await store.dispatch(requestVerifyEmail(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(axios.post).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const store = mockStore({ data: { auth: initialStateAuth, aws: initialStateAWS } });

      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      axios.post.mockReturnValue(Promise.resolve(stripeResponse));

      await store.dispatch(requestVerifyEmail());

      expect(requestAWSUser).toBeCalled();
      expect(axios.post).toBeCalledWith(URLs.EMAILS, {}, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('fails and returns promise reject when requestAWSUser throws an error', async () => {
      const store = mockStore({ data: { auth: initialStateAuth, aws: initialStateAWS } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_EMAIL,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_EMAIL,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestVerifyEmail());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).toBeCalled();
      expect(axios.post).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestLogout when axios throws 'NotAuthorizedException' error", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { auth: initialStateAuth, aws: stateBeforeAWS } });

      const error = { code: 'NotAuthorizedException', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_EMAIL,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_EMAIL,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.post.mockReturnValue(Promise.reject(error));
      requestLogout.mockReturnValue(() => null);

      try {
        await store.dispatch(requestVerifyEmail());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(null);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.post).toBeCalledWith(URLs.EMAILS, {}, mockAxiosConfig);
      expect(requestLogout).toBeCalled();
    });

    it('fails and returns promise reject when axios throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { auth: initialStateAuth, aws: stateBeforeAWS } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_EMAIL,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_EMAIL,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.post.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestVerifyEmail());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.post).toBeCalledWith(URLs.EMAILS, {}, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('creates the correct actions with the correct payloads', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      stateBeforeAWS.user = userObject.user;
      const store = mockStore({ data: { auth: initialStateAuth, aws: stateBeforeAWS } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_EMAIL,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_EMAIL,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      axios.post.mockReturnValue(Promise.resolve(null));

      const result = await store.dispatch(requestVerifyEmail());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.post).toBeCalledWith(URLs.EMAILS, {}, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });
  });
});
