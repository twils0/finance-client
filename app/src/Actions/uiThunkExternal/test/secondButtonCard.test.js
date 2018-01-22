import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIExternal } from '../../../Reducers/uiReducersExternal';
import { pathNames } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesUIExternal,
  formNames,
  inputNames,
} from '../../../Constants/uiConstantsExternal';
import secondButtonCard from '../secondButtonCard';

const history = {
  replace: jest.fn(),
};

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const cardPayload = {
  history,
  resetStripeElement: jest.fn(),
};

const nameOnCard = 'testNameOnCard';
const promoCode = 'testPromoCode';
const name = 'testName';
const email = 'test@test.com';
const phone = '239-555-0000';
const password = 'testPassword1!';

describe('uiThunkAccount', () => {
  describe('secondButtonCard', () => {
    afterEach(() => {
      history.replace.mockReset();
      cardPayload.resetStripeElement.mockReset();
    });

    it("fails and throws an error when missing 'history' key in payload", async () => {
      const store = mockStore({
        data: { auth: initialStateAuth },
        ui: { external: initialStateUIExternal },
      });

      const emptyPayload = {};
      const expectedActions = [];

      try {
        await store.dispatch(secondButtonCard(emptyPayload));
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
      };
      const expectedActions = [];

      try {
        await store.dispatch(secondButtonCard(wrongPayload));
      } catch (errorCatch) {
        expect(errorCatch).toMatchSnapshot();
      }

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });

    it('creates the correct actions with the correct payload, inputs all have values', async () => {
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

      const signUpPassword =
        forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD];
      const signUpPassword2 =
        forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

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

      const result = await store.dispatch(secondButtonCard(cardPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
      expect(cardPayload.resetStripeElement).toBeCalled();
    });

    it('creates the correct actions with the correct payload, inputs all are blank', async () => {
      const store = mockStore({
        ui: { external: initialStateUIExternal },
      });

      const expectedActions = [];

      const result = await store.dispatch(secondButtonCard(cardPayload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(history.replace).toBeCalledWith(pathNames.LOGIN);
      expect(cardPayload.resetStripeElement).not.toBeCalled();
    });
  });
});
