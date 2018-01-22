import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../Buttons/Button';

const ButtonFirst = (props) => {
  const {
    width, heightBuffer, handleClick, disabled, text,
  } = props;
  const widthString = `${width}px`;
  const heightBufferString = `${heightBuffer}px`;

  return (
    <Button
      type="button"
      themeColor="secondary"
      flex="0 0 auto"
      alignItems="center"
      justifyContent="center"
      width={widthString}
      margin={`0 0 ${heightBufferString} 0`}
      disabled={disabled}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
};

ButtonFirst.propTypes = {
  width: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

ButtonFirst.defaultProps = {};

export default ButtonFirst;
