import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import requestLogout from '../../dataThunkAuth/requestLogout';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import requestVerifyField from '../requestVerifyField';

jest.mock('aws-amplify', () => ({
  Auth: {
    verifyUserAttribute: jest.fn(),
  },
}));
jest.mock('../../dataThunkAuth/requestLogout', () => jest.fn());
jest.mock('../../dataThunkAWS/requestAWSUser', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const userObject = { user: { test: 'testUser' } };
const verifyPhonePayload = {
  field: 'phone_number',
};

describe('dataThunkAuth', () => {
  describe('requestVerifyField', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      Auth.verifyUserAttribute.mockReset();
      requestLogout.mockReset();
    });

    it("fails and throws an error when missing 'field' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      Auth.verifyUserAttribute.mockReturnValue(Promise.resolve());

      const emptyPayload = {};

      try {
        await store.dispatch(requestVerifyField(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttribute).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("fails and throws an error when the 'field' key does not have an 'phone_number' or 'phone_number' value", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, auth: initialStateAuth } });

      Auth.verifyUserAttribute.mockReturnValue(Promise.resolve());

      const wrongPayload = { test: 'testTest' };

      try {
        await store.dispatch(requestVerifyField(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttribute).not.toBeCalled();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, auth: initialStateAuth } });

      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      Auth.verifyUserAttribute.mockReturnValue(Promise.resolve());

      await store.dispatch(requestVerifyField(verifyPhonePayload));

      expect(requestAWSUser).toBeCalled();
      expect(Auth.verifyUserAttribute).toBeCalledWith(userObject.user, verifyPhonePayload.field);
      expect(requestLogout).not.toBeCalled();
    });

    it('fails and returns promise reject when requestAWSUser throws an error', async () => {
      const store = mockStore({ data: { aws: initialStateAWS, auth: initialStateAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedError = {
        error: { code: 'testError', message: 'testMessage' },
        field: 'phone_number',
      };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestVerifyField(verifyPhonePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(expectedError);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).toBeCalled();
      expect(Auth.verifyUserAttribute).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestLogout when Auth.verifyUserAttribute throws 'NotAuthorizedException' error", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const error = { code: 'NotAuthorizedException', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.verifyUserAttribute.mockReturnValue(Promise.reject(error));
      requestLogout.mockReturnValue(() => null);

      try {
        await store.dispatch(requestVerifyField(verifyPhonePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(null);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttribute).toBeCalledWith(userObject.user, verifyPhonePayload.field);
      expect(requestLogout).toBeCalled();
    });

    it('fails and returns promise reject when Auth.verifyUserAttribute throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedError = {
        error: { code: 'testError', message: 'testMessage' },
        field: 'phone_number',
      };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.verifyUserAttribute.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestVerifyField(verifyPhonePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(expectedError);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttribute).toBeCalledWith(userObject.user, verifyPhonePayload.field);
      expect(requestLogout).not.toBeCalled();
    });

    it("creates the correct actions with the correct payloads for 'phone_number' value", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      stateBeforeAWS.user = userObject.user;
      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.verifyUserAttribute.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestVerifyField(verifyPhonePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttribute).toBeCalledWith(userObject.user, verifyPhonePayload.field);
      expect(requestLogout).not.toBeCalled();
    });

    it("creates the correct actions with the correct payloads for 'phone_number' value", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      stateBeforeAWS.user = userObject.user;
      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.verifyUserAttribute.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestVerifyField(verifyPhonePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttribute).toBeCalledWith(userObject.user, verifyPhonePayload.field);
      expect(requestLogout).not.toBeCalled();
    });
  });
});
