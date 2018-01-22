import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Auth } from 'aws-amplify';

import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesAuth,
  codeTypeNames,
} from '../../../Constants/dataConstantsAuth';
import {
  actionTypes as actionTypesAccount,
  statusNames,
  fieldNames,
} from '../../../Constants/dataConstantsAccount';
import requestLogout from '../../dataThunkAuth/requestLogout';
import requestAWSUser from '../../dataThunkAWS/requestAWSUser';
import loadAWSFields from '../loadAWSFields';

jest.mock('aws-amplify', () => ({
  Auth: {
    userAttributes: jest.fn(),
  },
}));
jest.mock('../../dataThunkAuth/requestLogout', () => jest.fn());
jest.mock('../../dataThunkAWS/requestAWSUser', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const userObject = { user: { test: 'testUser' } };
const fields = [
  {
    Name: 'name',
    Value: 'testName',
  },
  {
    Name: 'email',
    Value: 'test@test.com',
  },
  {
    Name: 'custom:email_additional',
    Value: 'test2@test.com',
  },
  {
    Name: 'phone_number',
    Value: '+12395550000',
  },
  {
    Name: 'phone_number_verified',
    Value: 'true',
  },
  {
    Name: 'custom:email_ver',
    Value: 'true',
  },
];

describe('dataThunkAccount', () => {
  describe('loadAWSFields', () => {
    afterEach(() => {
      requestAWSUser.mockReset();
      Auth.userAttributes.mockReset();
      requestLogout.mockReset();
    });

    it("calls requestAWSUser when missing 'user' object in state", async () => {
      const store = mockStore({ data: { aws: initialStateAWS, account: initialStateAccount } });

      requestAWSUser.mockReturnValue(() => Promise.resolve(userObject));
      Auth.userAttributes.mockReturnValue(Promise.resolve(fields));

      await store.dispatch(loadAWSFields());

      expect(requestAWSUser).toBeCalled();
      expect(Auth.userAttributes).toBeCalledWith(userObject.user);
      expect(requestLogout).not.toBeCalled();
    });

    it('fails and returns promise reject when requestAWSUser throws an error', async () => {
      const store = mockStore({ data: { aws: initialStateAWS, account: initialStateAccount } });

      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.AWS_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.AWS_FIELDS,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      const error = { code: 'testError', message: 'testMessage' };

      requestAWSUser.mockReturnValue(() => Promise.reject(error));

      try {
        await store.dispatch(loadAWSFields());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).toBeCalled();
      expect(Auth.userAttributes).not.toBeCalled();
      expect(requestLogout).not.toBeCalled();
    });

    it("calls requestLogout when Auth.userAttributes throws 'NotAuthorizedException' error", async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      const error = { code: 'NotAuthorizedException', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.AWS_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.AWS_FIELDS,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.userAttributes.mockReturnValue(Promise.reject(error));
      requestLogout.mockReturnValue(() => null);

      try {
        await store.dispatch(loadAWSFields());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(null);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(Auth.userAttributes).toBeCalledWith(userObject.user);
      expect(requestLogout).toBeCalled();
    });

    it('fails and returns promise reject when Auth.userAttributes throws an error', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
      stateBeforeAWS.user = userObject.user;

      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      const error = { code: 'testError', message: 'testMessage' };
      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.AWS_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.AWS_FIELDS,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      Auth.userAttributes.mockReturnValue(Promise.reject(error));

      try {
        await store.dispatch(loadAWSFields());
      } catch (errorCatch) {
        expect(errorCatch).toEqual(error);
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.userAttributes).toBeCalledWith(userObject.user);
      expect(requestLogout).not.toBeCalled();
    });

    it('creates the correct actions with the correct payloads', async () => {
      const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));

      stateBeforeAWS.user = userObject.user;
      const store = mockStore({ data: { aws: stateBeforeAWS, account: initialStateAccount } });

      const fieldsPayload = {};
      fields.forEach((field) => {
        switch (field.Name) {
          case 'name':
            fieldsPayload[fieldNames.NAME] = {
              id: fieldNames.NAME,
              value: field.Value,
            };
            break;
          case 'email':
            fieldsPayload[fieldNames.EMAIL] = {
              id: fieldNames.EMAIL,
              value: field.Value,
            };
            break;
          case 'custom:email_additional':
            fieldsPayload[fieldNames.EMAIL_ADDITIONAL] = {
              id: fieldNames.EMAIL_ADDITIONAL,
              value: field.Value,
            };
            break;
          case 'phone_number': {
            fieldsPayload[fieldNames.PHONE] = {
              id: fieldNames.PHONE,
              value: field.Value,
            };
            break;
          }
          default:
            break;
        }
      });

      const expectedActions = [
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.AWS_FIELDS,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_PHONE,
            needed: false,
          },
        },
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_EMAIL,
            needed: false,
          },
        },
        {
          type: actionTypesAccount.SET_FIELDS,
          payload: fieldsPayload,
        },
        {
          type: actionTypesAccount.SET_ACCOUNT_STATUS,
          payload: {
            id: statusNames.AWS_FIELDS,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      Auth.userAttributes.mockReturnValue(Promise.resolve(fields));

      const result = await store.dispatch(loadAWSFields());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestAWSUser).not.toBeCalled();
      expect(Auth.userAttributes).toBeCalledWith(userObject.user);
      expect(requestLogout).not.toBeCalled();
    });
  });
});
