import React from 'react';
import ReactDOM from 'react-dom';
// import amplify from 'aws-amplify';
// import raven from 'raven-js';

import 'react-hot-loader/patch';
import 'isomorphic-fetch';
import { AppContainer } from 'react-hot-loader';
// import sentry from '../../sentry.config.json';
// import credentials from '../../amplify.config.json';
// import { logging } from '../../mode.config.json';

import App from './App';
/*
amplify.configure(credentials);

if (!logging) {
  raven.config(sentry.url).install();

  window.onerror = (message, url, line, column, error) => {
    if (error) {
      raven.captureException(error, {
        logger: 'windowOnError',
      });
    } else {
      let errorMessage = null;

      if (column) {
        errorMessage = `Message: ${message}\nLine: ${line}\nColumn: ${column}`;
      } else {
        errorMessage = `${message}\nLine Number: ${line}`;
      }

      raven.captureMessage(errorMessage, {
        logger: 'windowOnError',
      });
    }

    return true;
  };
}
*/
const render = (AppInstance) => {
  ReactDOM.render(
    <AppContainer>
      <AppInstance />
    </AppContainer>,
    document.getElementById('root'),
  );
};

if (module.hot) {
  module.hot.accept('./App', () => {
    render(App);
  });
}

render(App);
