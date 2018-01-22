import React from 'react';
import PropTypes from 'prop-types';
import ButtonInverted from '../../../Buttons/ButtonInverted';

const ButtonSecond = (props) => {
  const {
    width, heightBuffer, handleClick, disabled, text,
  } = props;
  const widthString = `${width}px`;
  const heightBufferHalfString = `${heightBuffer / 2}px`;

  return (
    <ButtonInverted
      type="button"
      alignItems="center"
      justifyContent="center"
      width={widthString}
      padding="calc(1em - 2px) calc(0.75em - 2px)"
      margin={`0 0 ${heightBufferHalfString} 0`}
      onClick={handleClick}
      disabled={disabled}
    >
      {text}
    </ButtonInverted>
  );
};

ButtonSecond.propTypes = {
  width: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

ButtonSecond.defaultProps = {};

export default ButtonSecond;
