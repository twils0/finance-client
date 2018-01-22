import equals from 'validator/lib/equals';

import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { errorMessages } from '../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { setAuthStatus } from '../dataActionsAuth';
import requestResetPassword from '../dataThunkAuth/requestResetPassword';
import { setCurrentForm, setInputValueError } from '../uiActionsExternal';

const firstButtonResetPassword = () => async (dispatch, getState) => {
  const state = getState();
  const { forms } = state.ui.external;

  const forgotPasswordEmail = forms[formNames.FORGOT_PASSWORD].inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];
  const resetPasswordCode = forms[formNames.RESET_PASSWORD].inputs[inputNames[formNames.RESET_PASSWORD].CODE];
  const resetPasswordPassword = forms[formNames.RESET_PASSWORD].inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD];
  const resetPasswordPassword2 = forms[formNames.RESET_PASSWORD].inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD2];
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

  if (!resetPasswordCode.value) {
    resetPasswordCode.errorMessage = errorMessages.NO_VERIFICATION_CODE_PHONE;
  }

  if (!resetPasswordPassword.value) {
    resetPasswordPassword.errorMessage = errorMessages.NO_PASSWORD;
  } else if (!passwordRegex.test(resetPasswordPassword.value)) {
    resetPasswordPassword.errorMessage = errorMessages.INVALID_PASSWORD;
  }

  if (!equals(resetPasswordPassword.value, resetPasswordPassword2.value)) {
    resetPasswordPassword2.errorMessage = errorMessages.NO_MATCH_PASSWORD;
  }

  if (
    resetPasswordCode.errorMessage
    || resetPasswordPassword.errorMessage
    || resetPasswordPassword2.errorMessage
  ) {
    dispatch(setInputValueError(resetPasswordCode));
    dispatch(setInputValueError(resetPasswordPassword));
    dispatch(setInputValueError(resetPasswordPassword2));
  } else {
    const resetPasswordPayload = {
      email: forgotPasswordEmail.value,
      code: resetPasswordCode.value,
      password: resetPasswordPassword.value,
    };

    try {
      await dispatch(requestResetPassword(resetPasswordPayload));

      dispatch(setCurrentForm({ current: formNames.LOGIN }));

      if (forgotPasswordEmail.value || forgotPasswordEmail.errorMessage) {
        forgotPasswordEmail.value = '';
        forgotPasswordEmail.errorMessage = '';

        dispatch(setInputValueError(forgotPasswordEmail));
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

      dispatch(
        setAuthStatus({
          id: statusNames.RESET_PASSWORD,
          status: requestStatusTypes.IDLE,
        }),
      );
    } catch (error) {
      switch (error.code) {
        case 'LimitExceededException': {
          resetPasswordPassword2.errorMessage = errorMessages.LIMIT_EXCEEDED;
          dispatch(setInputValueError(resetPasswordPassword2));
          break;
        }
        case 'ExpiredCodeException': {
          resetPasswordPassword2.errorMessage = errorMessages.EXPIRED_VERIFICATION_CODE;
          dispatch(setInputValueError(resetPasswordPassword2));
          break;
        }
        case 'CodeMismatchException': {
          resetPasswordPassword2.errorMessage = errorMessages.INVALID_VERIFICATION_CODE;
          dispatch(setInputValueError(resetPasswordPassword2));
          break;
        }
        default: {
          resetPasswordPassword2.errorMessage = errorMessages.INTERNAL_ERROR;
          dispatch(setInputValueError(resetPasswordPassword2));
          break;
        }
      }
    }
  }

  return null;
};

export default firstButtonResetPassword;
