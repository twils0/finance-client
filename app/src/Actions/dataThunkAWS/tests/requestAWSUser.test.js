import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAWS } from '../../../Constants/dataConstantsAWS';
import requestLogout from '../../dataThunkAuth/requestLogout';
import requestAWSUser from '../requestAWSUser';

jest.mock('aws-amplify', () => ({
  Auth: {
    currentUserPoolUser: jest.fn(),
  },
}));
jest.mock('../../dataThunkAuth/requestLogout', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const user = { test: 'testUser' };

describe('dataThunkAWS', () => {
  describe('requestAWSUser', () => {
    afterEach(() => {
      Auth.currentUserPoolUser.mockReset();
      requestLogout.mockReset();
    });

    it('calls requestLogout and returns promise reject when Auth.currentUserPoolUser throws an error', async () => {
      const store = mockStore({ data: { aws: initialStateAWS } });

      const error = { code: 'NotAuthorizedException', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.currentUserPoolUser.mockReturnValue(Promise.reject(error));
      requestLogout.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(requestAWSUser());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(Auth.currentUserPoolUser).toBeCalled();
      expect(requestLogout).toBeCalled();
    });

    it('fails and returns promise reject when Auth.currentUserPoolUser throws an error', async () => {
      const store = mockStore({ data: { aws: initialStateAWS } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.currentUserPoolUser.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestAWSUser());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(Auth.currentUserPoolUser).toBeCalled();
    });

    it('creates the correct actions with the correct payloads', async () => {
      const store = mockStore({ data: { aws: initialStateAWS } });

      const expectedActions = [
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_USER,
          payload: {
            user,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.currentUserPoolUser.mockReturnValue(Promise.resolve(user));

      const result = await store.dispatch(requestAWSUser());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual({ user });
      expect(Auth.currentUserPoolUser).toBeCalled();
    });
  });
});
