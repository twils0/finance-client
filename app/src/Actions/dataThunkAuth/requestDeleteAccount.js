import axios from 'axios';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes, URLs, axiosConfig } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { formNames, buttonNames, buttonTexts } from '../../Constants/uiConstantsAccount';
import { setAuthStatus, resetAuthState } from '../dataActionsAuth';
import { resetAWSState } from '../dataActionsAWS';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';
import requestLogout from './requestLogout';
import { resetAccountState } from '../dataActionsAccount';
import { resetWatchlistState } from '../dataActionsWatchlist';
import { setCurrentForm, setButtonText, setButtonVisible } from '../uiActionsAccount';

import { demo } from '../../../../mode.config.json';

const requestDeleteAccount = () => async (dispatch, getState) => {
  const state = getState();

  if (state.data.auth.status[statusNames.DELETE_ACCOUNT].status !== requestStatusTypes.LOADING) {
    dispatch(
      setAuthStatus({
        id: statusNames.DELETE_ACCOUNT,
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

    let { user } = state.data.aws;

    try {
      if (!user) {
        ({ user } = await dispatch(requestAWSUser()));
      }

      if (!demo) {
        const idToken = user.signInUserSession.idToken.jwtToken;
        await Promise.all([
          axios.delete(URLs.CUSTOMERS, {
            headers: {
              Authorization: idToken,
            },
            ...axiosConfig.STRIPE,
          }),
          axios.delete(URLs.USERS, {
            headers: {
              Authorization: idToken,
            },
            ...axiosConfig.DB,
          }),
        ]);

        await new Promise((resolve, reject) => {
          user.deleteUser((error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      }
    } catch (errorCatch) {
      const error = handleErrorCatch(errorCatch);
      dispatch(
        setAuthStatus({
          id: statusNames.DELETE_ACCOUNT,
          status: requestStatusTypes.ERROR,
        }),
      );

      if (typeof error === 'object' && error && error.code === 'NotAuthorizedException') {
        dispatch(requestLogout());

        return null;
      }

      if (!demo) {
        raven.captureException(error, {
          logger: 'requestDeleteAccount',
        });
      }

      return Promise.reject(error);
    }

    dispatch(resetAWSState());
    dispatch(resetAccountState());
    dispatch(resetWatchlistState());
    dispatch(resetAuthState());

    if (!demo) {
      raven.setUserContext();
    }
  }

  return null;
};

export default requestDeleteAccount;
