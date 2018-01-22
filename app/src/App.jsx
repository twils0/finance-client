import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Loadable from 'react-loadable';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { createLogger } from 'redux-logger';

import theme from './themes';
import { logging } from '../../mode.config.json';

import { pathNames } from './Constants/universalConstants';
import { imageNames } from './Constants/uiConstantsApp';
import loadFonts from './Actions/uiThunkApp/loadFonts';
import loadImage from './Actions/uiThunkApp/loadImage';
import rootReducer from './rootReducer';

import Loading from './Components/Loading';

const preloadedState = {};
let middleware = null;

if (logging) {
  const logger = createLogger({ duration: true, logErrors: true, diff: true });

  middleware = applyMiddleware(thunk, logger);
} else {
  middleware = applyMiddleware(thunk);
}

export const store = createStore(rootReducer, preloadedState, middleware);

const GlobalFontStyle = store.dispatch(loadFonts());
store.dispatch(loadImage({ id: imageNames.EXAMPLE_HEADER }));

const LoadableInternal = Loadable({
  loader: () => import('./Containers/PageInternal/PageContainerInternal'),
  loading: Loading,
  delay: 0,
});

const LoadableTerms = Loadable({
  loader: () => import('./Containers/PageExternal/PageBodyContainerTerms'),
  loading: Loading,
  delay: 0,
});

const LoadableExternal = Loadable({
  loader: () => import('./Containers/PageExternal/PageContainerExternal'),
  loading: Loading,
  delay: 0,
});

const App = () => (
  <ReduxProvider store={store}>
    <ThemeProvider key="themeProvider" theme={theme}>
      <GlobalFontStyle />
      <BrowserRouter>
        <Switch>
          <Route path={pathNames.WATCHLIST_SECURITY_ID} component={LoadableInternal} />
          <Route path={pathNames.ACCOUNT} component={LoadableInternal} />
          <Route path={pathNames.LOGIN} component={LoadableExternal} />
          <Route path={pathNames.SIGN_UP} component={LoadableExternal} />
          <Route path={pathNames.CODE_VERIFY_EMAIL} component={LoadableExternal} />
          <Route path={pathNames.TERMS} component={LoadableTerms} />
          <Route path={pathNames.DEFAULT} component={LoadableExternal} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  </ReduxProvider>
);

export default App;
