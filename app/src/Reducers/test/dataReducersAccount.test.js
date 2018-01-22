import { initialState, status, fields } from '../dataReducersAccount';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { actionTypes, statusNames, fieldNames } from '../../Constants/dataConstantsAccount';

describe('dataReducersAccount', () => {
  describe('status', () => {
    it('returns the initial state', () => {
      const action = {};
      const stateAfter = JSON.parse(JSON.stringify(initialState.status));

      expect(status(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_ACCOUNT_STATUS action', () => {
      const type = actionTypes.SET_ACCOUNT_STATUS;
      const id = statusNames.AWS_FIELDS;
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

    it('correctly handles RESET_ACCOUNT_STATE action', () => {
      const type = actionTypes.RESET_ACCOUNT_STATE;
      const id = statusNames.AWS_FIELDS;
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

  describe('fields', () => {
    it('returns the initial state', () => {
      const action = {};

      const stateAfter = JSON.parse(JSON.stringify(initialState.fields));

      expect(fields(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_FIELD action', () => {
      const type = actionTypes.SET_FIELD;
      const id = fieldNames.NAME;
      const value = 'testValue';
      const action = {
        type,
        payload: {
          id,
          value,
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.fields));

      stateAfter[id].value = value;

      expect(fields(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles SET_FIELDS action', () => {
      const type = actionTypes.SET_FIELDS;
      const action = {
        type,
        payload: {
          [fieldNames.NAME]: {
            id: fieldNames.NAME,
            value: 'testValue1',
          },
          [fieldNames.EMAIL]: {
            id: fieldNames.EMAIL,
            value: 'testValue2',
          },
        },
      };
      const stateAfter = JSON.parse(JSON.stringify(initialState.fields));

      stateAfter[fieldNames.NAME].value = 'testValue1';
      stateAfter[fieldNames.EMAIL].value = 'testValue2';

      expect(fields(undefined, action)).toEqual(stateAfter);
    });

    it('correctly handles RESET_ACCOUNT_STATE action', () => {
      const type = actionTypes.RESET_ACCOUNT_STATE;
      const id = fieldNames.NAME;
      const value = 'testValue';
      const action = {
        type,
      };
      const stateBefore = JSON.parse(JSON.stringify(initialState.fields));
      const stateAfter = JSON.parse(JSON.stringify(initialState.fields));

      stateBefore[id].value = value;

      expect(fields(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
