import { codeTypeNames } from '../../Constants/dataConstantsAuth';
import { errorMessages } from '../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { fieldNames } from '../../Constants/dataConstantsAccount';
import requestLoginMFA from '../dataThunkAuth/requestLoginMFA';
import { setCurrentForm, setInputValueError } from '../uiActionsExternal';

const firstButtonCodePhone = () => async (dispatch, getState) => {
  let state = getState();
  const { forms } = state.ui.external;

  const codeCodeMFAPhone = forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];

  if (!codeCodeMFAPhone.value) {
    codeCodeMFAPhone.errorMessage = errorMessages.NO_CONFIRMATION_CODE_PHONE;
  }

  if (codeCodeMFAPhone.errorMessage) {
    dispatch(setInputValueError(codeCodeMFAPhone));
  } else {
    try {
      await dispatch(requestLoginMFA({ code: codeCodeMFAPhone.value }));

      state = getState();
      const { codeTypes } = state.data.auth;
      const emailAdditional = state.data.account.fields[fieldNames.EMAIL_ADDITIONAL].value;

      if (
        codeTypes[codeTypeNames.VERIFY_EMAIL].needed
        || (codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed && emailAdditional)
      ) {
        dispatch(setCurrentForm({ current: formNames.CODE_VERIFY_EMAIL }));
      } else {
        dispatch(setCurrentForm({ current: formNames.DEVICE }));
      }

      if (codeCodeMFAPhone.value || codeCodeMFAPhone.errorMessage) {
        codeCodeMFAPhone.value = '';
        codeCodeMFAPhone.errorMessage = '';

        dispatch(setInputValueError(codeCodeMFAPhone));
      }
    } catch (error) {
      switch (error.code) {
        case 'LimitExceededException': {
          codeCodeMFAPhone.errorMessage = errorMessages.LIMIT_EXCEEDED;
          dispatch(setInputValueError(codeCodeMFAPhone));
          break;
        }
        case 'ExpiredCodeException': {
          codeCodeMFAPhone.errorMessage = errorMessages.EXPIRED_CONFIRMATION_CODE;
          dispatch(setInputValueError(codeCodeMFAPhone));
          break;
        }
        case 'CodeMismatchException': {
          codeCodeMFAPhone.errorMessage = errorMessages.INVALID_CONFIRMATION_CODE;
          dispatch(setInputValueError(codeCodeMFAPhone));
          break;
        }
        default: {
          codeCodeMFAPhone.errorMessage = errorMessages.INTERNAL_ERROR;
          dispatch(setInputValueError(codeCodeMFAPhone));
          break;
        }
      }
    }
  }

  return null;
};

export default firstButtonCodePhone;
