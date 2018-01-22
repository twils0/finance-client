import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import {
  actionTypes as actionTypesAuth,
  codeTypeNames,
} from '../../../Constants/dataConstantsAuth';
import { errorMessages } from '../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesAccount,
  fieldNames,
} from '../../../Constants/dataConstantsAccount';
import {
  actionTypes as actionTypesUIAccount,
  buttonNames,
  buttonTexts,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsAccount';
import requestUpdateStripeFields from '../../dataThunkAccount/requestUpdateStripeFields';
import requestUpdateDBFields from '../../dataThunkAccount/requestUpdateDBFields';
import handleCancel from '../handleCancel';
import firstButtonProfile from '../firstButtonProfile';

jest.mock('../../dataThunkAccount/requestUpdateStripeFields', () => jest.fn());
jest.mock('../../dataThunkAccount/requestUpdateDBFields', () => jest.fn());
jest.mock('../handleCancel', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const name = 'testName';
const email = 'test1@test.com';
const emailAdditional = 'test2@test.com';
const phone = '239-555-0000';
const E164Phone = '+12395550000';

describe('uiThunkAccount', () => {
  describe('firstButtonProfile', () => {
    afterEach(() => {
      handleCancel.mockReset();
      requestUpdateStripeFields.mockReset();
      requestUpdateDBFields.mockReset();
    });

    it('creates the correct actions with the correct payload, when second button not visible', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      forms[formNames.PROFILE].edit = false;
      buttons[buttonNames.FIRST].text = buttonTexts.SUBMIT;
      buttons[buttonNames.SECOND].text = buttonTexts.RESET;
      buttons[buttonNames.SECOND].visible = false;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_FORM_EDIT,
          payload: {
            id: formNames.PROFILE,
            edit: true,
          },
        },
        {
          type: actionTypesUIAccount.SET_BUTTON_TEXT,
          payload: {
            id: buttonNames.FIRST,
            text: buttonTexts.UPDATE,
          },
        },
        {
          type: actionTypesUIAccount.SET_BUTTON_TEXT,
          payload: {
            id: buttonNames.SECOND,
            text: buttonTexts.CANCEL,
          },
        },
        {
          type: actionTypesUIAccount.SET_BUTTON_VISIBLE,
          payload: {
            id: buttonNames.SECOND,
            visible: true,
          },
        },
      ];

      const result = await store.dispatch(firstButtonProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with the correct payload, when second button visible, no name, no email, invalid email additional, and no phone', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL].value = 'test';

      const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
      const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
      const profileEmailAdditional = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];
      const profilePhone = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE];

      const payloadProfileName = JSON.parse(JSON.stringify(profileName));
      const payloadProfileEmail = JSON.parse(JSON.stringify(profileEmail));
      const payloadProfileEmailAdditional = JSON.parse(JSON.stringify(profileEmailAdditional));
      const payloadProfilePhone = JSON.parse(JSON.stringify(profilePhone));

      payloadProfileName.errorMessage = errorMessages.NO_NAME;
      payloadProfileEmail.errorMessage = errorMessages.NO_EMAIL;
      payloadProfileEmailAdditional.errorMessage = errorMessages.INVALID_EMAIL;
      payloadProfilePhone.errorMessage = errorMessages.NO_PHONE;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadProfileName,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadProfileEmail,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadProfileEmailAdditional,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadProfilePhone,
        },
      ];

      const result = await store.dispatch(firstButtonProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with the correct payload, when second button visible, invalid email, and invalid mobile phone', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME].value = name;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL].value = 'test';
      forms[formNames.PROFILE].inputs[
        inputNames[formNames.PROFILE].EMAIL_ADDITIONAL
      ].value = emailAdditional;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE].value = '000-000-0000';

      const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
      const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
      const profileEmailAdditional = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];
      const profilePhone = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE];

      const payloadProfileName = JSON.parse(JSON.stringify(profileName));
      const payloadProfileEmail = JSON.parse(JSON.stringify(profileEmail));
      const payloadProfileEmailAdditional = JSON.parse(JSON.stringify(profileEmailAdditional));
      const payloadProfilePhone = JSON.parse(JSON.stringify(profilePhone));

      payloadProfileEmail.errorMessage = errorMessages.INVALID_EMAIL;
      payloadProfilePhone.errorMessage = errorMessages.INVALID_PHONE;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadProfileName,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadProfileEmail,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadProfileEmailAdditional,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadProfilePhone,
        },
      ];

      const result = await store.dispatch(firstButtonProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with the correct payload, when second button visible, everything matches', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;
      const { fields } = stateBeforeAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME].value = name;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL].value = email;
      forms[formNames.PROFILE].inputs[
        inputNames[formNames.PROFILE].EMAIL_ADDITIONAL
      ].value = emailAdditional;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE].value = phone;

      const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
      const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
      const profileEmailAdditional = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];

      fields[fieldNames.NAME].value = profileName.value;
      fields[fieldNames.EMAIL].value = profileEmail.value;
      fields[fieldNames.EMAIL_ADDITIONAL].value = profileEmailAdditional.value;
      fields[fieldNames.PHONE].value = E164Phone;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [];

      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(handleCancel).toBeCalled();
    });

    it('creates the correct actions with the correct payload, when second button visible, name does not match, email matches, email additional does not match, and phone matches', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;
      const { fields } = stateBeforeAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME].value = name;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL].value = email;
      forms[formNames.PROFILE].inputs[
        inputNames[formNames.PROFILE].EMAIL_ADDITIONAL
      ].value = emailAdditional;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE].value = phone;

      const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
      const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
      const profileEmailAdditional = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];

      fields[fieldNames.EMAIL].value = profileEmail.value;
      fields[fieldNames.PHONE].value = E164Phone;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const payload = {
        name: profileName.value,
        emailAdditional: profileEmailAdditional.value,
      };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_EMAIL_ADDITIONAL,
            needed: true,
          },
        },
        {
          type: actionTypesAccount.SET_FIELD,
          payload: {
            id: fieldNames.NAME,
            value: profileName.value,
          },
        },
        {
          type: actionTypesAccount.SET_FIELD,
          payload: {
            id: fieldNames.EMAIL_ADDITIONAL,
            value: profileEmailAdditional.value,
          },
        },
      ];

      requestUpdateDBFields.mockReturnValue(() => Promise.resolve());
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).not.toBeCalled();
      expect(requestUpdateDBFields).toBeCalledWith(payload);
      expect(handleCancel).toBeCalled();
    });

    it('creates the correct actions with the correct payload, when second button visible, name matches, email does not match, email additional matches, and phone matches', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;
      const { fields } = stateBeforeAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME].value = name;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL].value = email;
      forms[formNames.PROFILE].inputs[
        inputNames[formNames.PROFILE].EMAIL_ADDITIONAL
      ].value = emailAdditional;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE].value = phone;

      const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
      const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
      const profileEmailAdditional = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];

      fields[fieldNames.NAME].value = profileName.value;
      fields[fieldNames.EMAIL_ADDITIONAL].value = profileEmailAdditional.value;
      fields[fieldNames.PHONE].value = E164Phone;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const payload = {
        email: profileEmail.value,
      };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_EMAIL,
            needed: true,
          },
        },
        {
          type: actionTypesAccount.SET_FIELD,
          payload: {
            id: fieldNames.EMAIL,
            value: profileEmail.value,
          },
        },
      ];

      requestUpdateStripeFields.mockReturnValue(() => Promise.resolve());
      requestUpdateDBFields.mockReturnValue(() => Promise.resolve());
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).toBeCalledWith(payload);
      expect(requestUpdateDBFields).toBeCalledWith(payload);
      expect(handleCancel).toBeCalled();
    });

    it('creates the correct actions with the correct payload, when second button visible, name matches, email matches, email additional does not match, and phone matches', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;
      const { fields } = stateBeforeAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME].value = name;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL].value = email;
      forms[formNames.PROFILE].inputs[
        inputNames[formNames.PROFILE].EMAIL_ADDITIONAL
      ].value = emailAdditional;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE].value = phone;

      const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
      const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
      const profileEmailAdditional = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];

      fields[fieldNames.NAME].value = profileName.value;
      fields[fieldNames.EMAIL].value = profileEmail.value;
      fields[fieldNames.PHONE].value = E164Phone;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const payload = {
        emailAdditional: profileEmailAdditional.value,
      };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_EMAIL_ADDITIONAL,
            needed: true,
          },
        },
        {
          type: actionTypesAccount.SET_FIELD,
          payload: {
            id: fieldNames.EMAIL_ADDITIONAL,
            value: profileEmailAdditional.value,
          },
        },
      ];

      requestUpdateDBFields.mockReturnValue(() => Promise.resolve());
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).not.toBeCalled();
      expect(requestUpdateDBFields).toBeCalledWith(payload);
      expect(handleCancel).toBeCalled();
    });

    it("requestUpdateDBFields throws 'AliasExistsException' error, when second button visible", async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME].value = name;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL].value = email;
      forms[formNames.PROFILE].inputs[
        inputNames[formNames.PROFILE].EMAIL_ADDITIONAL
      ].value = emailAdditional;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE].value = phone;

      const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
      const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
      const profileEmailAdditional = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];

      const errorPayloadProfileEmail = JSON.parse(JSON.stringify(profileEmail));

      errorPayloadProfileEmail.errorMessage = errorMessages.EMAIL_IN_USE_INTERNAL;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const error = {
        code: 'AliasExistsException',
        message: 'testMessage',
      };
      const payload = {
        name: profileName.value,
        email: profileEmail.value,
        emailAdditional: profileEmailAdditional.value,
        phone: E164Phone,
      };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_EMAIL,
            needed: true,
          },
        },
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_EMAIL_ADDITIONAL,
            needed: true,
          },
        },
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_PHONE,
            needed: true,
          },
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadProfileEmail,
        },
      ];

      requestUpdateStripeFields.mockReturnValue(() => Promise.resolve());
      requestUpdateDBFields.mockReturnValue(() => Promise.reject(error));
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).toBeCalledWith(payload);
      expect(requestUpdateDBFields).toBeCalledWith(payload);
      expect(handleCancel).not.toBeCalled();
    });

    it("requestsUpdateDBFields throws 'UsernameExistsException' error, when second button visible", async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME].value = name;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL].value = email;
      forms[formNames.PROFILE].inputs[
        inputNames[formNames.PROFILE].EMAIL_ADDITIONAL
      ].value = emailAdditional;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE].value = phone;

      const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
      const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
      const profileEmailAdditional = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];

      const errorPayloadProfileEmail = JSON.parse(JSON.stringify(profileEmail));

      errorPayloadProfileEmail.errorMessage = errorMessages.EMAIL_IN_USE_INTERNAL;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const error = {
        code: 'UsernameExistsException',
        message: 'testMessage',
      };
      const payload = {
        name: profileName.value,
        email: profileEmail.value,
        emailAdditional: profileEmailAdditional.value,
        phone: E164Phone,
      };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_EMAIL,
            needed: true,
          },
        },
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_EMAIL_ADDITIONAL,
            needed: true,
          },
        },
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_PHONE,
            needed: true,
          },
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadProfileEmail,
        },
      ];

      requestUpdateStripeFields.mockReturnValue(() => Promise.resolve());
      requestUpdateDBFields.mockReturnValue(() => Promise.reject(error));
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).toBeCalledWith(payload);
      expect(requestUpdateDBFields).toBeCalledWith(payload);
      expect(handleCancel).not.toBeCalled();
    });

    it('requestUpdateDBFields throws an unexpected error, when second button visible', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;
      const { fields } = stateBeforeAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME].value = name;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL].value = email;
      forms[formNames.PROFILE].inputs[
        inputNames[formNames.PROFILE].EMAIL_ADDITIONAL
      ].value = emailAdditional;
      forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE].value = phone;

      const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
      const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
      const profileEmailAdditional = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];
      const profilePhone = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE];

      const errorPayloadProfilePhone = JSON.parse(JSON.stringify(profilePhone));

      fields[fieldNames.EMAIL].value = profileEmail.value;
      fields[fieldNames.EMAIL_ADDITIONAL].value = profileEmailAdditional.value;

      errorPayloadProfilePhone.errorMessage = errorMessages.INTERNAL_ERROR;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const error = {
        code: 'testCode',
        message: 'testMessage',
      };
      const payload = {
        name: profileName.value,
        phone: E164Phone,
      };
      const expectedActions = [
        {
          type: actionTypesAuth.SET_CODE_TYPE,
          payload: {
            id: codeTypeNames.VERIFY_PHONE,
            needed: true,
          },
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadProfilePhone,
        },
      ];

      requestUpdateDBFields.mockReturnValue(() => Promise.reject(error));
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).not.toBeCalled();
      expect(requestUpdateDBFields).toBeCalledWith(payload);
      expect(handleCancel).not.toBeCalled();
    });
  });
});
