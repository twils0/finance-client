import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { store as importedStore } from '../../../App';

import { initialState as initialStateAuth } from '../../../Reducers/dataReducersAuth';
import { initialState as initialStateAWS } from '../../../Reducers/dataReducersAWS';
import { initialState as initialStateWatchlist } from '../../../Reducers/dataReducersWatchlist';
import { initialState as initialStateUIApp } from '../../../Reducers/uiReducersApp';
import { initialState as initialStateUIInternal } from '../../../Reducers/uiReducersInternal';
import { requestStatusTypes, pathNames } from '../../../Constants/universalConstants';
import {
  actionTypes as actionTypesAuth,
  statusNames as statusNamesAuth,
} from '../../../Constants/dataConstantsAuth';
import { actionTypes as actionTypesWatchlist } from '../../../Constants/dataConstantsWatchlist';
import { imageNames } from '../../../Constants/uiConstantsApp';
import {
  actionTypes as actionTypesUIInternal,
  pageBodyNames,
} from '../../../Constants/uiConstantsInternal';
import loadSecurities from '../../../Actions/dataThunkWatchlist/loadSecurities';
import requestUpdateSecurities from '../../../Actions/dataThunkWatchlist/requestUpdateSecurities';
import loadImage from '../../../Actions/uiThunkApp/loadImage';

import PageContainerInternal from '../PageContainerInternal';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

importedStore.getState = jest.fn(() => ({ ui: { internal: initialStateUIInternal } }));

jest.mock('../../../Actions/uiThunkApp/loadImage', () => jest.fn(() => () => null));
jest.mock('../../../Actions/dataThunkWatchlist/loadSecurities', () => jest.fn());
jest.mock('../../../Actions/dataThunkWatchlist/requestUpdateSecurities', () => jest.fn());

const history = {
  replace: jest.fn(),
};

global.window = {
  innerHeight: 500,
};
global.document = {};

const shallowComponent = (store, path, url, params) =>
  shallow(<PageContainerInternal />, {
    context: {
      store,
      router: {
        history,
        route: {
          location: {},
          match: { path, url, params: params || {} },
        },
      },
    },
  })
    .dive()
    .dive()
    .dive();

const testId0 = 'testId0';
const testId1 = 'testId1';
const testId2 = 'testId2';
const testId3 = 'testId3';

const securities = {
  current: testId0,
  list: [testId0, testId1, testId2],
  [testId0]: {
    id: testId0,
    name: 'testName0',
    category: 'testCategory0',
    exchange: 'testExchange0',
    tickerCusip: 'testTickerCusip0',
    data: {
      description: 'testDescription0',
    },
  },
  [testId1]: {
    id: testId1,
    name: 'testName1',
    category: 'testCategory1',
    exchange: 'testExchange1',
    tickerCusip: 'testTickerCusip1',
    data: {
      description: 'testDescription1',
    },
  },
  [testId2]: {
    id: testId2,
    name: 'testName2',
    category: 'testCategory2',
    exchange: 'testExchange2',
    tickerCusip: 'testTickerCusip2',
    data: {
      description: 'testDescription2',
    },
  },
};

