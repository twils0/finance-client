import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { formNames, buttonNames, buttonTexts } from '../../Constants/uiConstantsAccount';
import { setAuthStatus, resetAuthState } from '../dataActionsAuth';
import { resetAWSState } from '../dataActionsAWS';
import { resetAccountState } from '../dataActionsAccount';
import { resetWatchlistState } from '../dataActionsWatchlist';
import { setCurrentForm, setButtonText, setButtonVisible } from '../uiActionsAccount';

const requestLogout = () => async (dispatch, getState) => {
  const state = getState();

  if (state.data.auth.status[statusNames.LOGOUT].status !== requestStatusTypes.LOADING) {
    dispatch(
      setAuthStatus({
        id: statusNames.LOGOUT,
        status: requestStatusTypes.LOADING,
      }),
    );

    if (state.ui.internal.account.forms.current !== formNames.PROFILE) {
      dispatch(setCurrentForm({ current: formNames.PROFILE }));
    }

    if (state.ui.internal.account.buttons[buttonNames.FIRST].text !== buttonTexts.EDIT) {
      dispatch(setButtonText({ id: buttonNames.FIRST, text: buttonTexts.EDIT }));
    }

    if (state.ui.internal.account.buttons[buttonNames.SECOND].visible) {
      dispatch(setButtonVisible({ id: buttonNames.SECOND, visible: false }));
    }

    try {
      await Auth.signOut();
    } catch (errorCatch) {
      const error = handleErrorCatch(errorCatch);

      dispatch(
        setAuthStatus({
          id: statusNames.LOGOUT,
          status: requestStatusTypes.ERROR,
        }),
      );

      raven.captureException(error, {
        logger: 'requestLogout',
      });

      return Promise.reject(error);
    }

    window.sessionStorage.removeSecurity('sessionTime');

    const intervalId = window.sessionStorage.getSecurity('interval');

    if (intervalId) {
      window.clearInterval(intervalId);

      window.sessionStorage.removeSecurity('interval');
    }

    dispatch(resetAWSState());
    dispatch(resetAccountState());
    dispatch(resetWatchlistState());
    dispatch(resetAuthState());

    raven.setUserContext();
  }

  return null;
};

export default requestLogout;
