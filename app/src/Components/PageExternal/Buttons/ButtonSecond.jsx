import React from 'react';
import PropTypes from 'prop-types';
import ButtonInverted from '../../Buttons/ButtonInverted';

const ButtonSecond = (props) => {
  const {
    width, handleClick, disabled, text,
  } = props;
  const widthString = `${width}px`;

  return (
    <ButtonInverted
      type="button"
      flex="0 0 auto"
      alignItems="center"
      justifyContent="center"
      width={widthString}
      disabled={disabled}
      onClick={handleClick}
    >
      {text}
    </ButtonInverted>
  );
};

ButtonSecond.propTypes = {
  width: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

ButtonSecond.defaultProps = {};

export default ButtonSecond;
