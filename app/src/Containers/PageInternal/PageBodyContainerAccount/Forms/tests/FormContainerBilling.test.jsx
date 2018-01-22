import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { StripeProvider, Elements, injectStripe } from 'react-stripe-elements';

import { initialState as initialStateAccount } from '../../../../../Reducers/dataReducersAccount';
import { initialState as initialStateUIApp } from '../../../../../Reducers/uiReducersApp';
import { initialState as initialStateUIAccount } from '../../../../../Reducers/uiReducersAccount';
import { requestStatusTypes } from '../../../../../Constants/universalConstants';
import { statusNames, fieldNames } from '../../../../../Constants/dataConstantsAccount';
import { errorMessages } from '../../../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIAccount,
  formNames,
  inputNames,
} from '../../../../../Constants/uiConstantsAccount';

import FormContainerBilling from '../FormContainerBilling';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('react-stripe-elements', () => ({
  StripeProvider: jest.fn(() => <div />),
  Elements: jest.fn(() => <div />),
  injectStripe: jest.fn(element => element),
}));

const stripe = { stripeObject: { test: 'testStripe' } };
const stripeRef = jest.fn();
const heightRef = jest.fn();
const setHeight = jest.fn();
const clearElement = jest.fn();
const resetStripeElement = jest.fn();

const nameOnCard = 'testNameOnCard';
const promoCode = 'testPromoCode';

const shallowComponent = store =>
  shallow(
    <FormContainerBilling
      stripeRef={stripeRef}
      heightRef={heightRef}
      setHeight={setHeight}
      clearElement={clearElement}
      resetStripeElement={resetStripeElement}
    />,
    {
      context: {
        store,
      },
    },
  ).dive();

