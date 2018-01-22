import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { codeTypeNames } from '../../../Constants/dataConstantsAuth';
import { fieldNames } from '../../../Constants/dataConstantsAccount';
import { errorMessages } from '../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import requestLoginMFA from '../../dataThunkAuth/requestLoginMFA';
import firstButtonCodeMFAPhone from '../firstButtonCodeMFAPhone';

jest.mock('../../dataThunkAuth/requestLoginMFA', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const code = '123456';
const emailAdditional = 'test@test.com';

describe('uiThunkExternal', () => {
  describe('firstButtonCodeMFAPhone', () => {
    afterEach(() => {
      requestLoginMFA.mockReset();
    });

    it('creates the correct actions with the correct payload, no code', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      const codeCodeMFAPhone = forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];

      const payloadCodeCodeMFAPhone = JSON.parse(JSON.stringify(codeCodeMFAPhone));

      payloadCodeCodeMFAPhone.errorMessage = errorMessages.NO_CONFIRMATION_CODE_PHONE;

      const store = mockStore({
        data: { auth: initialStateAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeMFAPhone,
        },
      ];

      const result = await store.dispatch(firstButtonCodeMFAPhone());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with the correct payload, phone and email needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = true;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = true;
      codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;

      forms[formNames.CODE_MFA_PHONE].inputs[
        inputNames[formNames.CODE_MFA_PHONE].CODE
      ].value = code;

      const codeCodeMFAPhone = forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];

      const payloadCodeCodeMFAPhone = JSON.parse(JSON.stringify(codeCodeMFAPhone));

      payloadCodeCodeMFAPhone.value = '';
      payloadCodeCodeMFAPhone.errorMessage = '';

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.CODE_VERIFY_PHONE,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeMFAPhone,
        },
      ];

      requestLoginMFA.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonCodeMFAPhone());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLoginMFA).toBeCalledWith({
        code,
      });
    });

    it('creates the correct actions with the correct payload, email needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = true;
      codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;

      forms[formNames.CODE_MFA_PHONE].inputs[
        inputNames[formNames.CODE_MFA_PHONE].CODE
      ].value = code;

      const codeCodeMFAPhone = forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];

      const payloadCodeCodeMFAPhone = JSON.parse(JSON.stringify(codeCodeMFAPhone));

      payloadCodeCodeMFAPhone.value = '';
      payloadCodeCodeMFAPhone.errorMessage = '';

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.CODE_VERIFY_EMAIL,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeMFAPhone,
        },
      ];

      requestLoginMFA.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonCodeMFAPhone());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLoginMFA).toBeCalledWith({
        code,
      });
    });

    it('creates the correct actions with the correct payload, email additional needed amd email additional not blank', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = true;

      stateBeforeAccount.fields[fieldNames.EMAIL_ADDITIONAL].value = emailAdditional;

      forms[formNames.CODE_MFA_PHONE].inputs[
        inputNames[formNames.CODE_MFA_PHONE].CODE
      ].value = code;

      const codeCodeMFAPhone = forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];

      const payloadCodeCodeMFAPhone = JSON.parse(JSON.stringify(codeCodeMFAPhone));

      payloadCodeCodeMFAPhone.value = '';
      payloadCodeCodeMFAPhone.errorMessage = '';

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: stateBeforeAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.CODE_VERIFY_EMAIL,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeMFAPhone,
        },
      ];

      requestLoginMFA.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonCodeMFAPhone());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLoginMFA).toBeCalledWith({
        code,
      });
    });

    it('creates the correct actions with the correct payload, email additional needed amd email additional blank', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = true;

      forms[formNames.CODE_MFA_PHONE].inputs[
        inputNames[formNames.CODE_MFA_PHONE].CODE
      ].value = code;

      const codeCodeMFAPhone = forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];

      const payloadCodeCodeMFAPhone = JSON.parse(JSON.stringify(codeCodeMFAPhone));

      payloadCodeCodeMFAPhone.value = '';
      payloadCodeCodeMFAPhone.errorMessage = '';

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: stateBeforeAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.DEVICE,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeMFAPhone,
        },
      ];

      requestLoginMFA.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonCodeMFAPhone());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLoginMFA).toBeCalledWith({
        code,
      });
    });

    it('creates the correct actions with the correct payload, phone and email not needed', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;

      forms[formNames.CODE_MFA_PHONE].inputs[
        inputNames[formNames.CODE_MFA_PHONE].CODE
      ].value = code;

      const codeCodeMFAPhone = forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];

      const payloadCodeCodeMFAPhone = JSON.parse(JSON.stringify(codeCodeMFAPhone));

      payloadCodeCodeMFAPhone.value = '';
      payloadCodeCodeMFAPhone.errorMessage = '';

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.DEVICE,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCodeCodeMFAPhone,
        },
      ];

      requestLoginMFA.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonCodeMFAPhone());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLoginMFA).toBeCalledWith({
        code,
      });
    });

    it("requestLoginMFA throws error a 'LimitExceededException' error", async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;

      forms[formNames.CODE_MFA_PHONE].inputs[
        inputNames[formNames.CODE_MFA_PHONE].CODE
      ].value = code;

      const codeCodeMFAPhone = forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];

      const errorPayloadCodeCodeMFAPhone = JSON.parse(JSON.stringify(codeCodeMFAPhone));

      errorPayloadCodeCodeMFAPhone.errorMessage = errorMessages.LIMIT_EXCEEDED;

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'LimitExceededException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadCodeCodeMFAPhone,
        },
      ];

      requestLoginMFA.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonCodeMFAPhone());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLoginMFA).toBeCalledWith({
        code,
      });
    });

    it("requestLoginMFA throws a 'ExpiredCodeException' error", async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;

      forms[formNames.CODE_MFA_PHONE].inputs[
        inputNames[formNames.CODE_MFA_PHONE].CODE
      ].value = code;

      const codeCodeMFAPhone = forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];

      const errorPayloadCodeCodeMFAPhone = JSON.parse(JSON.stringify(codeCodeMFAPhone));

      errorPayloadCodeCodeMFAPhone.errorMessage = errorMessages.EXPIRED_CONFIRMATION_CODE;

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'ExpiredCodeException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadCodeCodeMFAPhone,
        },
      ];

      requestLoginMFA.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonCodeMFAPhone());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLoginMFA).toBeCalledWith({
        code,
      });
    });

    it("requestLoginMFA throws a 'CodeMismatchException' error", async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;

      forms[formNames.CODE_MFA_PHONE].inputs[
        inputNames[formNames.CODE_MFA_PHONE].CODE
      ].value = code;

      const codeCodeMFAPhone = forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];

      const errorPayloadCodeCodeMFAPhone = JSON.parse(JSON.stringify(codeCodeMFAPhone));

      errorPayloadCodeCodeMFAPhone.errorMessage = errorMessages.INVALID_CONFIRMATION_CODE;

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'CodeMismatchException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadCodeCodeMFAPhone,
        },
      ];

      requestLoginMFA.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonCodeMFAPhone());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLoginMFA).toBeCalledWith({
        code,
      });
    });

    it('requestLoginMFA throws an unexpected error', async () => {
      const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { codeTypes } = stateBeforeAuth;
      const { forms } = stateBeforeUIExternal;

      codeTypes[codeTypeNames.VERIFY_PHONE].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL].needed = false;
      codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed = false;

      forms[formNames.CODE_MFA_PHONE].inputs[
        inputNames[formNames.CODE_MFA_PHONE].CODE
      ].value = code;

      const codeCodeMFAPhone = forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];

      const errorPayloadCodeCodeMFAPhone = JSON.parse(JSON.stringify(codeCodeMFAPhone));

      errorPayloadCodeCodeMFAPhone.errorMessage = errorMessages.INTERNAL_ERROR;

      const store = mockStore({
        data: { auth: stateBeforeAuth, account: initialStateAccount },
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'testCode',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadCodeCodeMFAPhone,
        },
      ];

      requestLoginMFA.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonCodeMFAPhone());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestLoginMFA).toBeCalledWith({
        code,
      });
    });
  });
});
