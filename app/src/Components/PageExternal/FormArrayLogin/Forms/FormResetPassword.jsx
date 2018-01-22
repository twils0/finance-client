import React from 'react';
import PropTypes from 'prop-types';

import { formNames, inputNames } from '../../../../Constants/uiConstantsExternal';

import Form from '../../../Form';
import Input from '../../../Inputs/Input';
import Header2 from '../../../Header2';

const FormResetPassword = (props) => {
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
  const formString = formNames.RESET_PASSWORD;

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
        padding={`0 0 ${inputHeightBufferHalfString} 0`}
        margin="0"
      >
        Please enter the verification code sent to your mobile phone and your new password.
      </Header2>
      <Input
        id={inputNames[formString].CODE}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="text"
        label="Verification Code"
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].CODE].value}
        errorMessage={inputs[inputNames[formString].CODE].errorMessage}
        WrapperDiv={{ padding: `${inputHeightBufferHalfString} 0` }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
      <Input
        id={inputNames[formString].PASSWORD}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="password"
        label="New Password"
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].PASSWORD].value}
        errorMessage={inputs[inputNames[formString].PASSWORD].errorMessage}
        WrapperDiv={{ padding: `${inputHeightBufferHalfString} 0` }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
      <Input
        id={inputNames[formString].PASSWORD2}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="password"
        label="Verify New Password"
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].PASSWORD2].value}
        errorMessage={inputs[inputNames[formString].PASSWORD2].errorMessage}
        WrapperDiv={{ padding: `${inputHeightBufferHalfString} 0 0 0` }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
    </Form>
  );
};

FormResetPassword.propTypes = {
  heightRef: PropTypes.func.isRequired,
  currentFormBool: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
  inputs: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

FormResetPassword.defaultProps = {};

export default FormResetPassword;