describe('Containers', () => {
  describe('PageInternal', () => {
    describe('PageContainerInternal', () => {
      afterEach(() => {
        importedStore.getState.mockReset();
        loadImage.mockReset();
        loadSecurities.mockReset();
        requestUpdateSecurities.mockReset();
        history.replace.mockReset();
      });

      it('shallow renders correctly, with logout and delete account statuses set to success, watchlist path, and no securityId param', async () => {
        const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
        const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
        const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));

        stateBeforeAWS.status = requestStatusTypes.SUCCESS;

        stateBeforeWatchlist.securities = securities;

        stateBeforeUIApp.fonts.status = requestStatusTypes.SUCCESS;

        const store = mockStore({
          data: {
            auth: initialStateAuth,
            aws: stateBeforeAWS,
            watchlist: stateBeforeWatchlist,
          },
          ui: {
            app: stateBeforeUIApp,
            internal: initialStateUIInternal,
          },
        });

        const url = `${pathNames.WATCHLIST}/123`;
        const expectedActions = [
          {
            type: actionTypesAuth.SET_REDIRECT_URL,
            payload: { redirectURL: url },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.LOGOUT, status: requestStatusTypes.IDLE },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.DELETE_ACCOUNT, status: requestStatusTypes.IDLE },
          },
        ];

        loadImage.mockReturnValue(() => null);
        loadSecurities.mockReturnValue(() => null);

        const wrapper = shallowComponent(store, pathNames.WATCHLIST, url);

        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
        expect(wrapper).toMatchSnapshot();
        expect(loadImage).toBeCalledWith({ id: imageNames.EXAMPLE_HEADER });
        expect(loadSecurities).toHaveBeenCalledTimes(1);
        expect(requestUpdateSecurities).not.toBeCalled();
        expect(history.replace).toBeCalledWith(`${pathNames.WATCHLIST}/${securities.current}`);
        expect(history.replace).toHaveBeenCalledTimes(1);
      });

      it('shallow renders correctly, with componentDidMount, componentWillReceiveProps, watchlist path, securityId param, and account page body', async () => {
        const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
        const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
        const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));
        const stateBeforeUIInternal = JSON.parse(JSON.stringify(initialStateUIInternal));

        stateBeforeAWS.status = requestStatusTypes.SUCCESS;

        stateBeforeWatchlist.securities = securities;

        stateBeforeUIApp.images.exampleHeader.status = requestStatusTypes.SUCCESS;
        stateBeforeUIApp.fonts.status = requestStatusTypes.SUCCESS;

        stateBeforeUIInternal.pageBodies.current = pageBodyNames.ACCOUNT;

        const store = mockStore({
          data: {
            auth: initialStateAuth,
            aws: stateBeforeAWS,
            watchlist: stateBeforeWatchlist,
          },
          ui: {
            app: stateBeforeUIApp,
            internal: stateBeforeUIInternal,
          },
        });

        const urlStart = pathNames.ACCOUNT;
        const urlNext = `${pathNames.WATCHLIST}/123`;
        const nextProps = {
          match: {
            path: pathNames.WATCHLIST_SECURITY_ID,
            url: urlNext,
            params: {
              securityId: testId1,
            },
          },
          statusAWS: requestStatusTypes.SUCCESS,
          securities,
        };

        const expectedActions = [
          {
            type: actionTypesAuth.SET_REDIRECT_URL,
            payload: { redirectURL: urlStart },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.LOGOUT, status: requestStatusTypes.IDLE },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.DELETE_ACCOUNT, status: requestStatusTypes.IDLE },
          },
          {
            type: actionTypesAuth.SET_REDIRECT_URL,
            payload: { redirectURL: urlNext },
          },
          {
            type: actionTypesWatchlist.SET_SECURITIES_CURRENT,
            payload: { current: testId1 },
          },
          {
            type: actionTypesUIInternal.SET_CURRENT_PAGE_BODY,
            payload: { current: pageBodyNames.WATCHLIST },
          },
        ];

        loadSecurities.mockReturnValue(() => null);
        requestUpdateSecurities.mockReturnValue(() => null);

        const wrapper = shallowComponent(store, pathNames.ACCOUNT, urlStart, {
          securityId: testId0,
        });

        const instance = wrapper.instance();

        instance.componentDidMount();
        instance.componentWillReceiveProps(nextProps);

        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
        expect(wrapper).toMatchSnapshot();
        expect(loadSecurities).toHaveBeenCalledTimes(1);
        expect(requestUpdateSecurities).toBeCalled();
        expect(history.replace).not.toBeCalled();
      });

      it('shallow renders correctly, when authenticated equals false, with watchlist path and securityId param equal to current security', async () => {
        const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
        const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
        const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));

        stateBeforeAuth.authenticated = false;

        stateBeforeWatchlist.securities = securities;

        stateBeforeUIApp.images.exampleHeader.status = requestStatusTypes.SUCCESS;
        stateBeforeUIApp.fonts.status = requestStatusTypes.SUCCESS;

        const store = mockStore({
          data: {
            auth: stateBeforeAuth,
            aws: initialStateAWS,
            watchlist: stateBeforeWatchlist,
          },
          ui: {
            app: stateBeforeUIApp,
            internal: initialStateUIInternal,
          },
        });

        const url = `${pathNames.WATCHLIST}/123`;
        const expectedActions = [
          {
            type: actionTypesAuth.SET_REDIRECT_URL,
            payload: { redirectURL: url },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.LOGOUT, status: requestStatusTypes.IDLE },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.DELETE_ACCOUNT, status: requestStatusTypes.IDLE },
          },
        ];

        const wrapper = shallowComponent(store, pathNames.WATCHLIST, url, { securityId: testId0 });

        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
        expect(wrapper).toMatchSnapshot();
        expect(history.replace).not.toBeCalled();
        expect(loadImage).not.toBeCalled();
        expect(requestUpdateSecurities).not.toBeCalled();
        expect(history.replace).not.toBeCalled();
      });

      it('shallow renders correctly, with watchlist path and securityId param not equal to current security', async () => {
        const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
        const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
        const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));

        stateBeforeWatchlist.securities = securities;

        stateBeforeUIApp.images.exampleHeader.status = requestStatusTypes.SUCCESS;
        stateBeforeUIApp.fonts.status = requestStatusTypes.SUCCESS;

        const store = mockStore({
          data: {
            auth: stateBeforeAuth,
            aws: initialStateAWS,
            watchlist: stateBeforeWatchlist,
          },
          ui: {
            app: stateBeforeUIApp,
            internal: initialStateUIInternal,
          },
        });

        const url = `${pathNames.WATCHLIST}/123`;
        const expectedActions = [
          {
            type: actionTypesAuth.SET_REDIRECT_URL,
            payload: { redirectURL: url },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.LOGOUT, status: requestStatusTypes.IDLE },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.DELETE_ACCOUNT, status: requestStatusTypes.IDLE },
          },
          {
            type: actionTypesWatchlist.SET_SECURITIES_CURRENT,
            payload: { current: testId1 },
          },
        ];

        requestUpdateSecurities.mockReturnValue(() => null);

        const wrapper = shallowComponent(store, pathNames.WATCHLIST, url, { securityId: testId1 });

        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
        expect(wrapper).toMatchSnapshot();
        expect(loadImage).not.toBeCalled();
        expect(requestUpdateSecurities).toBeCalled();
        expect(history.replace).not.toBeCalled();
      });

      it('shallow renders correctly, with watchlist path and no current security', async () => {
        const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
        const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
        const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));

        stateBeforeAWS.status = requestStatusTypes.SUCCESS;

        stateBeforeUIApp.images.exampleHeader.status = requestStatusTypes.SUCCESS;
        stateBeforeUIApp.fonts.status = requestStatusTypes.SUCCESS;

        const store = mockStore({
          data: {
            auth: stateBeforeAuth,
            aws: stateBeforeAWS,
            watchlist: initialStateWatchlist,
          },
          ui: {
            app: stateBeforeUIApp,
            internal: initialStateUIInternal,
          },
        });

        const url = `${pathNames.WATCHLIST}/123`;
        const expectedActions = [
          {
            type: actionTypesAuth.SET_REDIRECT_URL,
            payload: { redirectURL: url },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.LOGOUT, status: requestStatusTypes.IDLE },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.DELETE_ACCOUNT, status: requestStatusTypes.IDLE },
          },
        ];

        loadSecurities.mockReturnValue(() => null);

        const wrapper = shallowComponent(store, pathNames.WATCHLIST, url);

        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
        expect(wrapper).toMatchSnapshot();
        expect(loadImage).not.toBeCalled();
        expect(loadSecurities).toHaveBeenCalledTimes(1);
        expect(requestUpdateSecurities).not.toBeCalled();
        expect(history.replace).not.toBeCalled();
      });

      it('shallow renders correctly, with watchlist path and securityId param not in securities', async () => {
        const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
        const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
        const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));

        stateBeforeWatchlist.securities = securities;

        stateBeforeUIApp.images.exampleHeader.status = requestStatusTypes.SUCCESS;
        stateBeforeUIApp.fonts.status = requestStatusTypes.SUCCESS;

        const store = mockStore({
          data: {
            auth: stateBeforeAuth,
            aws: initialStateAWS,
            watchlist: stateBeforeWatchlist,
          },
          ui: {
            app: stateBeforeUIApp,
            internal: initialStateUIInternal,
          },
        });

        const url = `${pathNames.WATCHLIST}/123`;
        const expectedActions = [
          {
            type: actionTypesAuth.SET_REDIRECT_URL,
            payload: { redirectURL: url },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.LOGOUT, status: requestStatusTypes.IDLE },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.DELETE_ACCOUNT, status: requestStatusTypes.IDLE },
          },
        ];

        requestUpdateSecurities.mockReturnValue(() => null);

        const wrapper = shallowComponent(store, pathNames.WATCHLIST, url, { securityId: testId3 });

        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
        expect(wrapper).toMatchSnapshot();
        expect(loadImage).not.toBeCalled();
        expect(requestUpdateSecurities).not.toBeCalled();
        expect(history.replace).toBeCalledWith(`${pathNames.WATCHLIST}/${testId0}`);
      });

      it('shallow renders correctly, with account path, fonts status equal to loading, no watchlist securities, and loading indicator', async () => {
        const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));

        stateBeforeUIApp.images.exampleHeader.status = requestStatusTypes.SUCCESS;
        stateBeforeUIApp.fonts.status = requestStatusTypes.LOADING;

        const store = mockStore({
          data: {
            auth: initialStateAuth,
            aws: initialStateAWS,
            watchlist: initialStateWatchlist,
          },
          ui: {
            app: stateBeforeUIApp,
            internal: initialStateUIInternal,
          },
        });

        const url = pathNames.ACCOUNT;
        const expectedActions = [
          {
            type: actionTypesAuth.SET_REDIRECT_URL,
            payload: { redirectURL: url },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.LOGOUT, status: requestStatusTypes.IDLE },
          },
          {
            type: actionTypesAuth.SET_AUTH_STATUS,
            payload: { id: statusNamesAuth.DELETE_ACCOUNT, status: requestStatusTypes.IDLE },
          },
          {
            type: actionTypesUIInternal.SET_CURRENT_PAGE_BODY,
            payload: { current: pageBodyNames.ACCOUNT },
          },
        ];

        const wrapper = shallowComponent(store, pathNames.ACCOUNT, url);

        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
        expect(wrapper).toMatchSnapshot();
        expect(loadImage).not.toBeCalled();
        expect(requestUpdateSecurities).not.toBeCalled();
        expect(history.replace).not.toBeCalled();
      });

      it('shallow renders correctly, with watchlist path, securityId equal to current security, fonts, example header, and aws statuses image equal to success, and logout and delete account status equal to idle', async () => {
        const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
        const stateBeforeWatchlist = JSON.parse(JSON.stringify(initialStateWatchlist));
        const stateBeforeAWS = JSON.parse(JSON.stringify(initialStateAWS));
        const stateBeforeUIApp = JSON.parse(JSON.stringify(initialStateUIApp));

        stateBeforeAuth.status[statusNamesAuth.LOGOUT].status = requestStatusTypes.IDLE;
        stateBeforeAuth.status[statusNamesAuth.DELETE_ACCOUNT].status = requestStatusTypes.IDLE;

        stateBeforeAWS.status = requestStatusTypes.SUCCESS;

        stateBeforeWatchlist.securities = securities;

        stateBeforeUIApp.images.exampleHeader.status = requestStatusTypes.SUCCESS;
        stateBeforeUIApp.fonts.status = requestStatusTypes.SUCCESS;

        const store = mockStore({
          data: {
            auth: stateBeforeAuth,
            aws: stateBeforeAWS,
            watchlist: stateBeforeWatchlist,
          },
          ui: {
            app: stateBeforeUIApp,
            internal: initialStateUIInternal,
          },
        });

        const url = `${pathNames.WATCHLIST}/123`;
        const expectedActions = [
          {
            type: actionTypesAuth.SET_REDIRECT_URL,
            payload: { redirectURL: url },
          },
        ];

        loadSecurities.mockReturnValue(() => null);

        const wrapper = shallowComponent(store, pathNames.WATCHLIST, url, { securityId: testId0 });

        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
        expect(wrapper).toMatchSnapshot();
        expect(loadImage).not.toBeCalled();
        expect(loadSecurities).toHaveBeenCalledTimes(1);
        expect(requestUpdateSecurities).not.toBeCalled();
        expect(history.replace).not.toBeCalled();
      });
    });
  });
});
