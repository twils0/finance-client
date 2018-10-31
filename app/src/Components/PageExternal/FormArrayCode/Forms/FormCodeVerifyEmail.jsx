import React from 'react';
import PropTypes from 'prop-types';

import { formNames } from '../../../../Constants/uiConstantsExternal';

import Form from '../../../Form';
import Header2 from '../../../Header2';

const FormCodeVerifyEmail = (props) => {
  const {
    heightRef, width, formHeightBuffer, inputHeightBuffer, email, emailAdditional,
  } = props;
  const widthString = `${width}px`;
  const formHeightBufferHalfString = `${formHeightBuffer / 2}px`;
  const inputHeightBufferHalfString = `${inputHeightBuffer / 2}px`;
  const formString = formNames.CODE_VERIFY_EMAIL;
  let headerText1 = 'Thank you! You have successfully verified your email address. You are now eligible to receive research emails.';
  let headerText2 = "If you would like to log in, please click the 'Continue' button below.";

  if (email && emailAdditional) {
    headerText1 = 'Please check for verification emails at the following two email addresses:';
    headerText2 = 'Research emails cannot be sent to an email address, until it has been verified.';
  } else if (email || emailAdditional) {
    headerText1 = 'Please check for a verification email at the following email address:';
    headerText2 = 'Research emails cannot be sent to an email address, until it has been verified.';
  }

  return (
    <Form
      display="block"
      ref={heightRef}
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
        {headerText1}
      </Header2>
      {!email ? null : (
        <Header2
          colorType="dark"
          themeFontWeight="light"
          padding={`${inputHeightBufferHalfString} 0`}
          margin="0"
        >
          {email}
        </Header2>
      )}
      {!emailAdditional ? null : (
        <Header2
          colorType="dark"
          themeFontWeight="light"
          padding={
            email ? `0 0 ${inputHeightBufferHalfString} 0` : `${inputHeightBufferHalfString} 0`
          }
          margin="0"
        >
          {emailAdditional}
        </Header2>
      )}
      <Header2
        colorType="dark"
        themeFontWeight="light"
        padding={`${inputHeightBufferHalfString} 0 ${inputHeightBufferHalfString} 0`}
        margin="0"
      >
        {headerText2}
      </Header2>
    </Form>
  );
};

FormCodeVerifyEmail.propTypes = {
  heightRef: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
  email: PropTypes.string,
  emailAdditional: PropTypes.string,
};

FormCodeVerifyEmail.defaultProps = {
  email: '',
  emailAdditional: '',
};

export default FormCodeVerifyEmail;
