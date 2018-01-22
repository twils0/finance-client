import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesAccount,
  statusNames,
} from '../../../Constants/dataConstantsAccount';
import requestLogout from '../../dataThunkAuth/requestLogout';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import requestUpdateAWSFields from '../requestUpdateAWSFields';

jest.mock('aws-amplify', () => ({
  Auth: {
    updateUserAttributes: jest.fn(),
  },
}));
jest.mock('../../dataThunkAuth/requestLogout', () => jest.fn());
jest.mock('../../dataThunkAWS/requestAWSUser', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const userObject = { user: { test: 'testUser' } };
const email = 'test1@test.com';
const name = 'testName';
const phone = 'testPhone';
const updatePayload = {
  email,
  emailAdditional: 'test2@test.com',
  name,
  phone,
};
const expectedUpdatePayload = {
  email,
  name,
  phone_number: phone,
};

describe('dataThunkAccount', () => {
  describe('requestUpdateAWSFields', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      Auth.updateUserAttributes.mockReset();
      requestLogout.mockReset();
    });

    it("fails and throws an error when missing 'name', 'email', and 'phone_number' keys in payload", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      Auth.updateUserAttributes.mockReturnValue(Promise.resolve());

      const emptyPayload = {};

      try {
        await store.dispatch(requestUpdateAWSFields(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.updateUserAttributes).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, account: initialStateAccount } });

      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      Auth.updateUserAttributes.mockReturnValue(Promise.resolve());

      await store.dispatch(requestUpdateAWSFields(updatePayload));

      expect(requestAWSUser).toBeCalled();
      expect(Auth.updateUserAttributes).toBeCalledWith(userObject.user, expectedUpdatePayload);
      expect(requestLogout).not.toBeCalled();
    });

    it('fails and returns promise reject when requestAWSUser throws an error', async () => {
      const store = mockStore({ data: { aws: initialStateAWS, account: initialStateAccount } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_AWS_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_AWS_FIELDS,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestUpdateAWSFields(updatePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(Auth.updateUserAttributes).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestLogout when Auth.updateUserAttributes throws 'NotAuthorizedException' error", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      const error = { code: 'NotAuthorizedException', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_AWS_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_AWS_FIELDS,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.updateUserAttributes.mockReturnValue(Promise.reject(error));
      requestLogout.mockReturnValue(() => null);

      try {
        await store.dispatch(requestUpdateAWSFields(updatePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(null);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.updateUserAttributes).toBeCalledWith(userObject.user, expectedUpdatePayload);
      expect(requestLogout).toBeCalled();
    });

    it('fails and returns promise reject when Auth.updateUserAttributes throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_AWS_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_AWS_FIELDS,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.updateUserAttributes.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestUpdateAWSFields(updatePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.updateUserAttributes).toBeCalledWith(userObject.user, expectedUpdatePayload);
      expect(requestLogout).not.toBeCalled();
    });

    it('creates the correct actions with the correct payloads', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      stateBeforeAWS.user = userObject.user;
      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_AWS_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.UPDATE_AWS_FIELDS,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.updateUserAttributes.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestUpdateAWSFields(updatePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.updateUserAttributes).toBeCalledWith(userObject.user, expectedUpdatePayload);
      expect(requestLogout).not.toBeCalled();
    });
  });
});
