import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import { initialState as initialStateAuth } from '../../../../../Reducers/dataReducersAuth';
import { initialState as initialStateAccount } from '../../../../../Reducers/dataReducersAccount';
import { initialState as initialStateUIExternal } from '../../../../../Reducers/uiReducersExternal';
import { fieldNames } from '../../../../../Constants/dataConstantsAccount';
import { formNames } from '../../../../../Constants/uiConstantsExternal';

import FormContainerCodeVerifyEmail from '../FormContainerCodeVerifyEmail';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const heightRef = jest.fn();
const setHeight = jest.fn();
const clearElement = jest.fn();

const email = 'test@test.com';
const emailAdditional = 'test1@test.com';

const shallowComponent = (store, path, params) =>
  shallow(
    <FormContainerCodeVerifyEmail
      heightRef={heightRef}
      setHeight={setHeight}
      clearElement={clearElement}
    />,
    {
      context: {
        store,
        router: {
          history: {},
          route: {
            location: {},
            match: { path, params: params || {} },
          },
        },
      },
    },
  )
    .dive()
    .dive()
    .dive();

describe('Containers', () => {
  describe('PageExternal', () => {
    describe('FormArrayContainerCode', () => {
      describe('Forms', () => {
        describe('FormContainerCodeVerifyEmail', () => {
          afterEach(() => {
            heightRef.mockReset();
            setHeight.mockReset();
            clearElement.mockReset();
          });

          it('shallow renders correctly, with email and email additional', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));

            stateBeforeAccount.fields[fieldNames.EMAIL].value = email;
            stateBeforeAccount.fields[fieldNames.EMAIL_ADDITIONAL].value = emailAdditional;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
                account: stateBeforeAccount,
              },
              ui: {
                external: initialStateUIExternal,
              },
            });

            const expectedActions = [];

            const wrapper = shallowComponent(store);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
            expect(setHeight).toBeCalledWith(formNames.CODE_VERIFY_EMAIL);
          });

          it('shallow renders correctly, with componentWillUpdate, componentDidUpdate, and componentWillUnmount, without email or email additional', async () => {
            const store = mockStore({
              data: {
                auth: initialStateAuth,
                account: initialStateAccount,
              },
              ui: {
                external: initialStateUIExternal,
              },
            });

            const expectedActions = [];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.componentDidUpdate();
            instance.componentWillUnmount();

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
            expect(setHeight).toBeCalledWith(formNames.CODE_VERIFY_EMAIL);
            expect(setHeight).toBeCalledWith(formNames.CODE_VERIFY_EMAIL);
            expect(setHeight).toBeCalledWith(formNames.CODE_VERIFY_EMAIL);
            expect(clearElement).toBeCalledWith(formNames.CODE_VERIFY_EMAIL);
            expect(setHeight).toHaveBeenCalledTimes(3);
            expect(clearElement).toHaveBeenCalledTimes(1);
          });

          it('shallow renders correctly, with loading indicator', async () => {
            const store = mockStore({
              data: {
                auth: initialStateAuth,
                account: initialStateAccount,
              },
              ui: {
                external: initialStateUIExternal,
              },
            });

            const expectedActions = [];

            const wrapper = shallowComponent(store);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly, with email and no email additional', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));

            stateBeforeAccount.fields[fieldNames.EMAIL].value = email;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
                account: stateBeforeAccount,
              },
              ui: {
                external: initialStateUIExternal,
              },
            });

            const expectedActions = [];

            const wrapper = shallowComponent(store);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly, with email additional and no email', async () => {
            const stateBeforeAccount = JSON.parse(JSON.stringify(initialStateAccount));

            stateBeforeAccount.fields[fieldNames.EMAIL_ADDITIONAL].value = emailAdditional;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
                account: stateBeforeAccount,
              },
              ui: {
                external: initialStateUIExternal,
              },
            });

            const expectedActions = [];

            const wrapper = shallowComponent(store);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
          });
        });
      });
    });
  });
});
