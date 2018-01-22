import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';

import { initialState as initialStateAuth } from '../../../../../Reducers/dataReducersAuth';
import { initialState as initialStateUIExternal } from '../../../../../Reducers/uiReducersExternal';
import { formNames, buttonNames } from '../../../../../Constants/uiConstantsExternal';

import ButtonContainerResend from '../ButtonContainerResend';

import handleClickResendButton from '../../../../../Actions/uiThunkExternal/handleClickResendButton';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('../../../../../Actions/uiThunkExternal/handleClickResendButton', () => jest.fn());
handleClickResendButton.mockReturnValue(() => null);

const history = { test: 'testHistory' };

const clickEvent = {
  preventDefault: jest.fn(),
};

const shallowComponent = store =>
  shallow(<ButtonContainerResend />, {
    context: {
      store,
      router: {
        history,
        route: {
          location: {},
          match: {},
        },
      },
    },
  })
    .dive()
    .dive()
    .dive();

describe('Containers', () => {
  describe('PageExternal', () => {
    describe('FormArrayContainerCode', () => {
      describe('Buttons', () => {
        describe('ButtonContainerResend', () => {
          afterEach(() => {
            handleClickResendButton.mockReset();
          });

          it('shallow renders correctly and button works, with code verify phone', async () => {
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
            stateBeforeUIExternal.forms.current = formNames.CODE_VERIFY_PHONE;

            const phoneText = stateBeforeUIExternal.buttons[buttonNames.RESEND_PHONE].text;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
              },
            });

            const wrapper = shallowComponent(store);

            const instance = wrapper.instance();
            const props = wrapper.props();

            instance.handleClick(clickEvent);

            expect(wrapper).toMatchSnapshot();
            expect(props.text).toEqual(phoneText);
            expect(handleClickResendButton).toBeCalledWith({
              history,
            });
          });

          it('shallow renders correctly, with code verify email', async () => {
            const stateBeforeUIExternal = JSON.parse(JSON.stringify(initialStateUIExternal));
            stateBeforeUIExternal.forms.current = formNames.CODE_VERIFY_EMAIL;

            const emailText = stateBeforeUIExternal.buttons[buttonNames.RESEND_EMAIL].text;

            const store = mockStore({
              data: {
                auth: initialStateAuth,
              },
              ui: {
                external: stateBeforeUIExternal,
              },
            });

            const wrapper = shallowComponent(store);

            const props = wrapper.props();

            expect(wrapper).toMatchSnapshot();
            expect(props.text).toEqual(emailText);
          });
        });
      });
    });
  });
});
