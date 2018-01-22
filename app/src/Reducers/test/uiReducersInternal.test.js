import { initialState, utilities, pageBodies } from '../uiReducersInternal';
import { actionTypes, pageBodyNames } from '../../Constants/uiConstantsInternal';

describe('uiReducersInternal', () => {
  describe('utilities', () => {
    it('returns the initial state', () => {
      const action = {};
      const stateAfter = JSON.parse(JSON.stringify(initialState.utilities));

      expect(utilities(undefined, action)).toEqual(stateAfter);
    });
  });

  describe('pageBodies', () => {
    it('returns the initial state', () => {
      const action = {};
      const stateAfter = JSON.parse(JSON.stringify(initialState.pageBodies));

      expect(pageBodies(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_CURRENT_PAGE_BODY action', () => {
      const type = actionTypes.SET_CURRENT_PAGE_BODY;
      const current = pageBodyNames.ACCOUNT;
      const action = {
        type,
        payload: {
          current,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.pageBodies));

      stateAfter.current = current;

      expect(pageBodies(undefined, action)).toEqual(stateAfter);
    });
  });
});
