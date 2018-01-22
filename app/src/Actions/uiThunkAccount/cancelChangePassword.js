import { formNames, inputNames } from '../../Constants/uiConstantsAccount';
import { setInputValueError } from '../uiActionsAccount';

const cancelChangePassword = () => (dispatch, getState) => {
  const state = getState();

  const { forms } = state.ui.internal.account;

  const changePasswordOldPassword =
    forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD];
  const changePasswordNewPassword =
    forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD];
  const changePasswordNewPassword2 =
    forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2];

  if (changePasswordOldPassword.value || changePasswordOldPassword.errorMessage) {
    changePasswordOldPassword.value = '';
    changePasswordOldPassword.errorMessage = '';

    dispatch(setInputValueError(changePasswordOldPassword));
  }

  if (changePasswordNewPassword.value || changePasswordNewPassword.errorMessage) {
    changePasswordNewPassword.value = '';
    changePasswordNewPassword.errorMessage = '';

    dispatch(setInputValueError(changePasswordNewPassword));
  }

  if (changePasswordNewPassword2.value || changePasswordNewPassword2.errorMessage) {
    changePasswordNewPassword2.value = '';
    changePasswordNewPassword2.errorMessage = '';

    dispatch(setInputValueError(changePasswordNewPassword2));
  }

  return null;
};

export default cancelChangePassword;
