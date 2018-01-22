import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState as initialStateApp } from '../../../Reducers/uiReducersApp';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesApp, imageNames } from '../../../Constants/uiConstantsApp';
import loadImage from '../loadImage';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const id = imageNames.EXAMPLE_HEADER;

describe('uiThunkApp', () => {
  describe('loadImage', () => {
    it('calls the correct actions with the correct payloads, when addEventListener returns error', async () => {
      const store = mockStore({ ui: { app: initialStateApp } });

      const expectedActions = [
        {
          type: actionTypesApp.SET_IMAGE_STATUS,
          payload: {
            id,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesApp.SET_IMAGE_STATUS,
          payload: {
            id,
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      const addEventListener = jest.fn((type, callback) => (type === 'error' ? callback() : null));

      global.Image = jest.fn(() => ({
        addEventListener,
      }));

      const result = store.dispatch(loadImage({ id }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(addEventListener).toBeCalled();
      expect(addEventListener).toBeCalled();
    });

    it('calls the correct actions with the correct payloads, when addEventListener returns load', async () => {
      const store = mockStore({ ui: { app: initialStateApp } });

      const expectedActions = [
        {
          type: actionTypesApp.SET_IMAGE_STATUS,
          payload: {
            id,
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesApp.SET_IMAGE_STATUS,
          payload: {
            id,
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      const addEventListener = jest.fn((type, callback) => (type === 'load' ? callback() : null));

      global.Image = jest.fn(() => ({
        addEventListener,
      }));

      const result = store.dispatch(loadImage({ id }));

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toEqual(null);
      expect(addEventListener).toBeCalled();
      expect(addEventListener).toBeCalled();
    });
  });
});
