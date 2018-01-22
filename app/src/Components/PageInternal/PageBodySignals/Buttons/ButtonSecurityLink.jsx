import React from 'react';
import PropTypes from 'prop-types';
import ButtonTextOnly from '../../../Buttons/ButtonTextOnly';

const ButtonSecurityLink = (props) => {
  const {
    handleClick, text, securityId, buttonStyles,
  } = props;
  const {
    fontFamily, fontSize, lineHeight, fontWeight, letterSpacing,
  } = buttonStyles;

  return (
    <ButtonTextOnly
      type="button"
      id={securityId}
      alignItems="center"
      justifyContent="center"
      themeFont="default"
      fontFamily={fontFamily}
      lineHeight={lineHeight}
      fontSize={fontSize}
      fontWeight={fontWeight}
      letterSpacing={letterSpacing}
      textTransform="none"
      onClick={handleClick}
    >
      {text}
    </ButtonTextOnly>
  );
};

ButtonSecurityLink.propTypes = {
  buttonStyles: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  securityId: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default ButtonSecurityLink;
