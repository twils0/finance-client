import React from 'react';
import PropTypes from 'prop-types';

import { formNames, inputNames } from '../../../../Constants/uiConstantsExternal';

import Form from '../../../Form';
import Input from '../../../Inputs/Input';
import ButtonContainerForgotPassword from '../../../../Containers/PageExternal/FormArrayContainerLogin/Buttons/ButtonContainerForgotPassword';

const FormLogin = (props) => {
  const {
    heightRef,
    currentFormBool,
    width,
    mediaWidth,
    formHeightBuffer,
    inputHeightBuffer,
    inputs,
    handleInputChange,
  } = props;
  const widthString = `${width}px`;
  const mediaWidthString = `${mediaWidth}px`;
  const formHeightBufferHalfString = `${formHeightBuffer / 2}px`;
  const inputHeightBufferString = `${inputHeightBuffer}px`;
  const inputHeightBufferHalfString = `${inputHeightBuffer / 2}px`;
  const formString = formNames.LOGIN;

  return (
    <Form
      display="block"
      innerRef={heightRef}
      id={formString}
      width={widthString}
      padding={`${formHeightBufferHalfString} 0`}
    >
      <Input
        id={inputNames[formString].EMAIL}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="email"
        label="Email Address"
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].EMAIL].value}
        errorMessage={inputs[inputNames[formString].EMAIL].errorMessage}
        WrapperDiv={{ padding: `0 0 ${inputHeightBufferHalfString} 0` }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
      <Input
        id={inputNames[formString].PASSWORD}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="password"
        label="Password"
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].PASSWORD].value}
        errorMessage={inputs[inputNames[formString].PASSWORD].errorMessage}
        WrapperDiv={{
          padding: inputs[inputNames[formString].PASSWORD].errorMessage
            ? `${inputHeightBufferHalfString} 0 ${inputHeightBufferString} 0`
            : `${inputHeightBufferHalfString} 0`,
        }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
      <ButtonContainerForgotPassword />
    </Form>
  );
};

FormLogin.propTypes = {
  heightRef: PropTypes.func.isRequired,
  currentFormBool: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
  inputs: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

FormLogin.defaultProps = {};

export default FormLogin;
