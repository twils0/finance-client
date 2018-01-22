import React from 'react';
import PropTypes from 'prop-types';
import ButtonTextOnly from '../../../Buttons/ButtonTextOnly';

const ButtonResend = (props) => {
  const { width, handleClick, text } = props;
  const widthString = `${width}px`;

  return (
    <ButtonTextOnly
      type="button"
      tabIndex="-1"
      textAlign="left"
      width={widthString}
      onClick={handleClick}
    >
      {text}
    </ButtonTextOnly>
  );
};

ButtonResend.propTypes = {
  width: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

ButtonResend.defaultProps = {};

export default ButtonResend;
