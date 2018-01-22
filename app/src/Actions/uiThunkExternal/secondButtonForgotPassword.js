import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { setCurrentForm, setInputValueError } from '../uiActionsExternal';

const secondButtonForgotPassword = () => async (dispatch, getState) => {
  const state = getState();
  const { forms } = state.ui.external;

  const forgotPasswordEmail =
    forms[formNames.FORGOT_PASSWORD].inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];

  dispatch(setCurrentForm({ current: formNames.LOGIN }));

  if (forgotPasswordEmail.value || forgotPasswordEmail.errorMessage) {
    forgotPasswordEmail.value = '';
    forgotPasswordEmail.errorMessage = '';

    dispatch(setInputValueError(forgotPasswordEmail));
  }

  return null;
};

export default secondButtonForgotPassword;
