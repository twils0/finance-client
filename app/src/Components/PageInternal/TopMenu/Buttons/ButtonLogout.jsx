import React from 'react';
import PropTypes from 'prop-types';
import ButtonInverted from '../../../Buttons/ButtonInverted';

import { buttonNames } from '../../../../Constants/uiConstantsInternal';

const ButtonLogout = (props) => {
  const { handleClick } = props;

  return (
    <ButtonInverted
      type="button"
      id={buttonNames.LOGOUT}
      themeColor="secondary"
      alignItems="center"
      justifyContent="center"
      padding="0.75em 0.75em"
      onClick={handleClick}
    >
      Log Out
    </ButtonInverted>
  );
};

ButtonLogout.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default ButtonLogout;
