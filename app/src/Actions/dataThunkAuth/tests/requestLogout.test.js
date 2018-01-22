/**
 * @jest-environment node
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import { requestStatusTypes } from '../../../Constants/universalConstants';
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
import requestLogout from '../requestLogout';

jest.mock('aws-amplify', () => ({
  Auth: {
    signOut: jest.fn(),
  },
}));

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

const intervalId = '123';

describe('dataThunkAuth', () => {
  describe('requestLogout', () => {
    afterEach(() => {
      Auth.signOut.mockReset();
      getSecurity.mockReset();
      removeSecurity.mockReset();
      clearInterval.mockReset();
    });

    it('fails and returns promise reject when Auth.signOut throws an error', async () => {
      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { internal: { account: initialStateUIAccount } },
      });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGOUT,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGOUT,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.signOut.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestLogout());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(removeSecurity).not.toBeCalled();
      expect(clearInterval).not.toBeCalled();
      expect(getSecurity).not.toBeCalled();
    });

    it('correctly resets setCurrentForm, setButtonText, and setButtonVisible', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      stateBeforeUIAccount.forms.current = formNames.CODE;
      stateBeforeUIAccount.buttons[buttonNames.FIRST].text = buttonTexts.SUBMIT;
      stateBeforeUIAccount.buttons[buttonNames.SECOND].visible = true;

      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGOUT,
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

      Auth.signOut.mockReturnValue(Promise.resolve());
      getSecurity.mockReturnValue(intervalId);

      const result = await store.dispatch(requestLogout());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(removeSecurity).toBeCalledWith('sessionTime');
      expect(getSecurity).toBeCalledWith('interval');
      expect(clearInterval).toBeCalledWith(intervalId);
      expect(removeSecurity).toBeCalledWith('interval');
    });

    it('creates the correct actions with the correct payloads', async () => {
      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { internal: { account: initialStateUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.LOGOUT,
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

      Auth.signOut.mockReturnValue(Promise.resolve());
      getSecurity.mockReturnValue(intervalId);

      const result = await store.dispatch(requestLogout());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(removeSecurity).toBeCalledWith('sessionTime');
      expect(getSecurity).toBeCalledWith('interval');
      expect(clearInterval).toBeCalledWith(intervalId);
      expect(removeSecurity).toBeCalledWith('interval');
    });
  });
});
