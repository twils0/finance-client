import { createGlobalStyle } from 'styled-components';
import WebFont from 'webfontloader';

import { requestStatusTypes } from '../../Constants/universalConstants';
import { setFontsStatus } from '../uiActionsApp';

const loadFonts = () => (dispatch, getState) => {
  const state = getState();

  if (
    state.ui.app.fonts.status !== requestStatusTypes.LOADING
    || state.ui.app.fonts.status !== requestStatusTypes.SUCCESS
  ) {
    dispatch(setFontsStatus({ status: requestStatusTypes.LOADING }));

    WebFont.load({
      google: {
        families: ['Montserrat:400,600', 'Roboto Condensed:300,400', 'Lato:400,600'],
      },
      active: () => dispatch(setFontsStatus({ status: requestStatusTypes.SUCCESS })),
      fontinactive: () => dispatch(setFontsStatus({ status: requestStatusTypes.ERROR })),
    });

    const GlobalFontStyle = createGlobalStyle`
      @font-face {
        font-family: Montserrat;
      }
      @font-face {
        font-family: Roboto Condensed;
      }
      @font-face {
        font-family: Lato;
      }
    `;

    return GlobalFontStyle;
  }

  return null;
};

export default loadFonts;
