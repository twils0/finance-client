import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { requestStatusTypes, URLs, axiosConfig } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesAccount,
  statusNames,
} from '../../../Constants/dataConstantsAccount';
import requestLogout from '../../dataThunkAuth/requestLogout';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import requestUpdateDBFields from '../requestUpdateDBFields';

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
const mockAxiosConfig = {
  headers: {
    Authorization: idToken,
  },
  params: {
    accessToken,
  },
  ...axiosConfig.DB,
};

const email = 'test1@test.com';
const emailAdditional = 'test2@test.com';

describe('dataThunkAccount', () => {
  describe('requestUpdateDBFields', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      axios.put.mockReset();
      requestLogout.mockReset();
    });

    it("fails and throws an error when missing 'email' and 'emailAdditional' key in payload", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, account: initialStateAccount } });

      const emptyPayload = {};

      try {
        await store.dispatch(requestUpdateDBFields(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(axios.put).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestAWSUser when missing 'user' object in state, with email", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, account: initialStateAccount } });

      const payload = {
        email,
      };

      axios.put.mockReturnValue(Promise.resolve());
      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));

      await store.dispatch(requestUpdateDBFields(payload));

      expect(requestAWSUser).toBeCalled();
      expect(axios.put).toBeCalledWith(URLs.USERS, payload, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('fails and returns promise reject when requestAWSUser throws an error, with email', async () => {
      const store = mockStore({ data: { aws: initialStateAWS, account: initialStateAccount } });

      const error = { code: 'testError', message: 'testMessage' };
      const payload = {
        email,
      };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_DB_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_DB_FIELDS,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestUpdateDBFields(payload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).toBeCalled();
      expect(axios.put).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestLogout when axios throws 'NotAuthorizedException' error, with blank emailAdditional", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      const error = { code: 'NotAuthorizedException', message: 'testMessage' };
      const payload = {
        emailAdditional: null,
      };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_DB_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_DB_FIELDS,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.reject(error));
      requestLogout.mockReturnValue(() => null);

      try {
        await store.dispatch(requestUpdateDBFields(payload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(null);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(axios.put).toBeCalledWith(URLs.USERS, payload, mockAxiosConfig);
      expect(requestLogout).toBeCalled();
    });

    it('fails and returns promise reject when axios throws an error, with email and emailAdditional', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      const error = { code: 'testError', message: 'testMessage' };
      const payload = {
        email,
        emailAdditional,
      };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_DB_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_DB_FIELDS,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestUpdateDBFields(payload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.put).toBeCalledWith(URLs.USERS, payload, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });

    it('creates the correct actions with the correct payloads, with email and emailAdditional', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      stateBeforeAWS.user = userObject.user;
      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      const payload = {
        email,
        emailAdditional,
      };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_DB_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_DB_FIELDS,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestUpdateDBFields(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.put).toBeCalledWith(URLs.USERS, payload, mockAxiosConfig);
      expect(requestLogout).not.toBeCalled();
    });
  });
});
