import equals from 'validator/lib/equals';

import { errorMessages } from '../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../Constants/uiConstantsAccount';
import requestChangePassword from '../dataThunkAuth/requestChangePassword';
import { setInputValueError } from '../uiActionsAccount';
import handleCancel from '../uiThunkAccount/handleCancel';

const firstButtonChangePassword = () => async (dispatch, getState) => {
  const state = getState();
  const { forms } = state.ui.internal.account;

  const changePasswordOldPassword =
    forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].OLD_PASSWORD];
  const changePasswordNewPassword =
    forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD];
  const changePasswordNewPassword2 =
    forms[formNames.CHANGE_PASSWORD].inputs[inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2];
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

  if (!changePasswordOldPassword.value) {
    changePasswordOldPassword.errorMessage = errorMessages.NO_PASSWORD;
  }

  if (!changePasswordNewPassword.value) {
    changePasswordNewPassword.errorMessage = errorMessages.NO_NEW_PASSWORD;
  } else if (!passwordRegex.test(changePasswordNewPassword.value)) {
    changePasswordNewPassword.errorMessage = errorMessages.INVALID_PASSWORD;
  }

  if (!equals(changePasswordNewPassword.value, changePasswordNewPassword2.value)) {
    changePasswordNewPassword2.errorMessage = errorMessages.NO_MATCH_PASSWORD;
  }

  if (
    changePasswordOldPassword.errorMessage ||
    changePasswordNewPassword.errorMessage ||
    changePasswordNewPassword2.errorMessage
  ) {
    dispatch(setInputValueError(changePasswordOldPassword));
    dispatch(setInputValueError(changePasswordNewPassword));
    dispatch(setInputValueError(changePasswordNewPassword2));
  } else {
    const changePasswordPayload = {
      oldPassword: changePasswordOldPassword.value,
      newPassword: changePasswordNewPassword.value,
    };

    try {
      await dispatch(requestChangePassword(changePasswordPayload));

      dispatch(handleCancel());
    } catch (error) {
      if (
        error.code === 'NotAuthorizedException' &&
        error.message === 'Incorrect username or password.'
      ) {
        changePasswordOldPassword.errorMessage = errorMessages.PASSWORD_NOT_FOUND;
        dispatch(setInputValueError(changePasswordOldPassword));
      } else {
        changePasswordNewPassword2.errorMessage = errorMessages.INTERNAL_ERROR;
        dispatch(setInputValueError(changePasswordNewPassword2));
      }
    }
  }

  return null;
};

export default firstButtonChangePassword;
