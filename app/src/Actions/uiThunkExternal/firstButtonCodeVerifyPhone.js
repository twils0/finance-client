import { pathNames, requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames, codeTypeNames } from '../../Constants/dataConstantsAuth';
import { fieldNames } from '../../Constants/dataConstantsAccount';
import { errorMessages } from '../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { setAuthenticated } from '../dataActionsAuth';
import { setCurrentForm, setInputValueError } from '../uiActionsExternal';
import requestVerifyFieldConfirm from '../dataThunkAuth/requestVerifyFieldConfirm';

const firstButtonCodePhone = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'history')) {
    throw new Error(`Please enter a value for the 'history' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.external;

    const codeCodeVerifyPhone = forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

    if (!codeCodeVerifyPhone.value) {
      codeCodeVerifyPhone.errorMessage = errorMessages.NO_VERIFICATION_CODE_PHONE;
    }

    if (codeCodeVerifyPhone.errorMessage) {
      dispatch(setInputValueError(codeCodeVerifyPhone));
    } else {
      const { status, codeTypes } = state.data.auth;
      const emailAdditional = state.data.account.fields[fieldNames.EMAIL_ADDITIONAL].value;

      try {
        await dispatch(
          requestVerifyFieldConfirm({
            field: 'phone_number',
            code: codeCodeVerifyPhone.value,
          }),
        );

        if (
          codeTypes[codeTypeNames.VERIFY_EMAIL].needed
          || (codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed && emailAdditional)
        ) {
          dispatch(setCurrentForm({ current: formNames.CODE_VERIFY_EMAIL }));
        } else if (status[statusNames.LOGIN_MFA].status === requestStatusTypes.SUCCESS) {
          dispatch(setCurrentForm({ current: formNames.DEVICE }));
        } else {
          const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
          const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

          const currentTime = new Date();

          currentTime.setMinutes(currentTime.getMinutes() + 30);
          window.sessionStorage.setSecurity('sessionTime', currentTime);

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
        }

        if (codeCodeVerifyPhone.value || codeCodeVerifyPhone.errorMessage) {
          codeCodeVerifyPhone.value = '';
          codeCodeVerifyPhone.errorMessage = '';

          dispatch(setInputValueError(codeCodeVerifyPhone));
        }
      } catch (error) {
        if (typeof error === 'string' && error === 'Username cannot be empty') {
          payload.history.replace(pathNames.LOGIN);

          if (codeCodeVerifyPhone.value || codeCodeVerifyPhone.errorMessage) {
            codeCodeVerifyPhone.value = '';
            codeCodeVerifyPhone.errorMessage = '';

            dispatch(setInputValueError(codeCodeVerifyPhone));
          }
        }

        if (typeof error === 'object' && error && error.code) {
          switch (error.code) {
            case 'LimitExceededException': {
              codeCodeVerifyPhone.errorMessage = errorMessages.LIMIT_EXCEEDED;
              dispatch(setInputValueError(codeCodeVerifyPhone));
              break;
            }
            case 'ExpiredCodeException': {
              codeCodeVerifyPhone.errorMessage = errorMessages.EXPIRED_VERIFICATION_CODE;
              dispatch(setInputValueError(codeCodeVerifyPhone));
              break;
            }
            case 'CodeMismatchException': {
              codeCodeVerifyPhone.errorMessage = errorMessages.INVALID_VERIFICATION_CODE;
              dispatch(setInputValueError(codeCodeVerifyPhone));
              break;
            }
            default: {
              codeCodeVerifyPhone.errorMessage = errorMessages.INTERNAL_ERROR;
              dispatch(setInputValueError(codeCodeVerifyPhone));
              break;
            }
          }
        }
      }
    }

    return null;
  };
};

export default firstButtonCodePhone;
