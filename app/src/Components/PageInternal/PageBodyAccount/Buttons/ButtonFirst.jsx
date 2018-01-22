import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../Buttons/Button';

const ButtonFirst = (props) => {
  const {
    width, heightBuffer, handleClick, disabled, text,
  } = props;
  const widthString = `${width}px`;
  const heightBufferHalfString = `${heightBuffer / 2}px`;

  return (
    <Button
      type="button"
      themeColor="secondary"
      alignItems="center"
      justifyContent="center"
      width={widthString}
      padding="1em 0.75em"
      margin={`0 0 ${heightBufferHalfString} 0`}
      disabled={disabled}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
};

ButtonFirst.propTypes = {
  width: PropTypes.number,
  heightBuffer: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

ButtonFirst.defaultProps = {
  width: 300,
};

export default ButtonFirst;
