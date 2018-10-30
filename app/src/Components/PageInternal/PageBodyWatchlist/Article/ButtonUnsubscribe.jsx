import React from 'react';
import PropTypes from 'prop-types';
import ButtonTextOnly from '../../../Buttons/ButtonTextOnly';

const ButtonUnsubscribe = (props) => {
  const { statusLoading, handleClick } = props;

  return (
    <ButtonTextOnly
      type="button"
      id="accountButton"
      alignItems="center"
      justifyContent="center"
      fontFamily="Titillium Web"
      fontWeight={400}
      disabled={statusLoading}
      onClick={handleClick}
    >
      {'Unsubscribe'}
    </ButtonTextOnly>
  );
};

ButtonUnsubscribe.propTypes = {
  statusLoading: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default ButtonUnsubscribe;
