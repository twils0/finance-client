import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { requestStatusTypes, URLs, axiosConfig } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import requestVerifyEmailLink from '../requestVerifyEmailLink';

jest.mock('axios', () => ({
  put: jest.fn(),
}));

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const verificationId = '0279bb8a-884f-4f0a-aee8-09038117ddfc';

describe('dataThunkAuth', () => {
  describe('requestVerifyEmailLinkLink', () => {
    afterEach(() => {
      axios.put.mockReset();
    });

    it("fails and throws an error when missing 'match' key in payload", async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const emptyPayload = {};

      try {
        await store.dispatch(requestVerifyEmailLink(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      expect(axios.put).not.toBeCalled();
    });

    it('fails and returns promise reject when axios throws an error', async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_EMAIL_LINK,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_EMAIL_LINK,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(requestVerifyEmailLink({ verificationId }));
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(axios.put).toBeCalledWith(URLs.EMAILS, { verificationId }, axiosConfig.DB);
    });

    it('creates the correct actions with the correct payloads', async () => {
      const store = mockStore({ data: { auth: initialStateAuth } });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_EMAIL_LINK,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.VERIFY_EMAIL_LINK,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      axios.put.mockReturnValue(Promise.resolve(null));

      const result = await store.dispatch(requestVerifyEmailLink({ verificationId }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(axios.put).toBeCalledWith(URLs.EMAILS, { verificationId }, axiosConfig.DB);
    });
  });
});
