/**
 * @jest-environment node
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesAuth,
  codeTypeNames,
  statusNames,
} from '../../../Constants/dataConstantsAuth';
import { actionTypes as actionTypesAWS } from '../../../Constants/dataConstantsAWS';
import requestLogin from '../requestLogin';
import requestVerifyField from '../requestVerifyField';
import requestVerifyEmail from '../requestVerifyEmail';
import requestSignOutOtherDevices from '../requestSignOutOtherDevices';
import loadAWSFields from '../../dataThunkAccount/loadAWSFields';
import loadSecurities from '../../dataThunkWatchlist/loadSecurities';

jest.mock('aws-amplify', () => ({
  Auth: {
    signIn: jest.fn(),
  },
}));
jest.mock('../requestSignOutOtherDevices', () => jest.fn());
jest.mock('../../dataThunkAccount/loadAWSFields', () => jest.fn());
jest.mock('../../dataThunkWatchlist/loadSecurities', () => jest.fn());
jest.mock('../requestVerifyField', () => jest.fn());
jest.mock('../requestVerifyEmail', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const loginPayload = { email: 'testEmail', password: 'testPassword' };
const signOutPayload = { ...loginPayload, remembered: true };

describe('dataThunkAuth', () => {
  describe('requestLogin', () => {
    afterEach(() => {
      Auth.signIn.mockReset();
      requestSignOutOtherDevices.mockReset();
      loadSecurities.mockReset();
      loadAWSFields.mockReset();
      requestVerifyField.mockReset();
      requestVerifyEmail.mockReset();
    });

    it("fails and throws an error when missing 'email' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      Auth.signIn.mockReturnValue(Promise.resolve());

      const emptyPayload = {};

      try {
        await store.dispatch(requestLogin(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(Auth.signIn).not.toBeCalled();
      expect(requestSignOutOtherDevices).not.toBeCalled();
      expect(loadSecurities).not.toBeCalled();
      expect(loadAWSFields).not.toBeCalled();
      expect(requestVerifyField).not.toBeCalled();
    });

    it("fails and throws an error when missing 'password' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      Auth.signIn.mockReturnValue(Promise.resolve());

      const wrongPayload = { email: 'testEmail' };

      try {
        await store.dispatch(requestLogin(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(Auth.signIn).not.toBeCalled();
      expect(requestSignOutOtherDevices).not.toBeCalled();
      expect(loadSecurities).not.toBeCalled();
      expect(loadAWSFields).not.toBeCalled();
      expect(requestVerifyField).not.toBeCalled();
    });

    it('fails and returns promise reject when Auth.signIn throws an error', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;

      const store = mockStore({ data: { auth: stateBeforeAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN,
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
            id: statusNames.LOGIN,
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
        await store.dispatch(requestLogin(loginPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(Auth.signIn).toBeCalledWith(loginPayload.email, loginPayload.password);
      expect(requestSignOutOtherDevices).not.toBeCalled();
      expect(loadSecurities).not.toBeCalled();
      expect(loadAWSFields).not.toBeCalled();
      expect(requestVerifyField).not.toBeCalled();
    });

    it('fails and returns promise reject when requestVerifyField throws an error, when phone verify needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_PHONE].needed = true;

      const store = mockStore({ data: { auth: stateBeforeAuth } });

      const user = { test: 'testUser' };
      const verifyPhonePayload = { field: 'phone_number' };
      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN,
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
            user,
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
            id: statusNames.LOGIN,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.signIn.mockReturnValue(Promise.resolve(user));
      requestSignOutOtherDevices.mockReturnValue(() => Promise.resolve());
      loadSecurities.mockReturnValue(() => Promise.resolve());
      loadAWSFields.mockReturnValue(() => Promise.resolve());
      requestVerifyField.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestLogin(loginPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(Auth.signIn).toBeCalledWith(loginPayload.email, loginPayload.password);
      expect(requestSignOutOtherDevices).toBeCalledWith(signOutPayload);
      expect(loadSecurities).toBeCalled();
      expect(loadAWSFields).toBeCalled();
      expect(requestVerifyField).toBeCalledWith(verifyPhonePayload);
    });

    it('fails and returns promise reject when requestVerifyEmail throws an error, when email verify needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = true;

      const store = mockStore({ data: { auth: stateBeforeAuth } });

      const user = { test: 'testUser' };
      const verifyPhonePayload = { field: 'phone_number' };
      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN,
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
            user,
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
            id: statusNames.LOGIN,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.signIn.mockReturnValue(Promise.resolve(user));
      requestSignOutOtherDevices.mockReturnValue(() => Promise.resolve());
      loadSecurities.mockReturnValue(() => Promise.resolve());
      loadAWSFields.mockReturnValue(() => Promise.resolve());
      requestVerifyField.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestLogin(loginPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(Auth.signIn).toBeCalledWith(loginPayload.email, loginPayload.password);
      expect(requestSignOutOtherDevices).toBeCalledWith(signOutPayload);
      expect(loadSecurities).toBeCalled();
      expect(loadAWSFields).toBeCalled();
      expect(requestVerifyField).toBeCalledWith(verifyPhonePayload);
    });

    it('creates the correct actions with the correct payloads when phone number verify needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;

      const store = mockStore({ data: { auth: stateBeforeAuth } });

      const user = { test: 'testUser' };
      const verifyPhonePayload = { field: 'phone_number' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN,
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
            user,
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
            id: statusNames.LOGIN,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.signIn.mockReturnValue(Promise.resolve(user));
      requestSignOutOtherDevices.mockReturnValue(() => Promise.resolve());
      loadSecurities.mockReturnValue(() => Promise.resolve());
      loadAWSFields.mockReturnValue(() => Promise.resolve());
      requestVerifyField.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(requestLogin(loginPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(false);
      expect(Auth.signIn).toBeCalledWith(loginPayload.email, loginPayload.password);
      expect(requestSignOutOtherDevices).toBeCalledWith(signOutPayload);
      expect(loadSecurities).toBeCalled();
      expect(loadAWSFields).toBeCalled();
      expect(requestVerifyField).toBeCalledWith(verifyPhonePayload);
    });

    it('creates the correct actions with the correct payloads, when email verify needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;

      const store = mockStore({ data: { auth: stateBeforeAuth } });

      const user = { test: 'testUser' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN,
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
            user,
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
            id: statusNames.LOGIN,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.signIn.mockReturnValue(Promise.resolve(user));
      requestSignOutOtherDevices.mockReturnValue(() => Promise.resolve());
      loadSecurities.mockReturnValue(() => Promise.resolve());
      loadAWSFields.mockReturnValue(() => Promise.resolve());
      requestVerifyEmail.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(requestLogin(loginPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(false);
      expect(Auth.signIn).toBeCalledWith(loginPayload.email, loginPayload.password);
      expect(requestSignOutOtherDevices).toBeCalledWith(signOutPayload);
      expect(loadSecurities).toBeCalled();
      expect(loadAWSFields).toBeCalled();
      expect(requestVerifyEmail).toBeCalled();
    });

    it('creates the correct actions with the correct payloads, when email additional verify needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = true;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = true;

      const store = mockStore({ data: { auth: stateBeforeAuth } });

      const user = { test: 'testUser' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN,
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
            user,
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
            id: statusNames.LOGIN,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.signIn.mockReturnValue(Promise.resolve(user));
      requestSignOutOtherDevices.mockReturnValue(() => Promise.resolve());
      loadSecurities.mockReturnValue(() => Promise.resolve());
      loadAWSFields.mockReturnValue(() => Promise.resolve());
      requestVerifyEmail.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(requestLogin(loginPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(false);
      expect(Auth.signIn).toBeCalledWith(loginPayload.email, loginPayload.password);
      expect(requestSignOutOtherDevices).toBeCalledWith(signOutPayload);
      expect(loadSecurities).toBeCalled();
      expect(loadAWSFields).toBeCalled();
      expect(requestVerifyEmail).toBeCalled();
    });

    it('creates the correct actions with the correct payloads when MFA needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;

      const store = mockStore({ data: { auth: stateBeforeAuth } });

      const user = { test: 'testUser', challengeName: 'SMS_MFA' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN,
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
            user,
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
            id: statusNames.LOGIN,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.signIn.mockReturnValue(Promise.resolve(user));

      const result = await store.dispatch(requestLogin(loginPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(true);
      expect(Auth.signIn).toBeCalledWith(loginPayload.email, loginPayload.password);
      expect(requestSignOutOtherDevices).not.toBeCalled();
      expect(loadAWSFields).not.toBeCalled();
      expect(loadSecurities).not.toBeCalled();
      expect(requestVerifyField).not.toBeCalled();
    });

    it('creates the correct actions with the correct payloads when MFA not needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;

      const store = mockStore({ data: { auth: stateBeforeAuth } });

      const user = { test: 'testUser' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN,
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
            user,
          },
        },
        {
          type: actionTypesAWS.SET_AWS_STATUS,
          payload: {
            status: requestStatusTypes.SUCCESS,
          },
        },
        {
          type: actionTypesAuth.SET_AUTHENTICATED,
          payload: {
            authenticated: true,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.signIn.mockReturnValue(Promise.resolve(user));
      requestSignOutOtherDevices.mockReturnValue(() => Promise.resolve());
      loadSecurities.mockReturnValue(() => Promise.resolve());
      loadAWSFields.mockReturnValue(() => Promise.resolve());
      requestVerifyField.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(requestLogin(loginPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(false);
      expect(Auth.signIn).toBeCalledWith(loginPayload.email, loginPayload.password);
      expect(requestSignOutOtherDevices).toBeCalledWith(signOutPayload);
      expect(loadSecurities).toBeCalled();
      expect(loadAWSFields).toBeCalled();
      expect(requestVerifyField).not.toBeCalled();
    });
  });
});
