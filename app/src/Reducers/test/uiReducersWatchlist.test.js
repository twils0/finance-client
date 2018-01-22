import { initialState, utilities } from '../uiReducersWatchlist';

describe('uiReducersWatchlist', () => {
  describe('utilities', () => {
    it('returns the initial state', () => {
      const action = {};
      const stateAfter = JSON.parse(JSON.stringify(initialState.utilities));

      expect(utilities(undefined, action)).toEqual(stateAfter);
    });
  });
});
