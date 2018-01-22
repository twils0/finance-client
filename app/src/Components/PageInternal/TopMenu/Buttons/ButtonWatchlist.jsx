import React from 'react';
import PropTypes from 'prop-types';
import ButtonTextOnly from '../../../Buttons/ButtonTextOnly';

import { buttonNames } from '../../../../Constants/uiConstantsInternal';

const ButtonWatchlist = (props) => {
  const { handleClick } = props;

  return (
    <ButtonTextOnly
      type="button"
      id={buttonNames.WATCHLIST}
      alignItems="center"
      justifyContent="center"
      fontFamily="Lato"
      fontWeight={400}
      onClick={handleClick}
    >
      Watchlist
    </ButtonTextOnly>
  );
};

ButtonWatchlist.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default ButtonWatchlist;
