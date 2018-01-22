import { combineReducers } from 'redux';

export const initialState = {
  utilities: {
    pageBody: {
      mediaWidth: 925,
    },
    list: {
      springSettings: { stiffness: 300, damping: 50 },
      width: 300,
      widthBufferLeft: 30,
      widthBufferRight: 15,
      widthBufferScrollBar: 20,
      heightBuffer: 60,
      rowWidthIndent: 10,
      rowHeight: 61,
      rowHeightIndent: 5,
      rowHeightBufferBottom: 10,
      burgerMenuIconWidth: 30,
      burgerMenuIconWidthIndent: 10,
      burgerMenuIconHeight: 27,
    },
    separatorLine: {
      width: 4,
      heightBuffer: 40,
    },
    article: {
      widthBuffer: 60,
      widthIndent: 30,
      mediaWidth: 700,
      heightBuffer: 60,
      heightIndent: 30,
    },
    articleMenu: {
      height: 75,
    },
    articleMenuSecurity: {
      widthBuffer: 40,
      heightBuffer: 20,
    },
    articleGrid: {
      widthBuffer: 20,
      widthIndent: 10,
      heightBuffer: 20,
      heightIndent: 10,
    },
    articleTable: {
      width: 470,
      widthBuffer: 20,
      heightBuffer: 20,
    },
    articleDescription: {
      minWidth: 250,
      widthBuffer: 20,
      heightBuffer: 20,
    },
  },
};

initialState.utilities.list.responsiveHeight = 4 * (initialState.utilities.list.rowHeight + initialState.utilities.list.rowHeightBufferBottom);

initialState.utilities.article.outsideWidthTotal = initialState.utilities.list.width
  + initialState.utilities.list.widthBufferLeft
  + initialState.utilities.list.widthBufferRight
  + initialState.utilities.list.widthBufferScrollBar
  + initialState.utilities.separatorLine.width
  + initialState.utilities.article.widthBuffer;

export const utilities = (state = initialState.utilities) => state;

const uiReducersWatchlist = combineReducers({
  utilities,
});

export default uiReducersWatchlist;
