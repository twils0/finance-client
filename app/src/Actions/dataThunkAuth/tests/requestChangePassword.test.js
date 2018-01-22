import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import requestChangePassword from '../requestChangePassword';

jest.mock('aws-amplify', () => ({
  Auth: {
    changePassword: jest.fn(),
  },
}));
jest.mock('../../dataThunkAWS/requestAWSUser', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const userObject = { user: { test: 'testUser' } };
const changePayload = { oldPassword: 'testPassword1!', newPassword: 'testPassword2!' };

describe('dataThunkAuth', () => {
  describe('requestChangePassword', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      Auth.changePassword.mockReset();
    });

    it("fails and throws an error when missing 'oldPassword' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      Auth.changePassword.mockReturnValue(Promise.resolve());

      const emptyPayload = {};

      try {
        await store.dispatch(requestChangePassword(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.changePassword).not.toBeCalled();
    });

    it("fails and throws an error when missing 'newPassword' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      Auth.changePassword.mockReturnValue(Promise.resolve());

      const wrongPayload = { oldPassword: 'testPassword1!' };

      try {
        await store.dispatch(requestChangePassword(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.changePassword).not.toBeCalled();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, auth: initialStateAuth } });

      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      Auth.changePassword.mockReturnValue(Promise.resolve());

      await store.dispatch(requestChangePassword(changePayload));

      expect(requestAWSUser).toBeCalled();
      expect(Auth.changePassword).toBeCalledWith(
        userObject.user,
        changePayload.oldPassword,
        changePayload.newPassword,
      );
    });

    it('fails and returns promise reject when requestAWSUser throws an error', async () => {
      const store = mockStore({ data: { aws: initialStateAWS, auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.CHANGE_PASSWORD,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.CHANGE_PASSWORD,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      const error = { code: 'testError', message: 'testMessage' };

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(requestChangePassword(changePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).toBeCalled();
      expect(Auth.changePassword).not.toBeCalled();
    });

    it('fails and returns promise reject when Auth.changePassword throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.CHANGE_PASSWORD,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.CHANGE_PASSWORD,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.changePassword.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestChangePassword(changePayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.changePassword).toBeCalledWith(
        userObject.user,
        changePayload.oldPassword,
        changePayload.newPassword,
      );
    });

    it('creates the correct actions with the correct payloads', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      stateBeforeAWS.user = userObject.user;
      const store = mockStore({ data: { aws: stateBeforeAWS, auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.CHANGE_PASSWORD,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.CHANGE_PASSWORD,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.changePassword.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestChangePassword(changePayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.changePassword).toBeCalledWith(
        userObject.user,
        changePayload.oldPassword,
        changePayload.newPassword,
      );
    });
  });
});
