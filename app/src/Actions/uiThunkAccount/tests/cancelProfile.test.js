import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
import { fieldNames } from '../../../Constants/dataConstantsAccount';
import {
  actionTypes as actionTypesUIAccount,
  buttonNames,
  buttonTexts,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsAccount';
import cancelProfile from '../cancelProfile';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const name = 'testName';
const email = 'test1@test.com';
const emailAdditional = 'test2@test.com';
const E164Phone = '+12395550000';
const formattedPhone = '239-555-0000';

describe('uiThunkAccount', () => {
  describe('cancelProfile', () => {
    it('creates the correct actions with blank payloads, edit true, button first update, button second visible, values do not match fields, no errorMessages present', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { fields } = stateBeforeAccount;
      const { forms, buttons } = stateBeforeUIAccount;

      fields[fieldNames.NAME].value = name;
      fields[fieldNames.EMAIL].value = email;
      fields[fieldNames.EMAIL_ADDITIONAL].value = emailAdditional;
      fields[fieldNames.PHONE].value = E164Phone;

      forms[formNames.PROFILE].edit = true;
      buttons[buttonNames.FIRST].text = buttonTexts.UPDATE;
      buttons[buttonNames.SECOND].visible = true;

      const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
      const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
      const profileEmailAdditional =
        forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];
      const profilePhone = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE];

      const payloadProfileName = JSON.parse(JSON.stringify(profileName));
      const payloadProfileEmail = JSON.parse(JSON.stringify(profileEmail));
      const payloadProfileEmailAdditional = JSON.parse(JSON.stringify(profileEmailAdditional));
      const payloadProfilePhone = JSON.parse(JSON.stringify(profilePhone));

      payloadProfileName.value = name;
      payloadProfileEmail.value = email;
      payloadProfileEmailAdditional.value = emailAdditional;
      payloadProfilePhone.value = formattedPhone;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_FORM_EDIT,
          payload: {
            id: formNames.PROFILE,
            edit: false,
          },
        },
        {
          type: actionTypesUIAccount.SET_BUTTON_TEXT,
          payload: {
            id: buttonNames.FIRST,
            text: buttonTexts.EDIT,
          },
        },
        {
          type: actionTypesUIAccount.SET_BUTTON_VISIBLE,
          payload: {
            id: buttonNames.SECOND,
            visible: false,
          },
        },
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

      const result = store.dispatch(cancelProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with blank payloads, values match fields, errorMessages present', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { fields } = stateBeforeAccount;
      const { forms } = stateBeforeUIAccount;

      fields[fieldNames.NAME].value = name;
      fields[fieldNames.EMAIL].value = email;
      fields[fieldNames.EMAIL_ADDITIONAL].value = emailAdditional;
      fields[fieldNames.PHONE].value = E164Phone;

      const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
      const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
      const profileEmailAdditional =
        forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];
      const profilePhone = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE];

      profileName.value = name;
      profileEmail.value = email;
      profileEmailAdditional.value = emailAdditional;
      profilePhone.value = formattedPhone;

      const payloadProfileName = JSON.parse(JSON.stringify(profileName));
      const payloadProfileEmail = JSON.parse(JSON.stringify(profileEmail));
      const payloadProfileEmailAdditional = JSON.parse(JSON.stringify(profileEmailAdditional));
      const payloadProfilePhone = JSON.parse(JSON.stringify(profilePhone));

      profileName.errorMessage = 'testError';
      profileEmail.errorMessage = 'testError';
      profileEmailAdditional.errorMessage = 'testError';
      profilePhone.errorMessage = 'testError';

      const store = mockStore({
        data: { account: stateBeforeAccount },
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

      const result = store.dispatch(cancelProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates no actions, when unnecessary', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { fields } = stateBeforeAccount;
      const { forms } = stateBeforeUIAccount;

      fields[fieldNames.NAME].value = name;
      fields[fieldNames.EMAIL].value = email;
      fields[fieldNames.EMAIL_ADDITIONAL].value = emailAdditional;
      fields[fieldNames.PHONE].value = E164Phone;

      const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
      const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
      const profileEmailAdditional =
        forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];
      const profilePhone = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE];

      profileName.value = name;
      profileEmail.value = email;
      profileEmailAdditional.value = emailAdditional;
      profilePhone.value = formattedPhone;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [];

      const result = store.dispatch(cancelProfile());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });
  });
});
