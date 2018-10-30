import React from 'react';
import PropTypes from 'prop-types';

import { formNames, inputNames } from '../../../../Constants/uiConstantsExternal';

import Form from '../../../Form';
import Input from '../../../Inputs/Input';

const FormInfo = (props) => {
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
  const formString = formNames.INFO;

  return (
    <Form
      display="block"
      ref={heightRef}
      id={formString}
      width={widthString}
      padding={`${formHeightBufferHalfString} 0`}
    >
      <Input
        id={inputNames[formString].NAME}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="text"
        label="Name"
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].NAME].value}
        errorMessage={inputs[inputNames[formString].NAME].errorMessage}
        WrapperDiv={{
          padding: `0 0 ${inputHeightBufferHalfString} 0`,
        }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
      <Input
        id={inputNames[formString].EMAIL}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="email"
        label="Email Address"
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].EMAIL].value}
        errorMessage={inputs[inputNames[formString].EMAIL].errorMessage}
        WrapperDiv={{ padding: `${inputHeightBufferHalfString} 0` }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
      <Input
        id={inputNames[formString].PHONE}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="tel"
        label="Mobile Phone Number (needed to log in)"
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].PHONE].value}
        errorMessage={inputs[inputNames[formString].PHONE].errorMessage}
        WrapperDiv={{ padding: `${inputHeightBufferHalfString} 0 0 0` }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
    </Form>
  );
};

FormInfo.propTypes = {
  heightRef: PropTypes.func.isRequired,
  currentFormBool: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
  inputs: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

FormInfo.defaultProps = {};

export default FormInfo;
