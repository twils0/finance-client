import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesAuth,
  codeTypeNames,
  statusNames,
} from '../../../Constants/dataConstantsAuth';
import requestLoginMFA from '../requestLoginMFA';
import requestVerifyEmail from '../requestVerifyEmail';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import loadAWSFields from '../../dataThunkAccount/loadAWSFields';
import loadSecurities from '../../dataThunkWatchlist/loadSecurities';

jest.mock('aws-amplify', () => ({
  Auth: {
    confirmSignIn: jest.fn(),
  },
}));
jest.mock('../../dataThunkAWS/requestAWSUser', () => jest.fn());
jest.mock('../../dataThunkAccount/loadAWSFields', () => jest.fn());
jest.mock('../../dataThunkWatchlist/loadSecurities', () => jest.fn());
jest.mock('../requestVerifyEmail', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const userObject = { user: { test: 'testUser' } };
const mfaPayload = { code: '123456' };

describe('dataThunkAuth', () => {
  describe('requestLoginMFA', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      Auth.confirmSignIn.mockReset();
      loadAWSFields.mockReset();
      loadSecurities.mockReset();
      requestVerifyEmail.mockReset();
    });

    it("fails and throws an error when missing 'code' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      Auth.confirmSignIn.mockReturnValue(Promise.resolve());

      const emptyPayload = {};

      try {
        await store.dispatch(requestLoginMFA(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.confirmSignIn).not.toBeCalled();
      expect(loadAWSFields).not.toBeCalled();
      expect(requestVerifyEmail).not.toBeCalled();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;

      const store = mockStore({ data: { aws: initialStateAWS, auth: stateBeforeAuth } });

      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      Auth.confirmSignIn.mockReturnValue(Promise.resolve());
      loadSecurities.mockReturnValue(() => Promise.resolve());
      loadAWSFields.mockReturnValue(() => Promise.resolve());

      await store.dispatch(requestLoginMFA(mfaPayload));

      expect(requestAWSUser).toBeCalled();
      expect(Auth.confirmSignIn).toBeCalledWith(userObject.user, mfaPayload.code);
      expect(loadAWSFields).toBeCalled();
      expect(loadSecurities).toBeCalled();
      expect(requestVerifyEmail).not.toBeCalled();
    });

    it('fails and returns promise reject when requestAWSUser throws an error', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;

      const store = mockStore({ data: { aws: initialStateAWS, auth: stateBeforeAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestLoginMFA(mfaPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).toBeCalled();
      expect(Auth.confirmSignIn).not.toBeCalled();
      expect(loadAWSFields).not.toBeCalled();
      expect(loadSecurities).not.toBeCalled();
      expect(requestVerifyEmail).not.toBeCalled();
    });

    it('fails and returns promise reject when Auth.confirmSignIn throws an error', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: stateBeforeAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.confirmSignIn.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestLoginMFA(mfaPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.confirmSignIn).toBeCalledWith(userObject.user, mfaPayload.code);
      expect(loadAWSFields).not.toBeCalled();
      expect(loadSecurities).not.toBeCalled();
      expect(requestVerifyEmail).not.toBeCalled();
    });

    it('fails and returns promise reject when loadAWSFields throws an error', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: stateBeforeAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.confirmSignIn.mockReturnValue(Promise.resolve());
      loadSecurities.mockReturnValue(() => Promise.resolve());
      loadAWSFields.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestLoginMFA(mfaPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.confirmSignIn).toBeCalledWith(userObject.user, mfaPayload.code);
      expect(loadAWSFields).toBeCalled();
      expect(loadSecurities).toBeCalled();
      expect(requestVerifyEmail).not.toBeCalled();
    });

    it('fails and returns promise reject when requestVerifyEmail throws an error, when email verify and email additional verify needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = true;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = true;
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: stateBeforeAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.confirmSignIn.mockReturnValue(Promise.resolve());
      loadAWSFields.mockReturnValue(() => Promise.resolve());
      loadSecurities.mockReturnValue(() => Promise.resolve());
      requestVerifyEmail.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestLoginMFA(mfaPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.confirmSignIn).toBeCalledWith(userObject.user, mfaPayload.code);
      expect(loadAWSFields).toBeCalled();
      expect(loadSecurities).toBeCalled();
      expect(requestVerifyEmail).toBeCalled();
    });

    it('creates the correct actions with the correct payloads, when email additional verify needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = true;
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: stateBeforeAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.confirmSignIn.mockReturnValue(Promise.resolve());
      loadAWSFields.mockReturnValue(() => Promise.resolve());
      loadSecurities.mockReturnValue(() => Promise.resolve());
      requestVerifyEmail.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(requestLoginMFA(mfaPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.confirmSignIn).toBeCalledWith(userObject.user, mfaPayload.code);
      expect(loadAWSFields).toBeCalled();
      expect(loadSecurities).toBeCalled();
      expect(requestVerifyEmail).toBeCalled();
    });

    it('creates the correct actions with the correct payloads, when email verify needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = true;
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: stateBeforeAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.confirmSignIn.mockReturnValue(Promise.resolve());
      loadAWSFields.mockReturnValue(() => Promise.resolve());
      loadSecurities.mockReturnValue(() => Promise.resolve());
      requestVerifyEmail.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(requestLoginMFA(mfaPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.confirmSignIn).toBeCalledWith(userObject.user, mfaPayload.code);
      expect(loadAWSFields).toBeCalled();
      expect(loadSecurities).toBeCalled();
      expect(requestVerifyEmail).toBeCalled();
    });

    it('creates the correct actions with the correct payloads, with email and email additional not needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      stateBeforeAuth.codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: stateBeforeAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGIN_MFA,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.confirmSignIn.mockReturnValue(Promise.resolve());
      loadAWSFields.mockReturnValue(() => Promise.resolve());
      loadSecurities.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(requestLoginMFA(mfaPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.confirmSignIn).toBeCalledWith(userObject.user, mfaPayload.code);
      expect(loadAWSFields).toBeCalled();
      expect(loadSecurities).toBeCalled();
      expect(requestVerifyEmail).not.toBeCalled();
    });
  });
});
