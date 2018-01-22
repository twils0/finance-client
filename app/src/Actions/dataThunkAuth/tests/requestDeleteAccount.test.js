/**
 * @jest-environment node
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import { requestStatusTypes, URLs, axiosConfig } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import { actionTypes as actionTypesAWS } from '../../../Constants/dataConstantsAWS';
import { actionTypes as actionTypesAccount } from '../../../Constants/dataConstantsAccount';
import { actionTypes as actionTypesWatchlist } from '../../../Constants/dataConstantsWatchlist';
import {
  formNames,
  buttonNames,
  buttonTexts,
  actionTypes as actionTypesUIAccount,
} from '../../../Constants/uiConstantsAccount';
import requestDeleteAccount from '../requestDeleteAccount';
import requestLogout from '../requestLogout';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';

jest.mock('axios', () => ({
  delete: jest.fn(),
}));
jest.mock('../../dataThunkAWS/requestAWSUser', () => jest.fn());
jest.mock('../../dataThunkAuth/requestLogout', () => jest.fn());

const getSecurity = jest.fn();
const removeSecurity = jest.fn();
const clearInterval = jest.fn();

global.window = {
  sessionStorage: {
    getSecurity,
    removeSecurity,
  },
  clearInterval,
};

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
const mockAxiosStripeConfig = {
  headers: {
    Authorization: idToken,
  },
  ...axiosConfig.STRIPE,
};
const mockAxiosDBConfig = {
  headers: {
    Authorization: idToken,
  },
  ...axiosConfig.DB,
};
const intervalId = '123';

describe('dataThunkAuth', () => {
  describe('requestDeleteAccount', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      requestLogout.mockReset();
      axios.delete.mockReset();
      if (userObject.user.deleteUser) {
        delete userObject.user.deleteUser;
      }
      getSecurity.mockReset();
      removeSecurity.mockReset();
      clearInterval.mockReset();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const store = mockStore({
        data: { aws: initialStateAWS, auth: initialStateAuth },
        ui: { internal: { account: initialStateUIAccount } },
      });

      userObject.user.deleteUser = jest.fn(callback => callback());
      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      axios.delete.mockReturnValue(Promise.resolve());
      getSecurity.mockReturnValue(intervalId);

      await store.dispatch(requestDeleteAccount());

      expect(requestAWSUser).toBeCalled();
      expect(axios.delete).toBeCalledWith(URLs.CUSTOMERS, mockAxiosStripeConfig);
      expect(axios.delete).toBeCalledWith(URLs.USERS, mockAxiosDBConfig);
      expect(userObject.user.deleteUser).toBeCalled();
      expect(requestLogout).not.toBeCalled();
      expect(removeSecurity).toBeCalledWith('sessionTime');
      expect(getSecurity).toBeCalledWith('interval');
      expect(clearInterval).toBeCalledWith(intervalId);
      expect(removeSecurity).toBeCalledWith('interval');
    });

    it('fails and returns promise reject when requestAWSUser throws an error', async () => {
      const store = mockStore({
        data: { aws: initialStateAWS, auth: initialStateAuth },
        ui: { internal: { account: initialStateUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.DELETE_ACCOUNT,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.DELETE_ACCOUNT,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      const error = { code: 'testError', message: 'testMessage' };

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestDeleteAccount());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).toBeCalled();
      expect(axios.delete).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
      expect(removeSecurity).not.toBeCalled();
      expect(clearInterval).not.toBeCalled();
      expect(getSecurity).not.toBeCalled();
    });

    it("calls requestLogout when axios throws 'NotAuthorizedException' error", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({
        data: { aws: stateBeforeAWS, auth: initialStateAuth },
        ui: { internal: { account: initialStateUIAccount } },
      });

      const error = { code: 'NotAuthorizedException', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.DELETE_ACCOUNT,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.DELETE_ACCOUNT,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.delete.mockReturnValue(Promise.reject(error));
      stateBeforeAWS.user.deleteUser = jest.fn(callback => callback());
      requestLogout.mockReturnValue(() => null);

      try {
        await store.dispatch(requestDeleteAccount());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(null);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.delete).toBeCalledWith(URLs.USERS, mockAxiosDBConfig);
      expect(axios.delete).toBeCalledWith(URLs.CUSTOMERS, mockAxiosStripeConfig);
      expect(userObject.user.deleteUser).toBeCalled();
      expect(requestLogout).toBeCalled();
      expect(removeSecurity).not.toBeCalled();
      expect(clearInterval).not.toBeCalled();
      expect(getSecurity).not.toBeCalled();
    });

    it('fails and returns promise reject when user.deleteUser throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({
        data: { aws: stateBeforeAWS, auth: initialStateAuth },
        ui: { internal: { account: initialStateUIAccount } },
      });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.DELETE_ACCOUNT,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.DELETE_ACCOUNT,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.delete.mockReturnValue(Promise.resolve());
      stateBeforeAWS.user.deleteUser = jest.fn(callback => callback(error));

      try {
        await store.dispatch(requestDeleteAccount());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.delete).toBeCalledWith(URLs.USERS, mockAxiosDBConfig);
      expect(axios.delete).toBeCalledWith(URLs.CUSTOMERS, mockAxiosStripeConfig);
      expect(stateBeforeAWS.user.deleteUser).toBeCalled();
      expect(requestLogout).not.toBeCalled();
      expect(removeSecurity).not.toBeCalled();
      expect(clearInterval).not.toBeCalled();
      expect(getSecurity).not.toBeCalled();
    });

    it('fails and returns promise reject when axios throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({
        data: { aws: stateBeforeAWS, auth: initialStateAuth },
        ui: { internal: { account: initialStateUIAccount } },
      });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.DELETE_ACCOUNT,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.DELETE_ACCOUNT,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.delete.mockReturnValue(Promise.reject(error));
      stateBeforeAWS.user.deleteUser = jest.fn(callback => callback());

      try {
        await store.dispatch(requestDeleteAccount());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.delete).toBeCalledWith(URLs.USERS, mockAxiosDBConfig);
      expect(axios.delete).toBeCalledWith(URLs.CUSTOMERS, mockAxiosStripeConfig);
      expect(userObject.user.deleteUser).toBeCalled();
      expect(requestLogout).not.toBeCalled();
      expect(removeSecurity).not.toBeCalled();
      expect(clearInterval).not.toBeCalled();
      expect(getSecurity).not.toBeCalled();
    });

    it('correctly resets setCurrentForm, setButtonText, and setButtonVisible', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.CODE;
      stateBeforeUIAccount.buttons[buttonNames.FIRST].text = buttonTexts.SUBMIT;
      stateBeforeUIAccount.buttons[buttonNames.SECOND].visible = true;

      const store = mockStore({
        data: { aws: stateBeforeAWS, auth: initialStateAuth },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.DELETE_ACCOUNT,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesUIAccount.SET_CURRENT_FORM,
          payload: {
            current: formNames.PROFILE,
          },
        },
        {
          type: actionTypesUIAccount.SET_BUTTON_TEXT,
          payload: {
            id: buttonNames.FIRST,
            text: buttonTexts.EDIT,
          },
        },
        {
          type: actionTypesUIAccount.SET_BUTTON_VISIBLE,
          payload: {
            id: buttonNames.SECOND,
            visible: false,
          },
        },
        {
          type: actionTypesAWS.RESET_AWS_STATE,
        },
        {
          type: actionTypesAccount.RESET_ACCOUNT_STATE,
        },
        {
          type: actionTypesWatchlist.RESET_WATCHLIST_STATE,
        },
        {
          type: actionTypesAuth.RESET_AUTH_STATE,
        },
      ];

      axios.delete.mockReturnValue(Promise.resolve());
      stateBeforeAWS.user.deleteUser = jest.fn(callback => callback());
      getSecurity.mockReturnValue(intervalId);

      const result = await store.dispatch(requestDeleteAccount());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.delete).toBeCalledWith(URLs.USERS, mockAxiosDBConfig);
      expect(axios.delete).toBeCalledWith(URLs.CUSTOMERS, mockAxiosStripeConfig);
      expect(userObject.user.deleteUser).toBeCalled();
      expect(requestLogout).not.toBeCalled();
      expect(removeSecurity).toBeCalledWith('sessionTime');
      expect(getSecurity).toBeCalledWith('interval');
      expect(clearInterval).toBeCalledWith(intervalId);
      expect(removeSecurity).toBeCalledWith('interval');
    });

    it('creates the correct actions with the correct payloads', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({
        data: { aws: stateBeforeAWS, auth: initialStateAuth },
        ui: { internal: { account: initialStateUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.DELETE_ACCOUNT,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAWS.RESET_AWS_STATE,
        },
        {
          type: actionTypesAccount.RESET_ACCOUNT_STATE,
        },
        {
          type: actionTypesWatchlist.RESET_WATCHLIST_STATE,
        },
        {
          type: actionTypesAuth.RESET_AUTH_STATE,
        },
      ];

      axios.delete.mockReturnValue(Promise.resolve());
      stateBeforeAWS.user.deleteUser = jest.fn(callback => callback());
      getSecurity.mockReturnValue(intervalId);

      const result = await store.dispatch(requestDeleteAccount());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(axios.delete).toBeCalledWith(URLs.USERS, mockAxiosDBConfig);
      expect(axios.delete).toBeCalledWith(URLs.CUSTOMERS, mockAxiosStripeConfig);
      expect(userObject.user.deleteUser).toBeCalled();
      expect(requestLogout).not.toBeCalled();
      expect(removeSecurity).toBeCalledWith('sessionTime');
      expect(getSecurity).toBeCalledWith('interval');
      expect(clearInterval).toBeCalledWith(intervalId);
      expect(removeSecurity).toBeCalledWith('interval');
    });
  });
});
