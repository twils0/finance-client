import {
  initialState, authenticated, redirectURL, status, codeTypes,
} from '../dataReducersAuth';
import { requestStatusTypes, pathNames } from '../../Constants/universalConstants';
import { actionTypes, statusNames, codeTypeNames } from '../../Constants/dataConstantsAuth';

describe('dataReducersAuth', () => {
  describe('authenticated', () => {
    it('returns the initial state', () => {
      const action = {};
      const stateAfter = JSON.parse(JSON.stringify(initialState.authenticated));

      expect(authenticated(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_AUTHENTICATED action', () => {
      const type = actionTypes.SET_AUTHENTICATED;
      const authenticatedBool = true;
      const action = {
        type,
        payload: {
          authenticated: authenticatedBool,
        },
      };
      const stateAfter = authenticatedBool;

      expect(authenticated(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles RESET_AUTH_STATE action', () => {
      const type = actionTypes.RESET_AUTH_STATE;
      const authenticatedBool = true;
      const action = {
        type,
      };
      const stateBefore = authenticatedBool;
      const stateAfter = JSON.parse(JSON.stringify(initialState.authenticated));

      expect(authenticated(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('redirectURL', () => {
    it('correctly handles SET_REDIRECT_URL action', () => {
      const type = actionTypes.SET_REDIRECT_URL;
      const redirectURLString = pathNames.ACCOUNT;
      const action = {
        type,
        payload: {
          redirectURL: redirectURLString,
        },
      };
      const stateAfter = redirectURLString;

      expect(redirectURL(undefined, action)).toEqual(stateAfter);
    });
  });

  describe('status', () => {
    it('returns the initial state', () => {
      const action = {};
      const stateAfter = JSON.parse(JSON.stringify(initialState.status));

      expect(status(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_AUTH_STATUS action', () => {
      const type = actionTypes.SET_AUTH_STATUS;
      const id = statusNames.LOGIN;
      const statusSuccess = requestStatusTypes.SUCCESS;
      const action = {
        type,
        payload: {
          id,
          status: statusSuccess,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.status));

      stateAfter[id].status = statusSuccess;

      expect(status(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles RESET_AUTH_STATE action', () => {
      const type = actionTypes.RESET_AUTH_STATE;
      const id = statusNames.LOGIN;
      const statusSuccess = requestStatusTypes.SUCCESS;
      const action = {
        type,
      };
      const stateBefore = JSON.parse(JSON.stringify(initialState.status));
      const stateAfter = JSON.parse(JSON.stringify(initialState.status));

      stateBefore[id].status = statusSuccess;

      expect(status(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('codeTypes', () => {
    it('returns the initial state', () => {
      const action = {};

      const stateAfter = JSON.parse(JSON.stringify(initialState.codeTypes));

      expect(codeTypes(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_CODE_TYPE action', () => {
      const type = actionTypes.SET_CODE_TYPE;
      const id = codeTypeNames.VERIFY_PHONE;
      const needed = false;
      const action = {
        type,
        payload: {
          id,
          needed,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.codeTypes));

      stateAfter[id].needed = needed;

      expect(codeTypes(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles RESET_AUTH_STATE action', () => {
      const type = actionTypes.RESET_AUTH_STATE;
      const id = codeTypeNames.VERIFY_PHONE;
      const needed = false;
      const action = {
        type,
      };
      const stateBefore = JSON.parse(JSON.stringify(initialState.codeTypes));
      const stateAfter = JSON.parse(JSON.stringify(initialState.codeTypes));

      stateBefore[id].needed = needed;

      expect(codeTypes(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
