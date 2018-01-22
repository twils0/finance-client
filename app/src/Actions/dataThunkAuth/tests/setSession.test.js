/**
 * @jest-environment node
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { actionTypes as actionTypesAuth } from '../../../Constants/dataConstantsAuth';
import setSession from '../setSession';
import requestLogout from '../requestLogout';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('../requestLogout', () => jest.fn());
jest.mock('../../dataThunkAWS/requestAWSUser', () => jest.fn());

const getSecurity = jest.fn();
const setSecurity = jest.fn();
const setInterval = jest.fn();

global.window = {
  sessionStorage: {
    getSecurity,
    setSecurity,
  },
  setInterval,
};

const lateDate = new Date('1/3/2000');
const earlyDate = new Date('1/1/2000');
const interval = 1234;

describe('dataThunkAuth', () => {
  describe('setSession', () => {
    afterEach(() => {
      getSecurity.mockReset();
      setSecurity.mockReset();
      setInterval.mockReset();
      requestAWSUser.mockReset();
      requestLogout.mockReset();
      MockDate.reset();
    });

    it('sets authenticated to false and calls requestLogout, when currentTime >= sessionTime and authenticated is true', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.authenticated = true;

      const store = mockStore({ data: { aws: initialStateAWS, auth: stateBeforeAuth } });

      const expectedActions = [];

      MockDate.set(lateDate);
      getSecurity.mockReturnValueOnce(new Date('1/2/2000').toString());
      requestLogout.mockReturnValue(() => Promise.resolve());

      const result = store.dispatch(setSession());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(false);
      expect(getSecurity).toBeCalledWith('sessionTime');
      expect(requestAWSUser).not.toBeCalled();
      expect(requestLogout).toBeCalled();
    });

    it('updates sessionTime and calls requestLogout, when requestAWSUser fails, when currentTime < sessionTime, authenticated is true, and no user object', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.authenticated = true;

      const store = mockStore({ data: { aws: initialStateAWS, auth: stateBeforeAuth } });

      const error = { code: 'testError', message: 'testMessage' };

      MockDate.set(earlyDate);
      getSecurity.mockReturnValueOnce(new Date('1/2/2000').toString());
      requestAWSUser.mockReturnValue(() => Promise.reject(error));
      requestLogout.mockReturnValue(() => Promise.resolve());

      const result = store.dispatch(setSession());

      expect(result).toEqual(true);
      expect(getSecurity).toBeCalledWith('sessionTime');
      expect(requestAWSUser).toBeCalled();
      await setTimeout(() => {}, 10); // work-around to test that logout is or is not fired
      expect(requestLogout).toBeCalled();
    });

    it('updates sessionTime and calls requestAWSUser, when currentTime < sessionTime, authenticated is true, no interval, and no user object', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.authenticated = true;

      const store = mockStore({ data: { aws: initialStateAWS, auth: stateBeforeAuth } });

      const incrementDate = new Date(earlyDate.toString());
      const expectDate = new Date(incrementDate.setMinutes(incrementDate.getMinutes() + 30));

      MockDate.set(earlyDate);
      getSecurity.mockReturnValueOnce(new Date('1/2/2000').toString());
      getSecurity.mockReturnValueOnce(null);
      setInterval.mockReturnValueOnce(interval);
      requestAWSUser.mockReturnValue(() => Promise.resolve());

      const result = store.dispatch(setSession());

      expect(result).toEqual(true);
      expect(getSecurity).toBeCalledWith('sessionTime');
      expect(getSecurity).toBeCalledWith('interval');
      expect(setSecurity).toBeCalledWith('sessionTime', expectDate);
      expect(setInterval).toBeCalled();
      expect(setSecurity).toBeCalledWith('interval', interval);
      expect(requestAWSUser).toBeCalled();
      await setTimeout(() => {}, 10); // work-around to test that logout is or is not fired
      expect(requestLogout).not.toBeCalled();
    });

    it('updates sessionTime, when currentTime < sessionTime, authenticated is true, and user object', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAuth.authenticated = true;
      stateBeforeAWS.user = { test: 'testUser' };

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: stateBeforeAuth } });

      MockDate.set(earlyDate);
      getSecurity.mockReturnValueOnce(new Date('1/2/2000').toString());

      const result = store.dispatch(setSession());

      expect(result).toEqual(true);
      expect(getSecurity).toBeCalledWith('sessionTime');
      expect(requestAWSUser).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it('sets authenticated to true, when currentTime < sessionTime, authenticated is false, and user object', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAuth.authenticated = false;
      stateBeforeAWS.user = { test: 'testUser' };

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: stateBeforeAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTHENTICATED,
          payload: {
            authenticated: true,
          },
        },
      ];

      MockDate.set(earlyDate);
      getSecurity.mockReturnValueOnce(new Date('1/2/2000').toString());

      const result = store.dispatch(setSession());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(true);
      expect(getSecurity).toBeCalledWith('sessionTime');
      expect(requestAWSUser).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it('sets authenticated to true and calls requestLogout, when requestAWSUser fails, when currentTime < sessionTime, authenticated is false, and no user object', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.authenticated = false;

      const store = mockStore({ data: { aws: initialStateAWS, auth: stateBeforeAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTHENTICATED,
          payload: {
            authenticated: true,
          },
        },
      ];

      const error = { code: 'testError', message: 'testMessage' };

      MockDate.set(earlyDate);
      getSecurity.mockReturnValueOnce(new Date('1/2/2000').toString());
      requestAWSUser.mockReturnValue(() => Promise.reject(error));
      requestLogout.mockReturnValue(() => Promise.resolve());

      const result = store.dispatch(setSession());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(true);
      expect(getSecurity).toBeCalledWith('sessionTime');
      expect(requestAWSUser).toBeCalled();
      await setTimeout(() => {}, 10); // work-around to test that logout is or is not fired
      expect(requestLogout).toBeCalled();
    });

    it('sets authenticated to true and calls requestAWSUser, when currentTime < sessionTime, authenticated is false, and no user object', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.authenticated = false;

      const store = mockStore({ data: { aws: initialStateAWS, auth: stateBeforeAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTHENTICATED,
          payload: {
            authenticated: true,
          },
        },
      ];

      MockDate.set(earlyDate);
      getSecurity.mockReturnValueOnce(new Date('1/2/2000').toString());
      requestAWSUser.mockReturnValue(() => Promise.resolve());

      const result = store.dispatch(setSession());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(true);
      expect(getSecurity).toBeCalledWith('sessionTime');
      expect(requestAWSUser).toBeCalled();
      await setTimeout(() => {}, 10); // work-around to test that logout is or is not fired
      expect(requestLogout).not.toBeCalled();
    });

    it('sets authenticated to true, when currentTime < sessionTime, authenticated is false, and user object', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAuth.authenticated = false;
      stateBeforeAWS.user = { test: 'testUser' };

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: stateBeforeAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTHENTICATED,
          payload: {
            authenticated: true,
          },
        },
      ];

      MockDate.set(earlyDate);
      getSecurity.mockReturnValueOnce(new Date('1/2/2000').toString());

      const result = store.dispatch(setSession());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(true);
      expect(getSecurity).toBeCalledWith('sessionTime');
      expect(requestAWSUser).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it('sets authenticated to false and calls requestLogout, when no sessionTime and authenticated is true', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      stateBeforeAuth.authenticated = true;

      const store = mockStore({ data: { aws: initialStateAWS, auth: stateBeforeAuth } });

      const expectedActions = [];

      getSecurity.mockReturnValueOnce(new Date('1/2/2000').toString());
      requestLogout.mockReturnValue(() => Promise.resolve());

      const result = store.dispatch(setSession());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(false);
      expect(getSecurity).toBeCalledWith('sessionTime');
      expect(requestAWSUser).not.toBeCalled();
      expect(requestLogout).toBeCalled();
    });

    it('does nothing, when no sessionTime and authenticated is false', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAuth.authenticated = false;
      stateBeforeAWS.user = { test: 'testUser' };

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: stateBeforeAuth } });

      const expectedActions = [];

      const result = store.dispatch(setSession());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(false);
      expect(getSecurity).toBeCalledWith('sessionTime');
      expect(requestAWSUser).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });
  });
});
