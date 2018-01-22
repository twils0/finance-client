import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import { initialState as initialStateAuth } from '../../../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIExternal } from '../../../../../Reducers/uiReducersExternal';
import { requestStatusTypes } from '../../../../../Constants/universalConstants';
import { statusNames } from '../../../../../Constants/dataConstantsAuth';
import { formNames } from '../../../../../Constants/uiConstantsExternal';

import FormContainerDevice from '../FormContainerDevice';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const heightRef = jest.fn();
const setHeight = jest.fn();
const clearElement = jest.fn();

const shallowComponent = store =>
  shallow(
    <FormContainerDevice heightRef={heightRef} setHeight={setHeight} clearElement={clearElement} />,
    {
      context: {
        store,
      },
    },
  ).dive();

describe('Containers', () => {
  describe('PageExternal', () => {
    describe('FormArrayContainerCode', () => {
      describe('Forms', () => {
        describe('FormContainerDevice', () => {
          afterEach(() => {
            heightRef.mockReset();
            setHeight.mockReset();
            clearElement.mockReset();
          });

          it('shallow renders correctly', async () => {
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
              },
            });

            const expectedActions = [];

            const wrapper = shallowComponent(store);

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
            expect(setHeight).toBeCalledWith(formNames.DEVICE);
          });

          it('shallow renders correctly, with componentWillUpdate, componentDidUpdate, and componentWillUnmount', async () => {
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
              },
            });

            const nextProps = {
              statusAuth: {
                [statusNames.SIGN_OUT_DEVICES]: {
                  status: requestStatusTypes.LOADING,
                },
              },
              clearElement,
            };

            const expectedActions = [];

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();

            instance.componentWillUpdate(nextProps);
            instance.componentDidUpdate();
            instance.componentWillUnmount();

            const actions = store.getActions();

            expect(actions).toEqual(expectedActions);
            expect(wrapper).toMatchSnapshot();
            expect(setHeight).toBeCalledWith(formNames.DEVICE);
            expect(clearElement).toBeCalledWith(formNames.DEVICE);
            expect(setHeight).toBeCalledWith(formNames.DEVICE);
            expect(clearElement).toBeCalledWith(formNames.DEVICE);
            expect(setHeight).toHaveBeenCalledTimes(2);
            expect(clearElement).toHaveBeenCalledTimes(2);
          });

          it('shallow renders correctly, with loading indicator', async () => {
            const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));

            stateBeforeAuth.status[statusNames.SIGN_OUT_DEVICES].status =
              requestStatusTypes.LOADING;

            const store = mockStore({
              data: {
                auth: stateBeforeAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
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
