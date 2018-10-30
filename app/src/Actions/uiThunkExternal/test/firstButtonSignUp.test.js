import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { requestStatusTypes, pathNames } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesAuth, statusNames } from '../../../Constants/dataConstantsAuth';
import { errorMessages } from '../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import requestSignUp from '../../dataThunkAuth/requestSignUp';
import firstButtonSignUp from '../firstButtonSignUp';

const history = {
  replace: jest.fn(),
};
jest.mock('../../dataThunkAuth/requestSignUp', () => jest.fn());

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const stripeElement = { test: 'testStripeElement' };
const signUpPayload = {
  history,
  stripeElement,
  resetStripeElement: jest.fn(),
};

const element = stripeElement;
const nameOnCard = 'testNameOnCard';
const promoCode = 'testPromoCode';
const name = 'testName';
const email = 'test@test.com';
const phone = '239-555-0000';
const E164Phone = `+1${phone.replace(/[-() ]/g, '')}`;
const password = 'testPassword1!';

describe('uiThunkExternal', () => {
  describe('firstButtonSignUp', () => {
    afterEach(() => {
      requestSignUp.mockReset();
      history.replace.mockReset();
      signUpPayload.resetStripeElement.mockReset();
    });

    it("fails and throws an error when missing 'history' key in payload", async () => {
      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { external: initialStateUIExternal },
      });

      const emptyPayload = {};
      const expectedActions = [];

      try {
        await store.dispatch(firstButtonSignUp(emptyPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it("fails and throws an error when missing 'stripeElement' key in payload", async () => {
      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { external: initialStateUIExternal },
      });

      const wrongPayload = {
        history,
      };
      const expectedActions = [];

      try {
        await store.dispatch(firstButtonSignUp(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it("fails and throws an error when missing 'resetStripeElement' key in payload", async () => {
      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { external: initialStateUIExternal },
      });

      const wrongPayload = {
        history,
        stripeElement,
      };
      const expectedActions = [];

      try {
        await store.dispatch(firstButtonSignUp(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('creates the correct actions with the correct payload, no name on card, stripe not complete, no name, no email, no phone, no password', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      const cardNameOnCard = forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD];
      const cardPromoCode = forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE];
      const cardStripe = forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE];

      const infoName = forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME];
      const infoEmail = forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL];
      const infoPhone = forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE];

      const signUpPassword = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD];
      const signUpPassword2 = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

      const payloadCardNameOnCard = JSON.parse(JSON.stringify(cardNameOnCard));
      const payloadCardPromoCode = JSON.parse(JSON.stringify(cardPromoCode));
      const payloadCardStripe = JSON.parse(JSON.stringify(cardStripe));
      const payloadInfoName = JSON.parse(JSON.stringify(infoName));
      const payloadInfoEmail = JSON.parse(JSON.stringify(infoEmail));
      const payloadInfoPhone = JSON.parse(JSON.stringify(infoPhone));
      const payloadSignUpPassword = JSON.parse(JSON.stringify(signUpPassword));
      const payloadSignUpPassword2 = JSON.parse(JSON.stringify(signUpPassword2));

      payloadCardNameOnCard.errorMessage = errorMessages.NO_NAME_ON_CARD;
      payloadCardStripe.errorMessage = errorMessages.NO_STRIPE;
      payloadInfoName.errorMessage = errorMessages.NO_NAME;
      payloadInfoEmail.errorMessage = errorMessages.NO_EMAIL;
      payloadInfoPhone.errorMessage = errorMessages.NO_PHONE;
      payloadSignUpPassword.errorMessage = errorMessages.NO_PASSWORD;

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardNameOnCard,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardPromoCode,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardStripe,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoName,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoPhone,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
      ];

      requestSignUp.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonSignUp(signUpPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUp).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload, no name on card, stripe error, invalid email, invalid phone, invalid password, passwords do not match', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      const stripeError = 'testStripeError';

      forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD].value = nameOnCard;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE].value = stripeError;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE].value = promoCode;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME].value = name;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = 'wrongEmail';
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE].value = '000-000-0000';
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD].value = 'password';
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2].value = 'password1';

      const cardNameOnCard = forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD];
      const cardPromoCode = forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE];
      const cardStripe = forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE];

      const infoName = forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME];
      const infoEmail = forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL];
      const infoPhone = forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE];

      const signUpPassword = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD];
      const signUpPassword2 = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

      const payloadCardNameOnCard = JSON.parse(JSON.stringify(cardNameOnCard));
      const payloadCardPromoCode = JSON.parse(JSON.stringify(cardPromoCode));
      const payloadCardStripe = JSON.parse(JSON.stringify(cardStripe));
      const payloadInfoName = JSON.parse(JSON.stringify(infoName));
      const payloadInfoEmail = JSON.parse(JSON.stringify(infoEmail));
      const payloadInfoPhone = JSON.parse(JSON.stringify(infoPhone));
      const payloadSignUpPassword = JSON.parse(JSON.stringify(signUpPassword));
      const payloadSignUpPassword2 = JSON.parse(JSON.stringify(signUpPassword2));

      payloadCardStripe.errorMessage = stripeError;
      payloadInfoEmail.errorMessage = errorMessages.INVALID_EMAIL;
      payloadInfoPhone.errorMessage = errorMessages.INVALID_PHONE;
      payloadSignUpPassword.errorMessage = errorMessages.INVALID_PASSWORD;
      payloadSignUpPassword2.errorMessage = errorMessages.NO_MATCH_PASSWORD;

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardNameOnCard,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardPromoCode,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardStripe,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoName,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoPhone,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
      ];

      requestSignUp.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonSignUp(signUpPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUp).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload, no name on card, shifts to card form', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE].value = 'complete';
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE].value = promoCode;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME].value = name;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE].value = phone;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD].value = password;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2].value = password;

      const cardNameOnCard = forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD];
      const cardPromoCode = forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE];
      const cardStripe = forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE];

      const infoName = forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME];
      const infoEmail = forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL];
      const infoPhone = forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE];

      const signUpPassword = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD];
      const signUpPassword2 = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

      const payloadCardNameOnCard = JSON.parse(JSON.stringify(cardNameOnCard));
      const payloadCardPromoCode = JSON.parse(JSON.stringify(cardPromoCode));
      const payloadCardStripe = JSON.parse(JSON.stringify(cardStripe));
      const payloadInfoName = JSON.parse(JSON.stringify(infoName));
      const payloadInfoEmail = JSON.parse(JSON.stringify(infoEmail));
      const payloadInfoPhone = JSON.parse(JSON.stringify(infoPhone));
      const payloadSignUpPassword = JSON.parse(JSON.stringify(signUpPassword));
      const payloadSignUpPassword2 = JSON.parse(JSON.stringify(signUpPassword2));

      payloadCardNameOnCard.errorMessage = errorMessages.NO_NAME_ON_CARD;

      payloadSignUpPassword.value = '';
      payloadSignUpPassword2.value = '';

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardNameOnCard,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardPromoCode,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardStripe,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoName,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoPhone,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.CARD,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
      ];

      requestSignUp.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonSignUp(signUpPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUp).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload, no name, shifts to info form', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD].value = nameOnCard;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE].value = 'complete';
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE].value = promoCode;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE].value = phone;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD].value = password;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2].value = password;

      const cardNameOnCard = forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD];
      const cardPromoCode = forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE];
      const cardStripe = forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE];

      const infoName = forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME];
      const infoEmail = forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL];
      const infoPhone = forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE];

      const signUpPassword = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD];
      const signUpPassword2 = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

      const payloadCardNameOnCard = JSON.parse(JSON.stringify(cardNameOnCard));
      const payloadCardPromoCode = JSON.parse(JSON.stringify(cardPromoCode));
      const payloadCardStripe = JSON.parse(JSON.stringify(cardStripe));
      const payloadInfoName = JSON.parse(JSON.stringify(infoName));
      const payloadInfoEmail = JSON.parse(JSON.stringify(infoEmail));
      const payloadInfoPhone = JSON.parse(JSON.stringify(infoPhone));
      const payloadSignUpPassword = JSON.parse(JSON.stringify(signUpPassword));
      const payloadSignUpPassword2 = JSON.parse(JSON.stringify(signUpPassword2));

      payloadInfoName.errorMessage = errorMessages.NO_NAME;

      payloadSignUpPassword.value = '';
      payloadSignUpPassword2.value = '';

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardNameOnCard,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardPromoCode,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardStripe,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoName,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoPhone,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.INFO,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
      ];

      requestSignUp.mockReturnValue(() => Promise.resolve());

      const result = await store.dispatch(firstButtonSignUp(signUpPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUp).not.toBeCalled();
    });

    it('creates the correct actions with the correct payload', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD].value = nameOnCard;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE].value = 'complete';
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE].value = promoCode;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME].value = name;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE].value = phone;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD].value = password;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2].value = password;

      const cardNameOnCard = forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD];
      const cardPromoCode = forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE];
      const cardStripe = forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE];

      const infoName = forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME];
      const infoEmail = forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL];
      const infoPhone = forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE];

      const signUpPassword = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD];
      const signUpPassword2 = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

      const payloadCardNameOnCard = JSON.parse(JSON.stringify(cardNameOnCard));
      const payloadCardPromoCode = JSON.parse(JSON.stringify(cardPromoCode));
      const payloadCardStripe = JSON.parse(JSON.stringify(cardStripe));
      const payloadInfoName = JSON.parse(JSON.stringify(infoName));
      const payloadInfoEmail = JSON.parse(JSON.stringify(infoEmail));
      const payloadInfoPhone = JSON.parse(JSON.stringify(infoPhone));
      const payloadSignUpPassword = JSON.parse(JSON.stringify(signUpPassword));
      const payloadSignUpPassword2 = JSON.parse(JSON.stringify(signUpPassword2));

      payloadCardNameOnCard.value = '';
      payloadCardNameOnCard.errorMessage = '';

      payloadCardPromoCode.value = '';
      payloadCardPromoCode.errorMessage = '';

      payloadCardStripe.value = '';
      payloadCardStripe.errorMessage = '';

      payloadInfoName.value = '';
      payloadInfoName.errorMessage = '';

      payloadInfoEmail.value = '';
      payloadInfoEmail.errorMessage = '';

      payloadInfoPhone.value = '';
      payloadInfoPhone.errorMessage = '';

      payloadSignUpPassword.value = '';
      payloadSignUpPassword.errorMessage = '';

      payloadSignUpPassword2.value = '';
      payloadSignUpPassword2.errorMessage = '';

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardNameOnCard,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardPromoCode,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardStripe,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoName,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoPhone,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoEmail,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
        {
          type: actionTypesAuth.SET_AUTH_STATUS,
          payload: {
            id: statusNames.SIGN_UP,
            status: requestStatusTypes.IDLE,
          },
        },
      ];

      requestSignUp.mockReturnValue(() => Promise.resolve(true));

      const result = await store.dispatch(firstButtonSignUp(signUpPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUp).toBeCalledWith({
        element,
        nameOnCard,
        promoCode,
        name,
        email,
        phone: E164Phone,
        password,
      });
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
      expect(signUpPayload.resetStripeElement).toBeCalled();
    });

    it('requestSignUp throws error from stripe with error.raw.message format', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD].value = nameOnCard;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE].value = 'complete';
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE].value = promoCode;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME].value = name;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE].value = phone;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD].value = password;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2].value = password;

      const cardStripe = forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE];
      const signUpPassword = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD];
      const signUpPassword2 = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

      const payloadCardStripe = JSON.parse(JSON.stringify(cardStripe));
      const payloadSignUpPassword = JSON.parse(JSON.stringify(signUpPassword));
      const payloadSignUpPassword2 = JSON.parse(JSON.stringify(signUpPassword2));

      const error = {
        raw: {
          code: 'testCode',
          message: 'testMessage',
        },
      };

      payloadCardStripe.value = error.raw.message;
      payloadCardStripe.errorMessage = error.raw.message;

      payloadSignUpPassword.value = '';
      payloadSignUpPassword.errorMessage = '';

      payloadSignUpPassword2.value = '';
      payloadSignUpPassword2.errorMessage = '';

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardStripe,
        },
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.CARD,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
      ];

      requestSignUp.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonSignUp(signUpPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUp).toBeCalledWith({
        element,
        nameOnCard,
        promoCode,
        name,
        email,
        phone: E164Phone,
        password,
      });
      expect(history.replace).not.toBeCalled();
      expect(signUpPayload.resetStripeElement).not.toBeCalled();
    });

    it("requestSignUp throws a 'UsernameExistsException' error", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD].value = nameOnCard;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE].value = promoCode;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE].value = 'complete';
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME].value = name;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE].value = phone;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD].value = password;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2].value = password;

      const infoEmail = forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL];
      const signUpPassword = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD];
      const signUpPassword2 = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

      const payloadInfoEmail = JSON.parse(JSON.stringify(infoEmail));
      const payloadSignUpPassword = JSON.parse(JSON.stringify(signUpPassword));
      const payloadSignUpPassword2 = JSON.parse(JSON.stringify(signUpPassword2));

      payloadInfoEmail.errorMessage = errorMessages.EMAIL_IN_USE;

      payloadSignUpPassword.value = '';
      payloadSignUpPassword.errorMessage = '';

      payloadSignUpPassword2.value = '';
      payloadSignUpPassword2.errorMessage = '';

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'UsernameExistsException',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadInfoEmail,
        },
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.INFO,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
      ];

      requestSignUp.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonSignUp(signUpPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUp).toBeCalledWith({
        element,
        nameOnCard,
        promoCode,
        name,
        email,
        phone: E164Phone,
        password,
      });
      expect(history.replace).not.toBeCalled();
      expect(signUpPayload.resetStripeElement).not.toBeCalled();
    });

    it("requestSignUp throws a 'coupon_invalid' error", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD].value = nameOnCard;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE].value = promoCode;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE].value = 'complete';
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME].value = name;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE].value = phone;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD].value = password;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2].value = password;

      const cardPromoCode = forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE];
      const signUpPassword = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD];
      const signUpPassword2 = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

      const payloadCardPromoCode = JSON.parse(JSON.stringify(cardPromoCode));
      const payloadSignUpPassword = JSON.parse(JSON.stringify(signUpPassword));
      const payloadSignUpPassword2 = JSON.parse(JSON.stringify(signUpPassword2));

      payloadCardPromoCode.errorMessage = errorMessages.PROMO_CODE_INVALID;

      payloadSignUpPassword.value = '';
      payloadSignUpPassword.errorMessage = '';

      payloadSignUpPassword2.value = '';
      payloadSignUpPassword2.errorMessage = '';

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'coupon_invalid',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardPromoCode,
        },
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.CARD,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
      ];

      requestSignUp.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonSignUp(signUpPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUp).toBeCalledWith({
        element,
        nameOnCard,
        promoCode,
        name,
        email,
        phone: E164Phone,
        password,
      });
      expect(history.replace).not.toBeCalled();
      expect(signUpPayload.resetStripeElement).not.toBeCalled();
    });

    it("requestSignUp throws a 'coupon_expired' error", async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD].value = nameOnCard;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE].value = promoCode;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE].value = 'complete';
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME].value = name;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE].value = phone;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD].value = password;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2].value = password;

      const cardPromoCode = forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE];
      const signUpPassword = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD];
      const signUpPassword2 = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

      const payloadCardPromoCode = JSON.parse(JSON.stringify(cardPromoCode));
      const payloadSignUpPassword = JSON.parse(JSON.stringify(signUpPassword));
      const payloadSignUpPassword2 = JSON.parse(JSON.stringify(signUpPassword2));

      payloadCardPromoCode.errorMessage = errorMessages.PROMO_CODE_EXPIRED;

      payloadSignUpPassword.value = '';
      payloadSignUpPassword.errorMessage = '';

      payloadSignUpPassword2.value = '';
      payloadSignUpPassword2.errorMessage = '';

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'coupon_expired',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadCardPromoCode,
        },
        {
          type: actionTypesUIExternal.SET_CURRENT_FORM,
          payload: {
            current: formNames.CARD,
          },
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
      ];

      requestSignUp.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonSignUp(signUpPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUp).toBeCalledWith({
        element,
        nameOnCard,
        promoCode,
        name,
        email,
        phone: E164Phone,
        password,
      });
      expect(history.replace).not.toBeCalled();
      expect(signUpPayload.resetStripeElement).not.toBeCalled();
    });

    it('requestSignUp throws an unexpected error', async () => {
      const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
      const { forms } = stateBeforeUIExternal;

      forms[formNames.CARD].inputs[inputNames[formNames.CARD].NAME_ON_CARD].value = nameOnCard;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].PROMO_CODE].value = promoCode;
      forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE].value = 'complete';
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].NAME].value = name;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL].value = email;
      forms[formNames.INFO].inputs[inputNames[formNames.INFO].PHONE].value = phone;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD].value = password;
      forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2].value = password;

      const signUpPassword = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD];
      const signUpPassword2 = forms[formNames.SIGN_UP]
        .inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

      const payloadSignUpPassword = JSON.parse(JSON.stringify(signUpPassword));
      const payloadSignUpPassword2 = JSON.parse(JSON.stringify(signUpPassword2));

      payloadSignUpPassword.value = '';
      payloadSignUpPassword.errorMessage = '';

      payloadSignUpPassword2.value = '';
      payloadSignUpPassword2.errorMessage = errorMessages.INTERNAL_ERROR;

      const store = mockStore({
        ui: { external: stateBeforeUIExternal },
      });

      const error = {
        code: 'testCode',
        message: 'testMessage',
      };
      const expectedActions = [
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword,
        },
        {
          type: actionTypesUIExternal.SET_INPUT_VALUE_ERROR,
          payload: payloadSignUpPassword2,
        },
      ];

      requestSignUp.mockReturnValue(() => Promise.reject(error));

      const result = await store.dispatch(firstButtonSignUp(signUpPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(requestSignUp).toBeCalledWith({
        element,
        nameOnCard,
        promoCode,
        name,
        email,
        phone: E164Phone,
        password,
      });
      expect(history.replace).not.toBeCalled();
      expect(signUpPayload.resetStripeElement).not.toBeCalled();
    });
  });
});
