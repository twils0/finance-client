import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import theme from '../../../../themes';

import { pathNames } from '../../../../Constants/universalConstants';
import { formNames, inputNames } from '../../../../Constants/uiConstantsExternal';

import Form from '../../../Form';
import Header2 from '../../../Header2';
import Input from '../../../Inputs/Input';
import Paragraph from '../../../Paragraph';

const FormSignUp = (props) => {
  const {
    heightRef,
    width,
    mediaWidth,
    formHeightBuffer,
    inputHeightBuffer,
    currentFormBool,
    inputs,
    handleInputChange,
  } = props;
  const widthString = `${width}px`;
  const mediaWidthString = `${mediaWidth}px`;
  const formHeightBufferHalfString = `${formHeightBuffer / 2}px`;
  const inputHeightBufferHalfString = `${inputHeightBuffer / 2}px`;
  const formString = formNames.SIGN_UP;

  return (
    <Form
      display="block"
      ref={heightRef}
      id={formString}
      width={widthString}
      padding={`${formHeightBufferHalfString} 0`}
    >
      <Header2
        display="block"
        colorType="dark"
        themeFontWeight="light"
        padding={`0 0 ${inputHeightBufferHalfString} 0`}
        margin="0"
        height="96px" // hardcoded to avoid IE issues
        fontSize="17px"
      >
        Please enter a password containing at least 8 characters, one of the following special
        characters, $@!%*#?&, one letter, and one number.
      </Header2>
      <Input
        id={inputNames[formString].PASSWORD}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="password"
        label="Password"
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
        label="Verify Password"
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].PASSWORD2].value}
        errorMessage={inputs[inputNames[formString].PASSWORD2].errorMessage}
        WrapperDiv={{ padding: `${inputHeightBufferHalfString} 0` }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
      <Paragraph
        themeSize="text"
        margin="0"
        padding={`${inputHeightBufferHalfString} 0`}
        height="70px" // hardcoded to avoid IE issues
      >
        {
          'By clicking the "Sign Up" button below to sign up, you agree to abide by and acknowledge you have read our '
        }
        {
          <Link
            style={{
              color: theme.color.secondary.default,
              fontFamily: theme.font.default,
              fontSize: theme.size.font.text,
              lineHeight: theme.lineHeight.default,
            }}
            href={pathNames.TERMS}
            to={pathNames.TERMS}
            target="_blank"
            tabIndex="-1"
          >
            Terms and Conditions.
          </Link>
        }
      </Paragraph>
    </Form>
  );
};

FormSignUp.propTypes = {
  heightRef: PropTypes.func.isRequired,
  currentFormBool: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
  inputs: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

FormSignUp.defaultProps = {};

export default FormSignUp;
