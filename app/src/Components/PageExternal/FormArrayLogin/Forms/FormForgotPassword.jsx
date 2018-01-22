import React from 'react';
import PropTypes from 'prop-types';

import { formNames, inputNames } from '../../../../Constants/uiConstantsExternal';

import Form from '../../../Form';
import Header2 from '../../../Header2';
import Input from '../../../Inputs/Input';

const FormForgotPassword = (props) => {
  const {
    heightRef,
    width,
    mediaWidth,
    formHeightBuffer,
    inputHeightBuffer,
    currentFormBool,
    handleInputChange,
    inputs,
  } = props;
  const widthString = `${width}px`;
  const mediaWidthString = `${mediaWidth}px`;
  const formHeightBufferHalfString = `${formHeightBuffer / 2}px`;
  const inputHeightBufferHalfString = `${inputHeightBuffer / 2}px`;
  const inputHeightBufferString = `${inputHeightBuffer}px`;
  const formString = formNames.FORGOT_PASSWORD;

  return (
    <Form
      display="block"
      innerRef={heightRef}
      id={formString}
      width={widthString}
      padding={`${formHeightBufferHalfString} 0`}
    >
      <Header2
        colorType="dark"
        themeFontWeight="light"
        padding={`${inputHeightBufferHalfString} 0`}
        margin="0"
      >
        Please enter the email you use to log in.
      </Header2>
      <Header2
        colorType="dark"
        themeFontWeight="light"
        padding={`0 0 ${inputHeightBufferString} 0`}
        margin="0"
      >
        A confirmation code will be sent to the mobile phone associated with your account.
      </Header2>
      <Input
        id={inputNames[formString].EMAIL}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="email"
        label="Email Address"
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].EMAIL].value}
        errorMessage={inputs[inputNames[formString].EMAIL].errorMessage}
        WrapperDiv={{ padding: `${inputHeightBufferHalfString} 0 0 0` }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
    </Form>
  );
};

FormForgotPassword.propTypes = {
  heightRef: PropTypes.func.isRequired,
  currentFormBool: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
  inputs: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

FormForgotPassword.defaultProps = {};

export default FormForgotPassword;
