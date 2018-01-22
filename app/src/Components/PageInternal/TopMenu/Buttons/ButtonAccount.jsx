import React from 'react';
import PropTypes from 'prop-types';
import ButtonTextOnly from '../../../Buttons/ButtonTextOnly';

import { buttonNames } from '../../../../Constants/uiConstantsInternal';

const ButtonAccount = (props) => {
  const { handleClick } = props;

  return (
    <ButtonTextOnly
      type="button"
      id={buttonNames.ACCOUNT}
      alignItems="center"
      justifyContent="center"
      fontFamily="Lato"
      fontWeight={400}
      onClick={handleClick}
    >
      Account
    </ButtonTextOnly>
  );
};

ButtonAccount.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default ButtonAccount;
