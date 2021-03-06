import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import WebFont from 'webfontloader';
// import { createGlobalStyle } from 'styled-components';

import { initialState as initialStateApp } from '../../../Reducers/uiReducersApp';
import { requestStatusTypes } from '../../../Constants/universalConstants';
import { actionTypes as actionTypesApp } from '../../../Constants/uiConstantsApp';
import loadFonts from '../loadFonts';

// jest.mock('styled-components', () => ({
//   createGlobalStyle: jest.fn(),
// }));

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('uiThunkApp', () => {
  // afterEach(() => {
  //   createGlobalStyle.mockReset();
  // });

  describe('loadFonts', () => {
    it('calls the correct actions with the correct payloads, when WebFont returns fontinactive', async () => {
      const store = mockStore({ ui: { app: initialStateApp } });

      const expectedActions = [
        {
          type: actionTypesApp.SET_FONTS_STATUS,
          payload: {
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesApp.SET_FONTS_STATUS,
          payload: {
            status: requestStatusTypes.ERROR,
          },
        },
      ];

      WebFont.load = jest.fn(callback => callback.fontinactive());

      const result = store.dispatch(loadFonts());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toMatchSnapshot();
      expect(WebFont.load).toBeCalled();
    });

    it('calls the correct actions with the correct payloads, when WebFont returns fontinactive', async () => {
      const store = mockStore({ ui: { app: initialStateApp } });

      const expectedActions = [
        {
          type: actionTypesApp.SET_FONTS_STATUS,
          payload: {
            status: requestStatusTypes.LOADING,
          },
        },
        {
          type: actionTypesApp.SET_FONTS_STATUS,
          payload: {
            status: requestStatusTypes.SUCCESS,
          },
        },
      ];

      WebFont.load = jest.fn(callback => callback.active());

      const result = store.dispatch(loadFonts());

      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
      expect(result).toMatchSnapshot();
      expect(WebFont.load).toBeCalled();
    });
  });
});
