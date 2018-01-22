import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import requestResetPassword from '../requestResetPassword';

jest.mock('aws-amplify', () => ({
  Auth: {
    forgotPasswordSubmit: jest.fn(),
  },
}));

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const resetPayload = { email: 'testEmail', code: '123456', password: 'testPassword1!' };

describe('dataThunkAuth', () => {
  describe('requestResetPassword', () => {
    afterEach(() => {
      Auth.forgotPasswordSubmit.mockReset();
    });

    it("fails and throws an error when missing 'email' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      Auth.forgotPasswordSubmit.mockReturnValue(Promise.resolve());

      const emptyPayload = {};

      try {
        await store.dispatch(requestResetPassword(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(Auth.forgotPasswordSubmit).not.toBeCalled();
    });

    it("fails and throws an error when missing 'code' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      Auth.forgotPasswordSubmit.mockReturnValue(Promise.resolve());

      const wrongPayload = { email: 'testEmail' };

      try {
        await store.dispatch(requestResetPassword(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(Auth.forgotPasswordSubmit).not.toBeCalled();
    });

    it("fails and throws an error when missing 'password' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      Auth.forgotPasswordSubmit.mockReturnValue(Promise.resolve());

      const wrongPayload = { email: 'testEmail', code: '123456' };

      try {
        await store.dispatch(requestResetPassword(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(Auth.forgotPasswordSubmit).not.toBeCalled();
    });

    it('fails and returns promise reject when Auth.forgotPasswordSubmit throws an error', async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.RESET_PASSWORD,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.RESET_PASSWORD,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.forgotPasswordSubmit.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestResetPassword(resetPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('creates the correct actions with the correct payloads', async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.RESET_PASSWORD,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.RESET_PASSWORD,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.forgotPasswordSubmit.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestResetPassword(resetPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });
  });
});
