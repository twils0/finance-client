/**
 * @jest-environment node
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import { pathNames } from '../../../Constants/universalConstants';
import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { actionTypes as actionTypesAuth } from '../../../Constants/dataConstantsAuth';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import requestSignOutOtherDevices from '../../dataThunkAuth/requestSignOutOtherDevices';
import secondButtonDevice from '../secondButtonDevice';

const history = {
  replace: jest.fn(),
};
const setSecurity = jest.fn();

global.window = {
  sessionStorage: {
    setSecurity,
  },
};
jest.mock('../../dataThunkAuth/requestSignOutOtherDevices', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const email = 'test@test.com';
const password = 'testPassword1!';
const remembered = false;

describe('uiThunkAccount', () => {
  describe('secondButtonDevice', () => {
    afterEach(() => {
      requestSignOutOtherDevices.mockReset();
      setSecurity.mockReset();
      history.replace.mockReset();
    });

    it("fails and throws an error when missing 'history' key in payload", async () => {
      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { external: initialStateUIExternal },
      });

      const emptyPayload = {};
      const expectedActions = [];

      try {
        await store.dispatch(secondButtonDevice(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('creates the correct actions with the correct payload', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadLoginEmail = JSON.parse(JSON.stringify(loginEmail));
      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadLoginEmail.value = '';
      payloadLoginEmail.errorMessage = '';

      payloadLoginPassword.value = '';
      payloadLoginPassword.errorMessage = '';

      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesAuth.SET_AUTHENTICATED,
          payload: {
            authenticated: true,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadLoginPassword,
        },
      ];

      requestSignOutOtherDevices.mockReturnValue(() => Promise.resolve());

      const startDate = new Date('1/2/2000');
      const incrementDate = new Date('1/2/2000');
      const expectDate = new Date(incrementDate.setMinutes(incrementDate.getMinutes() + 30));

      MockDate.set(startDate);
      const result = await store.dispatch(secondButtonDevice({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignOutOtherDevices).toBeCalledWith({
        email,
        password,
        remembered,
      });
      expect(setSecurity).toBeCalledWith('sessionTime', expectDate);

      MockDate.reset();
    });

    it('requestSignOutOtherDevices throws an unexpected error, redirects to login', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL].value = email;
      forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD].value = password;

      const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
      const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

      const payloadLoginEmail = JSON.parse(JSON.stringify(loginEmail));
      const payloadLoginPassword = JSON.parse(JSON.stringify(loginPassword));

      payloadLoginEmail.value = '';
      payloadLoginEmail.errorMessage = '';

      payloadLoginPassword.value = '';
      payloadLoginPassword.errorMessage = '';

      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'testCode',
        message: 'testMessage',
      };
      const expectedActions = [];

      requestSignOutOtherDevices.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(secondButtonDevice({ history }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignOutOtherDevices).toBeCalledWith({
        email,
        password,
        remembered,
      });
      expect(setSecurity).not.toBeCalled();
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
    });
  });
});
