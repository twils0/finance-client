import React from 'react';
import PropTypes from 'prop-types';
import ButtonTextOnly from '../../../Buttons/ButtonTextOnly';

const ButtonForgotPassword = (props) => {
  const {
    currentForm, width, handleClick, text,
  } = props;
  const widthString = `${width}px`;

  return (
    <ButtonTextOnly
      type="button"
      tabIndex={currentForm === 'loginForm' ? '0' : '-1'}
      textAlign="left"
      width={widthString}
      onClick={handleClick}
    >
      {text}
    </ButtonTextOnly>
  );
};

ButtonForgotPassword.propTypes = {
  width: PropTypes.number.isRequired,
  currentForm: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

ButtonForgotPassword.defaultProps = {};

export default ButtonForgotPassword;
