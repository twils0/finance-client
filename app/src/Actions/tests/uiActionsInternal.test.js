import configureMockStore from 'redux-mock-store';
import { initialState } from '../../Reducers/uiReducersInternal';
import { actionTypes } from '../../Constants/uiConstantsInternal';
import { setCurrentPageBody } from '../uiActionsInternal';

const middleware = [];
const mockStore = configureMockStore(middleware);

describe('uiActionsInternal', () => {
  describe('setCurrentPageBody', () => {
    it("fails when not provided a payload with a 'current' key", () => {
      const store = mockStore(initialState);

      const payload = {};

      expect(() => store.dispatch(setCurrentPageBody(payload))).toThrowErrorMatchingSnapshot();
    });

    it('creates the correct action with the correct payload', () => {
      const store = mockStore(initialState);

      const payload = { current: 'testId' };
      const expectedActions = [
        {
          type: actionTypes.SET_CURRENT_PAGE_BODY,
          payload,
        },
      ];

      store.dispatch(setCurrentPageBody(payload));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});