describe('Containers', () => {
  describe('PageInternal', () => {
    describe('PageBodyContainerAccount', () => {
      describe('Forms', () => {
        describe('FormContainerBilling', () => {
          afterEach(() => {
            StripeProvider.mockReset();
            Elements.mockReset();
            stripeRef.mockReset();
            heightRef.mockReset();
            setHeight.mockReset();
            clearElement.mockReset();
            resetStripeElement.mockReset();
            injectStripe.mockReset();
          });

          it('shallow renders correctly', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            stateBeforeAccount.fields[fieldNames.NAME_ON_CARD].value = nameOnCard;
            stateBeforeAccount.fields[fieldNames.PROMO_CODE].value = promoCode;

            stateBeforeUIApp.stripe = stripe;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                app: stateBeforeUIApp,
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiNameOnCard = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].NAME_ON_CARD]));
            const uiPromoCode = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].PROMO_CODE]));

            uiNameOnCard.value = nameOnCard;
            uiPromoCode.value = promoCode;

            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNameOnCard,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPromoCode,
              },
            ];

            const wrapper = shallowComponent(store);
            const stripeProviderProps = wrapper.find(StripeProvider).props();

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
            expect(setHeight).toBeCalledWith(formNames.BILLING);
            expect(stripeProviderProps.stripe).toEqual(stripe.stripeObject);
          });

          it('shallow renders correctly, with expired promo code, componentWillUpdate, componentDidUpdate, and componentWillUnmount', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            const wrongPromoCode = 'wrongPromoCode';

            stateBeforeAccount.fields[fieldNames.NAME_ON_CARD].value = nameOnCard;
            stateBeforeAccount.fields[fieldNames.PROMO_CODE].value = wrongPromoCode;
            stateBeforeAccount.fields[fieldNames.PROMO_CODE_VALID].value = false;

            stateBeforeUIApp.stripe = stripe;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                app: stateBeforeUIApp,
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiNameOnCard = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].NAME_ON_CARD]));
            const uiPromoCode = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].PROMO_CODE]));

            uiNameOnCard.value = nameOnCard;
            uiPromoCode.value = wrongPromoCode;
            uiPromoCode.errorMessage = errorMessages.PROMO_CODE_EXPIRED;

            const nextProps = {
              statusAccount: {
                [statusNames.UPDATE_STRIPE_FIELDS_REQUEST]: {
                  status: requestStatusTypes.LOADING,
                },
              },
              clearElement,
              resetStripeElement,
            };

            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNameOnCard,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPromoCode,
              },
            ];

            const wrapper = shallowComponent(store);
            const stripeProviderProps = wrapper.find(StripeProvider).props();

            const instance = wrapper.instance();

            instance.componentWillUpdate(nextProps);
            instance.componentDidUpdate();
            instance.componentWillUnmount();

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
            expect(setHeight).toBeCalledWith(formNames.BILLING);
            expect(clearElement).toBeCalledWith(formNames.BILLING);
            expect(resetStripeElement).toBeCalled();
            expect(setHeight).toBeCalledWith(formNames.BILLING);
            expect(clearElement).toBeCalledWith(formNames.BILLING);
            expect(stripeProviderProps.stripe).toEqual(stripe.stripeObject);
            expect(setHeight).toHaveBeenCalledTimes(2);
            expect(clearElement).toHaveBeenCalledTimes(2);
            expect(resetStripeElement).toHaveBeenCalledTimes(1);
          });

          it('shallow renders correctly, with loading indicator', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            stateBeforeAccount.status[statusNames.UPDATE_STRIPE_FIELDS_REQUEST].status =
              requestStatusTypes.LOADING;

            stateBeforeAccount.fields[fieldNames.NAME_ON_CARD].value = nameOnCard;
            stateBeforeAccount.fields[fieldNames.PROMO_CODE].value = promoCode;

            stateBeforeUIApp.stripe = stripe;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                app: stateBeforeUIApp,
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiNameOnCard = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].NAME_ON_CARD]));
            const uiPromoCode = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].PROMO_CODE]));

            uiNameOnCard.value = nameOnCard;
            uiPromoCode.value = promoCode;

            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNameOnCard,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPromoCode,
              },
            ];

            const wrapper = shallowComponent(store);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with no name on card error', async () => {
            const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            stateBeforeUIApp.stripe = stripe;

            forms[formNames.BILLING].inputs[
              inputNames[formNames.BILLING].NAME_ON_CARD
            ].errorMessage =
              errorMessages.NO_NAME_ON_CARD;

            const store = mockStore({
              data: {
                account: initialStateAccount,
              },
              ui: {
                app: stateBeforeUIApp,
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiNameOnCard = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].NAME_ON_CARD]));
            const uiPromoCode = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].PROMO_CODE]));
            const uiNameOnCardChange = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].NAME_ON_CARD]));

            uiNameOnCardChange.value = nameOnCard;
            uiNameOnCardChange.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.BILLING].NAME_ON_CARD,
                value: nameOnCard,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNameOnCard,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPromoCode,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNameOnCardChange,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with promo code invalid error', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            const wrongPromoCode = 'wrongPromoCode';

            stateBeforeAccount.fields[fieldNames.PROMO_CODE].value = wrongPromoCode;

            stateBeforeUIApp.stripe = stripe;

            forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE].errorMessage =
              errorMessages.PROMO_CODE_INVALID;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                app: stateBeforeUIApp,
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiNameOnCard = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].NAME_ON_CARD]));
            const uiPromoCode = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].PROMO_CODE]));
            const uiPromoCodeChange = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].PROMO_CODE]));

            uiPromoCode.value = wrongPromoCode;

            uiPromoCodeChange.value = promoCode;
            uiPromoCodeChange.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.BILLING].PROMO_CODE,
                value: promoCode,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNameOnCard,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPromoCode,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPromoCodeChange,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with promo code expired error', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            const wrongPromoCode = 'wrongPromoCode';

            stateBeforeAccount.fields[fieldNames.PROMO_CODE].value = wrongPromoCode;

            stateBeforeUIApp.stripe = stripe;

            forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].PROMO_CODE].errorMessage =
              errorMessages.PROMO_CODE_EXPIRED;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                app: stateBeforeUIApp,
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiNameOnCard = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].NAME_ON_CARD]));
            const uiPromoCode = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].PROMO_CODE]));
            const uiPromoCodeChange = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].PROMO_CODE]));

            uiPromoCode.value = wrongPromoCode;

            uiPromoCodeChange.value = promoCode;
            uiPromoCodeChange.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.BILLING].PROMO_CODE,
                value: promoCode,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNameOnCard,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPromoCode,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPromoCodeChange,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly and calls handleInputChange, with undefined error', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));
            const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { forms } = stateBeforeUIAccount;

            stateBeforeUIApp.stripe = stripe;

            forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE].value =
              errorMessages.INTERNAL_ERROR;
            forms[formNames.BILLING].inputs[inputNames[formNames.BILLING].STRIPE].errorMessage =
              errorMessages.INTERNAL_ERROR;

            const store = mockStore({
              data: {
                account: stateBeforeAccount,
              },
              ui: {
                app: stateBeforeUIApp,
                internal: {
                  account: stateBeforeUIAccount,
                },
              },
            });

            const uiNameOnCard = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].NAME_ON_CARD]));
            const uiPromoCode = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].PROMO_CODE]));
            const uiStripe = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].STRIPE]));
            const uiStripeChange = JSON.parse(JSON.stringify(forms[formNames.BILLING]
              .inputs[inputNames[formNames.BILLING].STRIPE]));

            uiStripe.value = errorMessages.INTERNAL_ERROR;

            uiStripeChange.value = errorMessages.INTERNAL_ERROR;
            uiStripeChange.errorMessage = '';

            const inputEvent = {
              preventDefault: jest.fn(),
              target: {
                id: inputNames[formNames.BILLING].STRIPE,
                value: errorMessages.INTERNAL_ERROR,
              },
            };
            const expectedActions = [
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiNameOnCard,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiPromoCode,
              },
              {
                type: actionTypesUIAccount.SET_INPUT_VALUE_ERROR,
                payload: uiStripeChange,
              },
            ];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.handleInputChange(inputEvent);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });
        });
      });
    });
  });
});
