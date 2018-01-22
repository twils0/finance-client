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
import cancelBilling from '../cancelBilling';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const nameOnCard = 'testNameOnCard';
const promoCode = 'testPromoCode';

describe('uiThunkAccount', () => {
  describe('cancelBilling', () => {
    it('creates the correct actions with blank payloads, edit true, button first update, button second visible, input values do not match fields, and stripe value present', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { fields } = stateBeforeAccount;
      const { forms, buttons } = stateBeforeUIAccount;

      fields[fieldNames.NAME_ON_CARD].value = nameOnCard;
      fields[fieldNames.PROMO_CODE].value = promoCode;

      forms[formNames.BILLING].edit = true;
      buttons[buttonNames.FIRST].text = buttonTexts.UPDATE;
      buttons[buttonNames.SECOND].visible = true;

      const billingNameOnCard =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
      const billingPromoCode =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];
      const billingStripe = forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE];

      const payloadBillingNameOnCard = JSON.parse(JSON.stringify(billingNameOnCard));
      const payloadBillingPromoCode = JSON.parse(JSON.stringify(billingPromoCode));
      const payloadBillingStripe = JSON.parse(JSON.stringify(billingStripe));

      payloadBillingNameOnCard.value = nameOnCard;
      payloadBillingPromoCode.value = promoCode;
      billingStripe.value = 'testValue';

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_FORM_EDIT,
          payload: {
            id: formNames.BILLING,
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
          payload: payloadBillingNameOnCard,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadBillingPromoCode,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadBillingStripe,
        },
      ];

      const result = store.dispatch(cancelBilling());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with blank payloads, input values match fields, stripe value not present, errorMessages present', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { fields } = stateBeforeAccount;
      const { forms } = stateBeforeUIAccount;

      fields[fieldNames.NAME_ON_CARD].value = nameOnCard;
      fields[fieldNames.PROMO_CODE].value = promoCode;

      const billingNameOnCard =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
      const billingPromoCode =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];
      const billingStripe = forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE];

      billingNameOnCard.value = nameOnCard;
      billingPromoCode.value = promoCode;

      const payloadBillingNameOnCard = JSON.parse(JSON.stringify(billingNameOnCard));
      const payloadBillingPromoCode = JSON.parse(JSON.stringify(billingPromoCode));
      const payloadBillingStripe = JSON.parse(JSON.stringify(billingStripe));

      billingNameOnCard.errorMessage = 'testError';
      billingPromoCode.errorMessage = 'testError';
      billingStripe.errorMessage = 'testError';

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadBillingNameOnCard,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadBillingPromoCode,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadBillingStripe,
        },
      ];

      const result = store.dispatch(cancelBilling());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates no actions with blank payloads, when unnecessary', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { fields } = stateBeforeAccount;
      const { forms } = stateBeforeUIAccount;

      fields[fieldNames.NAME_ON_CARD].value = nameOnCard;
      fields[fieldNames.PROMO_CODE].value = promoCode;

      const billingNameOnCard =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
      const billingPromoCode =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];

      billingNameOnCard.value = nameOnCard;
      billingPromoCode.value = promoCode;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [];

      const result = store.dispatch(cancelBilling());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });
  });
});
