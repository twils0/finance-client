import {
  initialState, fonts, images, stripe,
} from '../uiReducersApp';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { actionTypes, imageNames } from '../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';

describe('uiReducersApp', () => {
  describe('fonts', () => {
    it('returns the initial state', () => {
      const action = {};

      const stateAfter = JSON.parse(JSON.stringify(initialState.fonts));

      expect(fonts(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_FONTS_STATUS action', () => {
      const type = actionTypes.SET_FONTS_STATUS;
      const status = requestStatusTypes.SUCCESS;
      const action = {
        type,
        payload: {
          status,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.fonts));

      stateAfter.status = status;

      expect(fonts(undefined, action)).toEqual(stateAfter);
    });
  });

  describe('images', () => {
    it('returns the initial state', () => {
      const action = {};

      const stateAfter = JSON.parse(JSON.stringify(initialState.images));

      expect(images(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_IMAGE_STATUS action', () => {
      const type = actionTypes.SET_IMAGE_STATUS;
      const id = imageNames.EXAMPLE_HEADER;
      const status = requestStatusTypes.SUCCESS;
      const action = {
        type,
        payload: {
          id,
          status,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.images));

      stateAfter[id].status = status;

      expect(images(undefined, action)).toEqual(stateAfter);
    });
  });

  describe('stripe', () => {
    it('returns the initial state', () => {
      const action = {};

      const stateAfter = JSON.parse(JSON.stringify(initialState.stripe));

      expect(stripe(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_STRIPE_STATUS action', () => {
      const type = actionTypes.SET_STRIPE_STATUS;
      const status = requestStatusTypes.SUCCESS;
      const action = {
        type,
        payload: {
          status,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.stripe));

      stateAfter.status = status;

      expect(stripe(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_STRIPE_ELEMENT_LOADED action', () => {
      const type = actionTypes.SET_STRIPE_ELEMENT_LOADED;
      const id = inputNames[formNames.CARD].STRIPE;
      const loaded = true;
      const action = {
        type,
        payload: {
          id,
          loaded,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.stripe));

      stateAfter.elements[id].loaded = loaded;

      expect(stripe(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_STRIPE_OBJECT action', () => {
      const type = actionTypes.SET_STRIPE_OBJECT;
      const stripeObject = {};
      const action = {
        type,
        payload: {
          stripeObject,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.stripe));

      stateAfter.stripeObject = stripeObject;

      expect(stripe(undefined, action)).toEqual(stateAfter);
    });
  });
});
