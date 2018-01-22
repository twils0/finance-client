import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import requestSignUpResendPhone from '../requestSignUpResendPhone';

jest.mock('aws-amplify', () => ({
  Auth: {
    resendSignUp: jest.fn(),
  },
}));
jest.mock('../requestVerifyFieldConfirm', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const resendPayload = {
  email: 'testEmail',
};

describe('dataThunkAuth', () => {
  describe('requestSignUpResendPhone', () => {
    afterEach(() => {
      Auth.resendSignUp.mockReset();
    });

    it("fails and throws an error when missing 'email' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const emptyPayload = {};

      try {
        await store.dispatch(requestSignUpResendPhone(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(Auth.resendSignUp).not.toBeCalled();
    });

    it('fails and returns promise reject when Auth.resendSignUp throws an error', async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.resendSignUp.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestSignUpResendPhone(resendPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(Auth.resendSignUp).toBeCalledWith(resendPayload.email);
    });

    it('creates the correct actions with the correct payloads', async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.resendSignUp.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestSignUpResendPhone(resendPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(Auth.resendSignUp).toBeCalledWith(resendPayload.email);
    });
  });
});
