import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { setCurrentForm, setInputValueError } from '../uiActionsExternal';

const secondButtonSignUp = () => async (dispatch, getState) => {
  const state = getState();
  const { forms } = state.ui.external;

  const signUpPassword = forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD];
  const signUpPassword2 = forms[formNames.SIGN_UP].inputs[inputNames[formNames.SIGN_UP].PASSWORD2];

  dispatch(setCurrentForm({ current: formNames.INFO }));

  if (signUpPassword.value || signUpPassword.errorMessage) {
    signUpPassword.value = '';
    signUpPassword.errorMessage = '';

    dispatch(setInputValueError(signUpPassword));
  }

  if (signUpPassword2.value || signUpPassword2.errorMessage) {
    signUpPassword2.value = '';
    signUpPassword2.errorMessage = '';

    dispatch(setInputValueError(signUpPassword2));
  }

  return null;
};

export default secondButtonSignUp;
