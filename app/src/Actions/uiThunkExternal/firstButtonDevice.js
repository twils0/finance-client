import { pathNames } from '../../Constants/universalConstants';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { setAuthenticated } from '../dataActionsAuth';
import requestSignOutOtherDevices from '../dataThunkAuth/requestSignOutOtherDevices';
import { setInputValueError } from '../uiActionsExternal';

const firstButtonDevice = payload => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'history')) {
    throw new Error(`Please enter a value for the 'history' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.external;

    const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
    const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

    const signOutPayload = {
      email: loginEmail.value,
      password: loginPassword.value,
      remembered: true,
    };

    try {
      await dispatch(requestSignOutOtherDevices(signOutPayload));

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
    } catch (error) {
      payload.history.replace(pathNames.LOGIN);
    }

    return null;
  };
};

export default firstButtonDevice;
