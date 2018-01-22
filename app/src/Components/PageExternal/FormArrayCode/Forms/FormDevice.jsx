import React from 'react';
import PropTypes from 'prop-types';

import { formNames } from '../../../../Constants/uiConstantsExternal';

import Form from '../../../Form';
import Header2 from '../../../Header2';

const FormDevice = (props) => {
  const {
    heightRef, width, formHeightBuffer, inputHeightBuffer,
  } = props;
  const widthString = `${width}px`;
  const formHeightBufferHalfString = `${formHeightBuffer / 2}px`;
  const inputHeightBufferHalfString = `${inputHeightBuffer / 2}px`;
  const inputHeightBufferString = `${inputHeightBuffer}px`;
  const formString = formNames.DEVICE;

  return (
    <Form
      display="block"
      innerRef={heightRef}
      id={formString}
      padding={`${formHeightBufferHalfString} 0`}
      width={widthString}
    >
      <Header2
        colorType="dark"
        themeFontWeight="light"
        padding={`0 0 ${inputHeightBufferString} 0`}
        margin="0"
        height="60px"
      >
        Should we remember this device to speed up the login process in the future?
      </Header2>
      <Header2
        colorType="dark"
        themeFontWeight="light"
        padding={`0 0 ${inputHeightBufferHalfString} 0`}
        margin="0"
        height="52px"
      >
        {'We recommend you select "No" below, if you are on a public computer.'}
      </Header2>
    </Form>
  );
};

FormDevice.propTypes = {
  heightRef: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
};

FormDevice.defaultProps = {};

export default FormDevice;
