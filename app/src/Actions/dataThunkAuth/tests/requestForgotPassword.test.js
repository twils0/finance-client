import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import requestForgotPassword from '../requestForgotPassword';

jest.mock('aws-amplify', () => ({
  Auth: {
    forgotPassword: jest.fn(),
  },
}));

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const forgotPayload = { email: 'testEmail' };

describe('dataThunkAuth', () => {
  describe('requestForgotPassword', () => {
    afterEach(() => {
      Auth.forgotPassword.mockReset();
    });

    it("fails and throws an error when missing 'email' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      Auth.forgotPassword.mockReturnValue(Promise.resolve());

      const emptyPayload = {};

      try {
        await store.dispatch(requestForgotPassword(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(Auth.forgotPassword).not.toBeCalled();
    });

    it('fails and returns promise reject when Auth.forgotPassword throws an error', async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.FORGOT_PASSWORD,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.FORGOT_PASSWORD,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.forgotPassword.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestForgotPassword(forgotPayload));
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
            id: statusNames.FORGOT_PASSWORD,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.FORGOT_PASSWORD,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.forgotPassword.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestForgotPassword(forgotPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });
  });
});
