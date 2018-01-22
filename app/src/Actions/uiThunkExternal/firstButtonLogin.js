import isEmail from 'validator/lib/isEmail';

import { pathNames } from '../../Constants/universalConstants';
import { codeTypeNames } from '../../Constants/dataConstantsAuth';
import { errorMessages } from '../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { fieldNames } from '../../Constants/dataConstantsAccount';
import requestLogin from '../dataThunkAuth/requestLogin';
import requestSignUpResendPhone from '../dataThunkAuth/requestSignUpResendPhone';
import { setCurrentForm, setInputValueError } from '../uiActionsExternal';

const firstButtonLogin = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'history')) {
    throw new Error(`Please enter a value for the 'history' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    let state = getState();
    const { forms } = state.ui.external;

    const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
    const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

    if (!loginEmail.value) {
      loginEmail.errorMessage = errorMessages.NO_EMAIL;
    } else if (!isEmail(loginEmail.value)) {
      loginEmail.errorMessage = errorMessages.INVALID_EMAIL;
    }

    if (!loginPassword.value) {
      loginPassword.errorMessage = errorMessages.NO_PASSWORD;
    }

    if (loginEmail.errorMessage || loginPassword.errorMessage) {
      dispatch(setInputValueError(loginEmail));
      dispatch(setInputValueError(loginPassword));
    } else {
      const loginPayload = {
        email: loginEmail.value,
        password: loginPassword.value,
      };

      try {
        const mfa = await dispatch(requestLogin(loginPayload));

        state = getState();
        const { codeTypes } = state.data.auth;
        const emailAdditional = state.data.account.fields[fieldNames.EMAIL_ADDITIONAL].value;

        if (typeof mfa === 'boolean' && mfa) {
          payload.history.replace(pathNames.CODE);
        } else if (codeTypes[codeTypeNames.VERIFY_PHONE].needed) {
          payload.history.replace(pathNames.CODE);
          dispatch(setCurrentForm({ current: formNames.CODE_VERIFY_PHONE }));
        } else if (
          codeTypes[codeTypeNames.VERIFY_EMAIL].needed
          || (codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed && emailAdditional)
        ) {
          payload.history.replace(pathNames.CODE);
          dispatch(setCurrentForm({ current: formNames.CODE_VERIFY_EMAIL }));
        }
      } catch (error) {
        switch (error.code) {
          case 'LimitExceededException': {
            loginPassword.errorMessage = errorMessages.LIMIT_EXCEEDED;
            dispatch(setInputValueError(loginPassword));
            break;
          }
          case 'UserNotFoundException': {
            loginEmail.errorMessage = errorMessages.EMAIL_NOT_FOUND;
            dispatch(setInputValueError(loginEmail));
            break;
          }
          case 'NotAuthorizedException': {
            if (error.message === 'Incorrect username or password.') {
              loginPassword.errorMessage = errorMessages.PASSWORD_NOT_FOUND;
              dispatch(setInputValueError(loginPassword));
            } else {
              loginPassword.errorMessage = errorMessages.INTERNAL_ERROR;
              dispatch(setInputValueError(loginPassword));
            }
            break;
          }
          case 'UserNotConfirmedException': {
            dispatch(requestSignUpResendPhone({ email: loginEmail.value }));

            payload.history.replace(pathNames.CODE);
            dispatch(setCurrentForm({ current: formNames.CODE_VERIFY_PHONE }));
            break;
          }
          default: {
            loginPassword.errorMessage = errorMessages.INTERNAL_ERROR;
            dispatch(setInputValueError(loginPassword));
            break;
          }
        }
      }
    }

    return null;
  };
};

export default firstButtonLogin;
