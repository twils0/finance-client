import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesAuth,
  statusNames,
  codeTypeNames,
} from '../../../Constants/dataConstantsAuth';
import requestLogout from '../../dataThunkAuth/requestLogout';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import requestVerifyFieldConfirm from '../requestVerifyFieldConfirm';

jest.mock('aws-amplify', () => ({
  Auth: {
    verifyUserAttributeSubmit: jest.fn(),
  },
}));
jest.mock('../../dataThunkAuth/requestLogout', () => jest.fn());
jest.mock('../../dataThunkAWS/requestAWSUser', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const userObject = { user: { test: 'testUser' } };
const verifyPhonePayload = {
  field: 'phone_number',
  code: '123456',
};

describe('dataThunkAuth', () => {
  describe('requestVerifyFieldConfirm', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      Auth.verifyUserAttributeSubmit.mockReset();
      requestLogout.mockReset();
    });

    it("fails and throws an error when missing 'field' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      Auth.verifyUserAttributeSubmit.mockReturnValue(Promise.resolve());

      const emptyPayload = {};

      try {
        await store.dispatch(requestVerifyFieldConfirm(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttributeSubmit).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("fails and throws an error when the 'field' key does not have a phone_number' value", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, auth: initialStateAuth } });

      Auth.verifyUserAttributeSubmit.mockReturnValue(Promise.resolve());

      const wrongPayload = { test: 'testTest' };

      try {
        await store.dispatch(requestVerifyFieldConfirm(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttributeSubmit).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("fails and throws an error when missing the 'code' key in payload", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, auth: initialStateAuth } });

      Auth.verifyUserAttributeSubmit.mockReturnValue(Promise.resolve());

      const wrongPayload = { field: 'phone_number' };

      try {
        await store.dispatch(requestVerifyFieldConfirm(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttributeSubmit).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, auth: initialStateAuth } });

      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      Auth.verifyUserAttributeSubmit.mockReturnValue(Promise.resolve());

      await store.dispatch(requestVerifyFieldConfirm(verifyPhonePayload));

      expect(requestAWSUser).toBeCalled();
      expect(Auth.verifyUserAttributeSubmit).toBeCalledWith(
        userObject.user,
        verifyPhonePayload.field,
        verifyPhonePayload.code,
      );
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
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestVerifyFieldConfirm(verifyPhonePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(expectedError);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).toBeCalled();
      expect(Auth.verifyUserAttributeSubmit).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestLogout when Auth.verifyUserAttributeSubmit throws 'NotAuthorizedException' error", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const error = { code: 'NotAuthorizedException', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.verifyUserAttributeSubmit.mockReturnValue(Promise.reject(error));
      requestLogout.mockReturnValue(() => null);

      try {
        await store.dispatch(requestVerifyFieldConfirm(verifyPhonePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(null);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttributeSubmit).toBeCalledWith(
        userObject.user,
        verifyPhonePayload.field,
        verifyPhonePayload.code,
      );
      expect(requestLogout).toBeCalled();
    });

    it('fails and returns promise reject when Auth.verifyUserAttributeSubmit throws an error', async () => {
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
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.verifyUserAttributeSubmit.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestVerifyFieldConfirm(verifyPhonePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(expectedError);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttributeSubmit).toBeCalledWith(
        userObject.user,
        verifyPhonePayload.field,
        verifyPhonePayload.code,
      );
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
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_PHONE,
            needed: false,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.verifyUserAttributeSubmit.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestVerifyFieldConfirm(verifyPhonePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttributeSubmit).toBeCalledWith(
        userObject.user,
        verifyPhonePayload.field,
        verifyPhonePayload.code,
      );
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
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_PHONE,
            needed: false,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.verifyUserAttributeSubmit.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestVerifyFieldConfirm(verifyPhonePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.verifyUserAttributeSubmit).toBeCalledWith(
        userObject.user,
        verifyPhonePayload.field,
        verifyPhonePayload.code,
      );
      expect(requestLogout).not.toBeCalled();
    });
  });
});
