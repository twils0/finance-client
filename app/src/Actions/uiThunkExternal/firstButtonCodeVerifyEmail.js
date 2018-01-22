import { requestStatusTypes, pathNames } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { setAuthenticated } from '../dataActionsAuth';
import requestVerifyEmailLink from '../dataThunkAuth/requestVerifyEmailLink';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';
import { setCurrentForm, setInputValueError } from '../uiActionsExternal';

const firstButtonCodeEmail = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'match')) {
    throw new Error(`Please enter a value for the 'match' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();
    let login = false;
    const { verificationId } = payload.match.params;
    const { status } = state.data.auth;

    try {
      if (verificationId) {
        let { user } = state.data.aws;

        if (!user) {
          ({ user } = await dispatch(requestAWSUser()));
        }

        await dispatch(requestVerifyEmailLink({ verificationId }));

        if (user) {
          login = true;
        } else {
          payload.history.replace(pathNames.LOGIN);
        }
      } else if (status[statusNames.LOGIN_MFA].status === requestStatusTypes.SUCCESS) {
        dispatch(setCurrentForm({ current: formNames.DEVICE }));
      } else {
        login = true;
      }

      if (login) {
        const { forms } = state.ui.external;
        const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
        const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];
        const currentTime = new Date();

        currentTime.setMinutes(currentTime.getMinutes() + 30);
        window.sessionStorage.setSecurity('sessionTime', currentTime);

        dispatch(setAuthenticated({ authenticated: true }));

        if (loginEmail.value || loginEmail.errorMessage) {
          loginEmail.value = '';
          loginEmail.errorMessage = '';

          dispatch(setInputValueError(loginEmail));
        }

        if (loginPassword.value || loginPassword.errorMessage) {
          loginPassword.value = '';
          loginPassword.errorMessage = '';

          dispatch(setInputValueError(loginPassword));
        }
      }
    } catch (errorCatch) {
      payload.history.replace(pathNames.LOGIN);
    }

    return null;
  };
};

export default firstButtonCodeEmail;
