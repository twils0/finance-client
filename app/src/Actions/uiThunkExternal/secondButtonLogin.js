import { pathNames } from '../../Constants/universalConstants';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { setInputValueError } from '../uiActionsExternal';

const secondButtonLogin = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'history')) {
    throw new Error(`Please enter a value for the 'history' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.external;

    const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
    const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

    payload.history.replace(pathNames.SIGN_UP);

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

    return null;
  };
};

export default secondButtonLogin;
