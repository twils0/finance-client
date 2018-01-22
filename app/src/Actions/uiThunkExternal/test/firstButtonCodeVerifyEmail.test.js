/**
 * @jest-environment node
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { requestStatusTypes, pathNames } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import requestVerifyEmailLink from '../../dataThunkAuth/requestVerifyEmailLink';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import firstButtonCodeVerifyEmail from '../firstButtonCodeVerifyEmail';

const history = {
  replace: jest.fn(),
};

const setSecurity = jest.fn();

global.window = {
  sessionStorage: {
    setSecurity,
  },
};
jest.mock('../../dataThunkAuth/requestVerifyEmailLink', () => jest.fn());
jest.mock('../../dataThunkAWS/requestAWSUser', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const verificationId = '1234-5678-1234-5678';
const user = { test: 'testUser' };

const match = {
  params: {
    verificationId,
  },
};

describe('uiThunkExternal', () => {
  describe('firstButtonCodeVerifyEmail', () => {
    afterEach(() => {
      requestVerifyEmailLink.mockReset();
      requestAWSUser.mockReset();
      history.replace.mockReset();
      setSecurity.mockReset();
      MockDate.reset();
    });

    it("fails and throws an error when missing 'history' key in payload", async () => {
      const wrongPayload = {};

      const store = mockStore({
        data: { auth: initialStateAuth, aws: initialStateAWS },
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [];

      try {
        await store.dispatch(firstButtonCodeVerifyEmail(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it("fails and throws an error when missing 'match' key in payload", async () => {
      const wrongPayload = {
        history,
      };

      const store = mockStore({
        data: { auth: initialStateAuth, aws: initialStateAWS },
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [];

      try {
        await store.dispatch(firstButtonCodeVerifyEmail(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('creates the correct actions with the correct payload, with user and verification id', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      stateBeforeAWS.user = user;

      const store = mockStore({
        data: { auth: initialStateAuth, aws: stateBeforeAWS },
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTHENTICATED,
          payload: {
            authenticated: true,
          },
        },
      ];

      const startDate = new Date('1/2/2000');
      const incrementDate = new Date('1/2/2000');
      const expectDate = new Date(incrementDate.setMinutes(incrementDate.getMinutes() + 30));

      MockDate.set(startDate);

      requestVerifyEmailLink.mockReturnValue(() => Promise.resolve(null));

      const result = await store.dispatch(firstButtonCodeVerifyEmail({ history, match }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(history.replace).not.toBeCalled();
      expect(requestVerifyEmailLink).toBeCalledWith({ verificationId });
      expect(setSecurity).toBeCalledWith('sessionTime', expectDate);
    });

    it('creates the correct actions with the correct payload, with user from requestAWSUser and verification id', async () => {
      const store = mockStore({
        data: { auth: initialStateAuth, aws: initialStateAWS },
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTHENTICATED,
          payload: {
            authenticated: true,
          },
        },
      ];

      const startDate = new Date('1/2/2000');
      const incrementDate = new Date('1/2/2000');
      const expectDate = new Date(incrementDate.setMinutes(incrementDate.getMinutes() + 30));

      MockDate.set(startDate);

      requestAWSUser.mockReturnValue(() => Promise.resolve({ user }));
      requestVerifyEmailLink.mockReturnValue(() => Promise.resolve(null));

      const result = await store.dispatch(firstButtonCodeVerifyEmail({ history, match }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).toBeCalled();
      expect(history.replace).not.toBeCalled();
      expect(requestVerifyEmailLink).toBeCalledWith({ verificationId });
      expect(setSecurity).toBeCalledWith('sessionTime', expectDate);
    });

    it('creates the correct actions with the correct payload, without user and with verification id', async () => {
      const store = mockStore({
        data: { auth: initialStateAuth, aws: initialStateAWS },
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [];

      requestAWSUser.mockReturnValue(() => Promise.resolve({}));
      requestVerifyEmailLink.mockReturnValue(() => Promise.resolve(null));

      const result = await store.dispatch(firstButtonCodeVerifyEmail({ history, match }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
      expect(requestVerifyEmailLink).toBeCalledWith({ verificationId });
      expect(setSecurity).not.toBeCalled();
    });

    it('requestAWSUser throws an unexpected error, redirects to login', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));

      stateBeforeAuth.status[statusNames.LOGIN_MFA].status = requestStatusTypes.SUCCESS;

      const store = mockStore({
        data: { auth: stateBeforeAuth, aws: initialStateAWS },
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [];

      requestAWSUser.mockReturnValue(() => Promise.reject(null));

      const result = await store.dispatch(firstButtonCodeVerifyEmail({ history, match }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestVerifyEmailLink).not.toBeCalled();
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
      expect(setSecurity).not.toBeCalled();
    });

    it('requestVerifyEmailLink throws an unexpected error, redirects to login', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      stateBeforeAWS.user = user;

      const store = mockStore({
        data: { auth: initialStateAuth, aws: stateBeforeAWS },
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [];

      requestAWSUser.mockReturnValue(() => Promise.resolve({ user }));
      requestVerifyEmailLink.mockReturnValue(() => Promise.reject(null));

      const result = await store.dispatch(firstButtonCodeVerifyEmail({ history, match }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestVerifyEmailLink).toBeCalledWith({ verificationId });
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
      expect(setSecurity).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload, with no verification id and login mfa status equals success', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));

      stateBeforeAuth.status[statusNames.LOGIN_MFA].status = requestStatusTypes.SUCCESS;

      const store = mockStore({
        data: { auth: stateBeforeAuth, aws: initialStateAWS },
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.DEVICE,
          },
        },
      ];

      requestVerifyEmailLink.mockReturnValue(() => Promise.resolve(null));

      const result = await store.dispatch(
        firstButtonCodeVerifyEmail({ history, match: { params: {} } }),
      );

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(history.replace).not.toBeCalled();
      expect(requestVerifyEmailLink).not.toBeCalled();
      expect(setSecurity).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload, with no verification id and login mfa status not equal to success', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));

      stateBeforeUIExternal.forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = 'testValue';
      stateBeforeUIExternal.forms[formNames.LOGIN].inputs[
        inputNames[formNames.LOGIN].PASSWORD
      ].value = 'testValue';

      const loginEmail = stateBeforeUIExternal.forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
      const loginPassword = stateBeforeUIExternal.forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadLoginEmail = JSON.parse(JSON.stringify(loginEmail));
      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadLoginEmail.value = '';
      payloadLoginPassword.value = '';

      const store = mockStore({
        data: { auth: initialStateAuth, aws: initialStateAWS },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTHENTICATED,
          payload: {
            authenticated: true,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginPassword,
        },
      ];

      requestVerifyEmailLink.mockReturnValue(() => Promise.resolve(null));

      const startDate = new Date('1/2/2000');
      const incrementDate = new Date('1/2/2000');
      const expectDate = new Date(incrementDate.setMinutes(incrementDate.getMinutes() + 30));

      MockDate.set(startDate);

      const result = await store.dispatch(
        firstButtonCodeVerifyEmail({ history, match: { params: {} } }),
      );

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(history.replace).not.toBeCalled();
      expect(requestVerifyEmailLink).not.toBeCalled();
      expect(setSecurity).toBeCalledWith('sessionTime', expectDate);
    });
  });
});
