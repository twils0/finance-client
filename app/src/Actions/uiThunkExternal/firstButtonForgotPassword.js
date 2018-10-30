import isEmail from 'validator/lib/isEmail';

import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { errorMessages } from '../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { setAuthStatus } from '../dataActionsAuth';
import requestForgotPassword from '../dataThunkAuth/requestForgotPassword';
import { setCurrentForm, setInputValueError } from '../uiActionsExternal';

const firstButtonForgotPassword = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'history')) {
    throw new Error(`Please enter a value for the 'history' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.external;

    const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
    const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];
    const forgotPasswordEmail = forms[formNames.FORGOT_PASSWORD].inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];

    if (!forgotPasswordEmail.value) {
      forgotPasswordEmail.errorMessage = errorMessages.NO_EMAIL;
    } else if (!isEmail(forgotPasswordEmail.value)) {
      forgotPasswordEmail.errorMessage = errorMessages.INVALID_EMAIL;
    }

    if (forgotPasswordEmail.errorMessage) {
      dispatch(setInputValueError(forgotPasswordEmail));
    } else {
      try {
        await dispatch(requestForgotPassword({ email: forgotPasswordEmail.value }));

        dispatch(setCurrentForm({ current: formNames.RESET_PASSWORD }));

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

        dispatch(
          setAuthStatus({
            id: statusNames.FORGOT_PASSWORD,
            status: requestStatusTypes.IDLE,
          }),
        );
      } catch (error) {
        switch (error.code) {
          case 'LimitExceededException': {
            forgotPasswordEmail.errorMessage = errorMessages.LIMIT_EXCEEDED;
            dispatch(setInputValueError(forgotPasswordEmail));
            break;
          }
          case 'UserNotFoundException': {
            forgotPasswordEmail.errorMessage = errorMessages.EMAIL_NOT_FOUND;
            dispatch(setInputValueError(forgotPasswordEmail));
            break;
          }
          default: {
            forgotPasswordEmail.errorMessage = errorMessages.INTERNAL_ERROR;
            dispatch(setInputValueError(forgotPasswordEmail));
            break;
          }
        }
      }
    }

    return null;
  };
};

export default firstButtonForgotPassword;
