import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { setAuthStatus } from '../dataActionsAuth';
import { setCurrentForm, setInputValueError } from '../../Actions/uiActionsExternal';

const secondButtonResetPassword = () => async (dispatch, getState) => {
  const state = getState();
  const { forms } = state.ui.external;
  const { status } = state.data.auth;

  const forgotPasswordEmail =
    forms[formNames.FORGOT_PASSWORD].inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];
  const resetPasswordCode =
    forms[formNames.RESET_PASSWORD].inputs[inputNames[formNames.RESET_PASSWORD].CODE];
  const resetPasswordPassword =
    forms[formNames.RESET_PASSWORD].inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD];
  const resetPasswordPassword2 =
    forms[formNames.RESET_PASSWORD].inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD2];

  if (forgotPasswordEmail.value || forgotPasswordEmail.errorMessage) {
    forgotPasswordEmail.value = '';
    forgotPasswordEmail.errorMessage = '';

    dispatch(setInputValueError(forgotPasswordEmail));
  }

  dispatch(setCurrentForm({ current: formNames.LOGIN }));

  if (status[statusNames.FORGOT_PASSWORD].status !== requestStatusTypes.IDLE) {
    dispatch(setAuthStatus({
      id: statusNames.FORGOT_PASSWORD,
      status: requestStatusTypes.IDLE,
    }));
  }

  if (resetPasswordCode.value || resetPasswordCode.errorMessage) {
    resetPasswordCode.value = '';
    resetPasswordCode.errorMessage = '';

    dispatch(setInputValueError(resetPasswordCode));
  }

  if (resetPasswordPassword.value || resetPasswordPassword.errorMessage) {
    resetPasswordPassword.value = '';
    resetPasswordPassword.errorMessage = '';

    dispatch(setInputValueError(resetPasswordPassword));
  }

  if (resetPasswordPassword2.value || resetPasswordPassword2.errorMessage) {
    resetPasswordPassword2.value = '';
    resetPasswordPassword2.errorMessage = '';

    dispatch(setInputValueError(resetPasswordPassword2));
  }

  return null;
};

export default secondButtonResetPassword;
