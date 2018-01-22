import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import { actionTypes as actionTypesAWS } from '../../../Constants/dataConstantsAWS';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import requestSignOutOtherDevices from '../requestSignOutOtherDevices';

jest.mock('aws-amplify', () => ({
  Auth: {
    signIn: jest.fn(),
  },
}));
jest.mock('../../dataThunkAWS/requestAWSUser', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const userObject = { user: { test: 'testUser' } };
const signOutPayload = { email: 'testEmail', password: 'testPassword1!', remembered: true };

describe('dataThunkAuth', () => {
  describe('requestSignOutOtherDevices', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      if (userObject.user.setDeviceStatusRemembered) {
        delete userObject.user.setDeviceStatusRemembered;
      }
      if (userObject.user.globalSignOut) {
        delete userObject.user.globalSignOut;
      }
      Auth.signIn.mockReset();
      if (userObject.user.setDeviceStatusNotRemembered) {
        delete userObject.user.setDeviceStatusNotRemembered;
      }
    });

    it("fails and throws an error when missing 'email' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const emptyPayload = {};

      try {
        await store.dispatch(requestSignOutOtherDevices(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.signIn).not.toBeCalled();
    });

    it("fails and throws an error when missing 'password' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const wrongPayload = { email: 'testEmail' };

      try {
        await store.dispatch(requestSignOutOtherDevices(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.signIn).not.toBeCalled();
    });

    it("fails and throws an error when missing 'remembered' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const wrongPayload = { email: 'testEmail', password: 'testPassword1!' };

      try {
        await store.dispatch(requestSignOutOtherDevices(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.signIn).not.toBeCalled();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, auth: initialStateAuth } });

      userObject.user.setDeviceStatusRemembered = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.globalSignOut = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.setDeviceStatusNotRemembered = jest.fn(({ onSuccess }) => onSuccess());

      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      Auth.signIn.mockReturnValue(Promise.resolve(userObject.user));

      await store.dispatch(requestSignOutOtherDevices(signOutPayload));

      expect(requestAWSUser).toBeCalled();
      expect(userObject.user.setDeviceStatusRemembered).toBeCalled();
      expect(userObject.user.globalSignOut).toBeCalled();
      expect(Auth.signIn).toBeCalledWith(signOutPayload.email, signOutPayload.password);
      expect(userObject.user.setDeviceStatusNotRemembered).not.toBeCalled();
    });

    it('fails and returns promise reject when requestAWSUser throws an error', async () => {
      userObject.user.setDeviceStatusRemembered = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.globalSignOut = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.setDeviceStatusNotRemembered = jest.fn(({ onSuccess }) => onSuccess());

      const store = mockStore({ data: { aws: initialStateAWS, auth: initialStateAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestSignOutOtherDevices(signOutPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).toBeCalled();
      expect(userObject.user.setDeviceStatusRemembered).not.toBeCalled();
      expect(userObject.user.globalSignOut).not.toBeCalled();
      expect(Auth.signIn).not.toBeCalled();
      expect(userObject.user.setDeviceStatusNotRemembered).not.toBeCalled();
    });

    it('fails and returns promise reject when user.setDeviceStatusRemembered throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      const error = { code: 'testError', message: 'testMessage' };

      userObject.user.setDeviceStatusRemembered = jest.fn(({ onFailure }) => onFailure(error));
      userObject.user.globalSignOut = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.setDeviceStatusNotRemembered = jest.fn(({ onSuccess }) => onSuccess());
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      try {
        await store.dispatch(requestSignOutOtherDevices(signOutPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(userObject.user.setDeviceStatusRemembered).toBeCalled();
      expect(userObject.user.globalSignOut).not.toBeCalled();
      expect(Auth.signIn).not.toBeCalled();
      expect(userObject.user.setDeviceStatusNotRemembered).not.toBeCalled();
    });

    it('fails and returns promise reject when user.globalSignOut throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      const error = { code: 'testError', message: 'testMessage' };

      userObject.user.setDeviceStatusRemembered = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.globalSignOut = jest.fn(({ onFailure }) => onFailure(error));
      userObject.user.setDeviceStatusNotRemembered = jest.fn(({ onSuccess }) => onSuccess());
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      try {
        await store.dispatch(requestSignOutOtherDevices(signOutPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(userObject.user.setDeviceStatusRemembered).toBeCalled();
      expect(userObject.user.globalSignOut).toBeCalled();
      expect(Auth.signIn).not.toBeCalled();
      expect(userObject.user.setDeviceStatusNotRemembered).not.toBeCalled();
    });

    it('fails and returns promise reject when Auth.signIn throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      userObject.user.setDeviceStatusRemembered = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.globalSignOut = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.setDeviceStatusNotRemembered = jest.fn(({ onSuccess }) => onSuccess());
      stateBeforeAWS.user = userObject.user;
      stateBeforeAWS.status = requestStatusTypes.LOADING;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.ERROR,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.signIn.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestSignOutOtherDevices(signOutPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(userObject.user.setDeviceStatusRemembered).toBeCalled();
      expect(userObject.user.globalSignOut).toBeCalled();
      expect(Auth.signIn).toBeCalledWith(signOutPayload.email, signOutPayload.password);
      expect(userObject.user.setDeviceStatusNotRemembered).not.toBeCalled();
    });

    it('fails and returns promise reject when user.setDeviceStatusNotRemembered throws an error when remembered is false', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      const error = { code: 'testError', message: 'testMessage' };

      userObject.user.setDeviceStatusRemembered = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.globalSignOut = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.setDeviceStatusNotRemembered = jest.fn(({ onFailure }) => onFailure(error));
      stateBeforeAWS.user = userObject.user;

      const signOutNotRememberedPayload = {
        email: 'testEmail',
        password: 'testPassword1!',
        remembered: false,
      };
      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_USER,
          payload: {
            user: userObject.user,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.SUCCESS,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.signIn.mockReturnValue(Promise.resolve(userObject.user));

      try {
        await store.dispatch(requestSignOutOtherDevices(signOutNotRememberedPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(userObject.user.setDeviceStatusRemembered).toBeCalled();
      expect(userObject.user.globalSignOut).toBeCalled();
      expect(Auth.signIn).toBeCalledWith(signOutPayload.email, signOutPayload.password);
      expect(userObject.user.setDeviceStatusNotRemembered).toBeCalled();
    });

    it('creates the correct actions with the correct payloads when remembered is false', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      userObject.user.setDeviceStatusRemembered = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.globalSignOut = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.setDeviceStatusNotRemembered = jest.fn(({ onSuccess }) => onSuccess());
      stateBeforeAWS.user = userObject.user;

      const signOutNotRememberedPayload = {
        email: 'testEmail',
        password: 'testPassword1!',
        remembered: false,
      };
      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_USER,
          payload: {
            user: userObject.user,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.SUCCESS,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.signIn.mockReturnValue(Promise.resolve(userObject.user));

      await store.dispatch(requestSignOutOtherDevices(signOutNotRememberedPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(userObject.user.setDeviceStatusRemembered).toBeCalled();
      expect(userObject.user.globalSignOut).toBeCalled();
      expect(Auth.signIn).toBeCalledWith(signOutPayload.email, signOutPayload.password);
      expect(userObject.user.setDeviceStatusNotRemembered).toBeCalled();
    });

    it('creates the correct actions with the correct payloads', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      userObject.user.setDeviceStatusRemembered = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.globalSignOut = jest.fn(({ onSuccess }) => onSuccess());
      userObject.user.setDeviceStatusNotRemembered = jest.fn(({ onSuccess }) => onSuccess());
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_USER,
          payload: {
            user: userObject.user,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.SUCCESS,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.signIn.mockReturnValue(Promise.resolve(userObject.user));

      await store.dispatch(requestSignOutOtherDevices(signOutPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(userObject.user.setDeviceStatusRemembered).toBeCalled();
      expect(userObject.user.globalSignOut).toBeCalled();
      expect(Auth.signIn).toBeCalledWith(signOutPayload.email, signOutPayload.password);
      expect(userObject.user.setDeviceStatusNotRemembered).not.toBeCalled();
    });
  });
});
