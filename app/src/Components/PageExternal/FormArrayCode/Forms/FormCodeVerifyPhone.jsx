import React from 'react';
import PropTypes from 'prop-types';

import { formNames, inputNames } from '../../../../Constants/uiConstantsExternal';

import Form from '../../../Form';
import Header2 from '../../../Header2';
import Input from '../../../Inputs/Input';
import ButtonContainerResend from '../../../../Containers/PageExternal/FormArrayContainerCode/Buttons/ButtonContainerResend';

const FormCodeVerifyPhone = (props) => {
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
  const inputHeightBufferString = `${inputHeightBuffer}px`;
  const inputHeightBufferHalfString = `${inputHeightBuffer / 2}px`;
  const formString = formNames.CODE_VERIFY_PHONE;
  const header = 'Please enter the verification code sent to your mobile phone.';
  const firstLabel = 'Phone Verification Code';

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
        {header}
      </Header2>
      <Input
        id={inputNames[formString].CODE}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="text"
        label={firstLabel}
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].CODE].value}
        errorMessage={inputs[inputNames[formString].CODE].errorMessage}
        WrapperDiv={{
          padding: inputs[inputNames[formString].CODE].errorMessage
            ? `${inputHeightBufferHalfString} 0 ${inputHeightBufferString} 0`
            : `${inputHeightBufferHalfString} 0`,
        }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
      <ButtonContainerResend />
    </Form>
  );
};

FormCodeVerifyPhone.propTypes = {
  heightRef: PropTypes.func.isRequired,
  currentFormBool: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
  inputs: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default FormCodeVerifyPhone;
