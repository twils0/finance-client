import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAccount } from '../../../Reducers/dataReducersAccount';
import { initialState as initialStateUIAccount } from '../../../Reducers/uiReducersAccount';
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
import handleCancel from '../handleCancel';
import firstButtonBilling from '../firstButtonBilling';

jest.mock('../../dataThunkAccount/requestUpdateStripeFields', () => jest.fn());
jest.mock('../handleCancel', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const stripeElement = { test: 'testStripeElement' };
const billingPayload = {
  stripeElement,
  resetStripeElement: jest.fn(),
};

describe('uiThunkAccount', () => {
  describe('firstButtonBilling', () => {
    afterEach(() => {
      handleCancel.mockReset();
      requestUpdateStripeFields.mockReset();
    });

    it("fails and throws an error when missing 'stripeElement' key in payload", async () => {
      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: initialStateUIAccount } },
      });

      const emptyPayload = {};
      const expectedActions = [];

      try {
        await store.dispatch(firstButtonBilling(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it("fails and throws an error when missing 'resetStripeElement' key in payload", async () => {
      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: initialStateUIAccount } },
      });

      const wrongPayload = { stripeElement };
      const expectedActions = [];

      try {
        await store.dispatch(firstButtonBilling(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('creates the correct actions with the correct payload, when second button not visible', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      forms[formNames.BILLING].edit = false;
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
            id: formNames.BILLING,
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

      const result = await store.dispatch(firstButtonBilling(billingPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with the correct payload, when second button visible, no name on card and stripe error message', async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      buttons[buttonNames.SECOND].visible = true;

      const stripeErrorMessage = 'testStripeErrorMessage';
      forms[formNames.BILLING].inputs[
        inputNames[formNames.BILLING].STRIPE
      ].value = stripeErrorMessage;

      const billingNameOnCard =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
      const billingPromoCode =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];
      const billingStripe = forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE];

      const payloadBillingNameOnCard = JSON.parse(JSON.stringify(billingNameOnCard));
      const payloadBillingStripe = JSON.parse(JSON.stringify(billingStripe));

      payloadBillingNameOnCard.errorMessage = errorMessages.NO_NAME_ON_CARD;
      payloadBillingStripe.errorMessage = stripeErrorMessage;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadBillingNameOnCard,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: billingPromoCode,
        },
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: payloadBillingStripe,
        },
      ];

      const result = await store.dispatch(firstButtonBilling(billingPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
    });

    it('creates the correct actions with the correct payload, when second button visible, everything matches and stripe complete', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;
      const { fields } = stateBeforeAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD].value =
        'testName';
      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE].value =
        'testPromoCode';
      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE].value = 'complete';

      const billingNameOnCard =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
      const billingPromoCode =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];

      fields[fieldNames.NAME_ON_CARD].value = billingNameOnCard.value;
      fields[fieldNames.PROMO_CODE].value = billingPromoCode.value;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [];

      requestUpdateStripeFields.mockReturnValue(() => Promise.resolve());
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonBilling(billingPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).toBeCalledWith({
        name: billingNameOnCard.value,
        element: billingPayload.stripeElement,
      });
      expect(billingPayload.resetStripeElement).toBeCalled();
      expect(handleCancel).toBeCalled();
    });

    it('creates the correct actions with the correct payload, when second button visible, name does not match, promo code matches, and stripe complete', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;
      const { fields } = stateBeforeAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD].value =
        'testName';
      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE].value =
        'testPromoCode';
      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE].value = 'complete';

      const billingNameOnCard =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
      const billingPromoCode =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];

      fields[fieldNames.PROMO_CODE].value = billingPromoCode.value;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesAccount.SET_FIELD,
          payload: {
            id: fieldNames.NAME_ON_CARD,
            value: billingNameOnCard.value,
          },
        },
      ];

      requestUpdateStripeFields.mockReturnValue(() => Promise.resolve());
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonBilling(billingPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).toBeCalledWith({
        name: billingNameOnCard.value,
        element: billingPayload.stripeElement,
      });
      expect(billingPayload.resetStripeElement).toBeCalled();
      expect(handleCancel).toBeCalled();
    });

    it('creates the correct actions with the correct payload, when second button visible, name matches, promo code does not match, and stripe complete', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;
      const { fields } = stateBeforeAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD].value =
        'testName';
      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE].value =
        'testPromoCode';
      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE].value = 'complete';

      const billingNameOnCard =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
      const billingPromoCode =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];

      fields[fieldNames.NAME_ON_CARD].value = billingNameOnCard.value;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesAccount.SET_FIELD,
          payload: {
            id: fieldNames.PROMO_CODE,
            value: billingPromoCode.value,
          },
        },
      ];

      requestUpdateStripeFields.mockReturnValue(() => Promise.resolve());
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonBilling(billingPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).toBeCalledWith({
        name: billingNameOnCard.value,
        promoCode: billingPromoCode.value,
        element: billingPayload.stripeElement,
      });
      expect(billingPayload.resetStripeElement).toBeCalled();
      expect(handleCancel).toBeCalled();
    });

    it("requestUpdateStripeFields throws 'coupon_invalid' error", async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;
      const { fields } = stateBeforeAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD].value =
        'testName';
      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE].value =
        'testPromoCode';
      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE].value = 'complete';

      const billingNameOnCard =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
      const billingPromoCode =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];

      const errorPayloadBillingPromoCode = JSON.parse(JSON.stringify(billingPromoCode));

      fields[fieldNames.NAME_ON_CARD].value = billingNameOnCard.value;

      errorPayloadBillingPromoCode.errorMessage = errorMessages.PROMO_CODE_INVALID;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const error = {
        code: 'coupon_invalid',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadBillingPromoCode,
        },
      ];

      requestUpdateStripeFields.mockReturnValue(() => Promise.reject(error));
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonBilling(billingPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).toBeCalledWith({
        name: billingNameOnCard.value,
        promoCode: billingPromoCode.value,
        element: billingPayload.stripeElement,
      });
      expect(handleCancel).not.toBeCalled();
    });

    it('requestUpdateStripeFields throws error from stripe with error.raw.message format', async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;
      const { fields } = stateBeforeAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD].value =
        'testName';
      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE].value =
        'testPromoCode';

      const billingNameOnCard =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
      const billingPromoCode =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];
      const billingStripe = forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE];

      const errorPayloadBillingStripe = JSON.parse(JSON.stringify(billingStripe));

      fields[fieldNames.NAME_ON_CARD].value = billingNameOnCard.value;

      const error = {
        raw: {
          code: 'testCode',
          message: 'testMessage',
        },
      };

      errorPayloadBillingStripe.value = error.raw.message;
      errorPayloadBillingStripe.errorMessage = error.raw.message;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadBillingStripe,
        },
      ];

      requestUpdateStripeFields.mockReturnValue(() => Promise.reject(error));
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonBilling(billingPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).toBeCalledWith({
        promoCode: billingPromoCode.value,
      });
      expect(handleCancel).not.toBeCalled();
    });

    it("requestUpdateStripeFields throws 'coupon_invalid' error", async () => {
      const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;
      const { fields } = stateBeforeAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD].value =
        'testName';
      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE].value =
        'testPromoCode';

      const billingNameOnCard =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
      const billingPromoCode =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];

      const errorPayloadBillingPromoCode = JSON.parse(JSON.stringify(billingPromoCode));

      fields[fieldNames.NAME_ON_CARD].value = billingNameOnCard.value;

      errorPayloadBillingPromoCode.errorMessage = errorMessages.PROMO_CODE_EXPIRED;

      const store = mockStore({
        data: { account: stateBeforeAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const error = {
        code: 'coupon_expired',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadBillingPromoCode,
        },
      ];

      requestUpdateStripeFields.mockReturnValue(() => Promise.reject(error));
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonBilling(billingPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).toBeCalledWith({
        promoCode: billingPromoCode.value,
      });
      expect(handleCancel).not.toBeCalled();
    });

    it("requestUpdateStripeFields throws 'coupon_invalid' error", async () => {
      const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
      const { forms, buttons } = stateBeforeUIAccount;

      buttons[buttonNames.SECOND].visible = true;

      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].NAME_ON_CARD].value =
        'testName';
      forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE].value =
        'testPromoCode';

      const billingPromoCode =
        forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE];
      const billingStripe = forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE];

      const errorPayloadBillingStripe = JSON.parse(JSON.stringify(billingStripe));

      errorPayloadBillingStripe.errorMessage = errorMessages.INTERNAL_ERROR;

      const store = mockStore({
        data: { account: initialStateAccount },
        ui: { internal: { account: stateBeforeUIAccount } },
      });

      const error = {
        code: 'testCode',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
          payload: errorPayloadBillingStripe,
        },
      ];

      requestUpdateStripeFields.mockReturnValue(() => Promise.reject(error));
      handleCancel.mockReturnValue(() => null);

      const result = await store.dispatch(firstButtonBilling(billingPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestUpdateStripeFields).toBeCalledWith({
        promoCode: billingPromoCode.value,
      });
      expect(handleCancel).not.toBeCalled();
    });
  });
});
