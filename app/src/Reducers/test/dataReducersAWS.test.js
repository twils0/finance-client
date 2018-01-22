import { initialState, status, user } from '../../Reducers/dataReducersAWS';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { actionTypes } from '../../Constants/dataConstantsAWS';

describe('dataReducersAWS', () => {
  describe('status', () => {
    it('returns the initial state', () => {
      const action = {};
      const stateAfter = JSON.parse(JSON.stringify(initialState.status));

      expect(status(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_AWS_STATUS action', () => {
      const type = actionTypes.SET_AWS_STATUS;
      const statusSuccess = requestStatusTypes.SUCCESS;
      const action = {
        type,
        payload: {
          status: statusSuccess,
        },
      };
      const stateAfter = statusSuccess;

      expect(status(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles RESET_AWS_STATE action', () => {
      const type = actionTypes.RESET_AWS_STATE;
      const statusSuccess = requestStatusTypes.SUCCESS;
      const action = {
        type,
      };
      const stateBefore = statusSuccess;
      const stateAfter = JSON.parse(JSON.stringify(initialState.status));

      expect(status(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('user', () => {
    it('returns the initial state', () => {
      const action = {};

      const stateAfter = JSON.parse(JSON.stringify(initialState.user));

      expect(user(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_AWS_USER action', () => {
      const type = actionTypes.SET_AWS_USER;
      const userObject = {};
      const action = {
        type,
        payload: {
          user: userObject,
        },
      };
      const stateAfter = userObject;

      expect(user(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles RESET_AWS_STATE action', () => {
      const type = actionTypes.RESET_AWS_STATE;
      const userObject = {};
      const action = {
        type,
      };
      const stateBefore = userObject;
      const stateAfter = JSON.parse(JSON.stringify(initialState.user));

      expect(user(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
