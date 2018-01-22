import React from 'react';
import { shallow } from 'enzyme';

import { initialState as initialStateUIAccount } from '../../../../../Reducers/uiReducersAccount';
import { formNames, inputNames } from '../../../../../Constants/uiConstantsAccount';

import FormProfile from '../FormProfile';

const heightRef = jest.fn();
const handleInputChange = jest.fn();

const baseProps = {
  heightRef,
  rowWidthIndent: 10,
  headerWidthBufferRight: 11,
  mediaWidth: 12,
  rowHeight: 13,
  rowHeightBuffer: 14,
  currentFormBool: false,
  editForm: false,
  inputs: null,
  handleInputChange,
};

const name = 'testName';
const email = 'testEmail';
const emailAdditional = 'testEmailAdditional';
const phone = '239-555-0000';

const shallowComponent = props => shallow(<FormProfile {...props} />);

describe('Components', () => {
  describe('PageInternal', () => {
    describe('PageBodyAccount', () => {
      describe('Forms', () => {
        describe('FormProfile', () => {
          afterEach(() => {
            heightRef.mockReset();
            handleInputChange.mockReset();
          });

          it('shallow renders correctly, when currentFormBool and editForm is false', async () => {
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { inputs } = stateBeforeUIAccount.forms[formNames.PROFILE];

            inputs[inputNames[formNames.PROFILE].NAME].value = name;
            inputs[inputNames[formNames.PROFILE].EMAIL].value = email;
            inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL].value = emailAdditional;
            inputs[inputNames[formNames.PROFILE].PHONE].value = phone;

            const props = { ...baseProps, inputs };

            const wrapper = shallowComponent(props);

            expect(wrapper).toMatchSnapshot();
          });

          it('shallow renders correctly, when currentFormBool and editForm is true', async () => {
            const stateBeforeUIAccount = JSON.parse(JSON.stringify(initialStateUIAccount));
            const { inputs } = stateBeforeUIAccount.forms[formNames.PROFILE];

            inputs[inputNames[formNames.PROFILE].NAME].value = name;
            inputs[inputNames[formNames.PROFILE].EMAIL].value = email;
            inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL].value = emailAdditional;
            inputs[inputNames[formNames.PROFILE].PHONE].value = phone;

            const props = {
              ...baseProps,
              inputs,
              currentFormBool: true,
              editForm: true,
            };

            const wrapper = shallowComponent(props);

            expect(wrapper).toMatchSnapshot();
          });
        });
      });
    });
  });
});
