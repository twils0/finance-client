import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';

import { initialState as initialStateAuth } from '../../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIExternal } from '../../../../Reducers/uiReducersExternal';
import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { statusNames } from '../../../../Constants/dataConstantsAuth';

import ButtonContainerFirst from '../ButtonContainerFirst';

import handleClickFirstButton from '../../../../Actions/uiThunkExternal/handleClickFirstButton';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('../../../../Actions/uiThunkExternal/handleClickFirstButton', () => jest.fn());
handleClickFirstButton.mockReturnValue(() => null);

const history = { test: 'testHistory' };
const match = { test: 'testMatch ' };

const clickEvent = {
  preventDefault: jest.fn(),
};
const stripeElement = { test: 'testStripeElement' };
const resetStripeElement = jest.fn();

const shallowComponent = store => shallow(
  <ButtonContainerFirst stripeElement={stripeElement} resetStripeElement={resetStripeElement} />,
  {
    context: {
      store,
      router: {
        history,
        route: {
          location: {},
          match,
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
    describe('Buttons', () => {
      describe('ButtonContainerFirst', () => {
        afterEach(() => {
          handleClickFirstButton.mockReset();
        });

        it('shallow renders correctly and button works, with disabled false', async () => {
          const store = mockStore({
            data: {
              auth: initialStateAuth,
            },
            ui: {
              external: initialStateUIExternal,
            },
          });

          const wrapper = shallowComponent(store);

          const instance = wrapper.instance();
          const props = wrapper.props();

          instance.handleClick(clickEvent);

          expect(wrapper).toMatchSnapshot();
          expect(props.disabled).toEqual(false);
          expect(handleClickFirstButton).toBeCalledWith({
            history,
            match,
            stripeElement,
            resetStripeElement,
          });
        });

        it('shallow renders correctly, with disabled true', async () => {
          const stateBeforeAuth = JSON.parse(JSON.stringify(initialStateAuth));
          stateBeforeAuth.status[statusNames.SIGN_UP].status = requestStatusTypes.LOADING;

          const store = mockStore({
            data: {
              auth: stateBeforeAuth,
            },
            ui: {
              external: initialStateUIExternal,
            },
          });

          const wrapper = shallowComponent(store);

          const props = wrapper.props();

          expect(wrapper).toMatchSnapshot();
          expect(props.disabled).toEqual(true);
        });
      });
    });
  });
});
