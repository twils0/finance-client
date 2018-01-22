import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesAuth,
  statusNames,
  codeTypeNames,
} from '../../../Constants/dataConstantsAuth';
import requestSignUpConfirmPhone from '../requestSignUpConfirmPhone';
import requestVerifyFieldConfirm from '../requestVerifyFieldConfirm';

jest.mock('aws-amplify', () => ({
  Auth: {
    confirmSignUp: jest.fn(),
  },
}));
jest.mock('../requestVerifyFieldConfirm', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const signUpConfirmPayload = {
  email: 'testEmail',
  code: '123456',
};

describe('dataThunkAuth', () => {
  describe('requestSignUpConfirmPhone', () => {
    afterEach(() => {
      Auth.confirmSignUp.mockReset();
      requestVerifyFieldConfirm.mockReset();
    });

    it("fails and throws an error when missing 'email' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const emptyPayload = {};

      try {
        await store.dispatch(requestSignUpConfirmPhone(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(Auth.confirmSignUp).not.toBeCalled();
      expect(requestVerifyFieldConfirm).not.toBeCalled();
    });

    it("fails when provided a payload with an 'code' key that is not an object", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      Auth.confirmSignUp.mockReturnValue(Promise.resolve());

      const wrongPayload = { email: 'testEmail' };

      try {
        await store.dispatch(requestSignUpConfirmPhone(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(Auth.confirmSignUp).not.toBeCalled();
      expect(requestVerifyFieldConfirm).not.toBeCalled();
    });

    it("fails and requestVerifyFieldConfirm throws an error, when in turn axios throws 'NotAuthorizedException' error, containing 'UNCONFIRMED' in the message", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const error = { code: 'NotAuthorizedException', message: 'testMessage UNCONFIRMED' };
      const error2 = {
        field: 'phone_number',
        error: { code: 'testError', message: 'testMessage' },
      };
      const verifyPayload = {
        field: 'phone_number',
        code: signUpConfirmPayload.code,
      };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.confirmSignUp.mockReturnValue(Promise.reject(error));
      requestVerifyFieldConfirm.mockReturnValue(() => Promise.reject(error2));

      try {
        await store.dispatch(requestSignUpConfirmPhone(signUpConfirmPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error2.error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(Auth.confirmSignUp).toBeCalledWith(
        signUpConfirmPayload.email,
        signUpConfirmPayload.code,
      );
      expect(requestVerifyFieldConfirm).toBeCalledWith(verifyPayload);
    });

    it("calls requestVerifyFieldConfirm when axios throws 'NotAuthorizedException' error, containing 'UNCONFIRMED' in the message", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const error = { code: 'NotAuthorizedException', message: 'testMessage UNCONFIRMED' };
      const verifyPayload = {
        field: 'phone_number',
        code: signUpConfirmPayload.code,
      };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_PHONE_CODE,
            needed: false,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.confirmSignUp.mockReturnValue(Promise.reject(error));
      requestVerifyFieldConfirm.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(requestSignUpConfirmPhone(signUpConfirmPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(Auth.confirmSignUp).toBeCalledWith(
        signUpConfirmPayload.email,
        signUpConfirmPayload.code,
      );
      expect(requestVerifyFieldConfirm).toBeCalledWith(verifyPayload);
    });

    it('fails and returns promise reject when Auth.confirmSignUp throws an error', async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.confirmSignUp.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestSignUpConfirmPhone(signUpConfirmPayload));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(Auth.confirmSignUp).toBeCalledWith(
        signUpConfirmPayload.email,
        signUpConfirmPayload.code,
      );
      expect(requestVerifyFieldConfirm).not.toBeCalled();
    });

    it('creates the correct actions with the correct payloads', async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_PHONE_CODE,
            needed: false,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_PHONE_CODE,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.confirmSignUp.mockReturnValue(Promise.resolve());

      const result = await store.dispatch(requestSignUpConfirmPhone(signUpConfirmPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(Auth.confirmSignUp).toBeCalledWith(
        signUpConfirmPayload.email,
        signUpConfirmPayload.code,
      );
      expect(requestVerifyFieldConfirm).not.toBeCalled();
    });
  });
});
