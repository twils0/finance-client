import { errorMessages } from '../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../Constants/uiConstantsAccount';
import requestVerifyFieldConfirm from '../dataThunkAuth/requestVerifyFieldConfirm';
import { setInputValueError, setCurrentForm } from '../uiActionsAccount';
import handleCancel from './handleCancel';

const firstButtonCode = () => async (dispatch, getState) => {
  const state = getState();
  const { forms } = state.ui.internal.account;

  const codeCodePhone = forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE];

  if (!codeCodePhone.value) {
    codeCodePhone.errorMessage = errorMessages.NO_VERIFICATION_CODE_PHONE;
  }

  if (codeCodePhone.errorMessage) {
    dispatch(setInputValueError(codeCodePhone));
  } else {
    try {
      await dispatch(
        requestVerifyFieldConfirm({ field: 'phone_number', code: codeCodePhone.value }),
      );

      dispatch(handleCancel());
      dispatch(setCurrentForm({ current: formNames.PROFILE }));
    } catch ({ field, error }) {
      if (typeof error === 'object' && error && error.code) {
        switch (error.code) {
          case 'CodeMismatchException': {
            codeCodePhone.errorMessage = errorMessages.INVALID_VERIFICATION_CODE;
            dispatch(setInputValueError(codeCodePhone));
            break;
          }
          default: {
            codeCodePhone.errorMessage = errorMessages.INTERNAL_ERROR;
            dispatch(setInputValueError(codeCodePhone));
            break;
          }
        }
      }
    }
  }

  return null;
};

export default firstButtonCode;
