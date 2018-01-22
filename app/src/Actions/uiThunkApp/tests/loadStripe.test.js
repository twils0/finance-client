/**
 * @jest-environment node
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateApp } from '../../../Reducers/uiReducersApp';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesApp } from '../../../Constants/uiConstantsApp';
import loadStripe from '../loadStripe';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const addEventListener = jest.fn();
const appendChild = jest.fn();

global.document = {
  createElement: () => ({
    addEventListener,
  }),
  head: {
    appendChild,
  },
};

describe('uiThunkApp', () => {
  describe('loadStripe', () => {
    afterEach(() => {
      addEventListener.mockReset();
      appendChild.mockReset();
    });

    it('calls the correct actions with the correct payloads, when addEventListener returns error', async () => {
      const store = mockStore({ ui: { app: initialStateApp } });

      const expectedActions = [
        {
          type: actionTypesApp.SET_STRIPE_STATUS,
          payload: {
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesApp.SET_STRIPE_STATUS,
          payload: {
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      addEventListener.mockImplementation(
        (type, callback) => (type === 'error' ? callback() : null),
      );

      const result = store.dispatch(loadStripe());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(addEventListener).toHaveBeenCalledTimes(2);
    });

    it('calls the correct actions with the correct payloads, when addEventListener returns load', async () => {
      const store = mockStore({ ui: { app: initialStateApp } });

      const stripeObject = { test: 'testStripe' };
      const expectedActions = [
        {
          type: actionTypesApp.SET_STRIPE_STATUS,
          payload: {
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesApp.SET_STRIPE_OBJECT,
          payload: {
            stripeObject,
          },
        },
        {
          type: actionTypesApp.SET_STRIPE_STATUS,
          payload: {
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      addEventListener.mockImplementation(
        (type, callback) => (type === 'load' ? callback() : null),
      );

      global.window = {
        Stripe: jest.fn(() => stripeObject),
      };

      const result = store.dispatch(loadStripe());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(global.window.Stripe).toBeCalledWith(initialStateApp.stripe.apiKey);
      expect(addEventListener).toHaveBeenCalledTimes(2);
      expect(appendChild).toHaveBeenCalledTimes(1);
    });
  });
});
