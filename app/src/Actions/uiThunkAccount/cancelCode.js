import { formNames, inputNames } from '../../Constants/uiConstantsAccount';
import { setInputValueError } from '../uiActionsAccount';

const cancelCode = () => (dispatch, getState) => {
  const state = getState();

  const { forms } = state.ui.internal.account;

  const codeCodePhone = forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_PHONE];
  const codeCodeEmail = forms[formNames.CODE].inputs[inputNames[formNames.CODE].CODE_EMAIL];

  if (codeCodePhone.value || codeCodePhone.errorMessage) {
    codeCodePhone.value = '';
    codeCodePhone.errorMessage = '';

    dispatch(setInputValueError(codeCodePhone));
  }
  if (codeCodeEmail.value || codeCodeEmail.errorMessage) {
    codeCodeEmail.value = '';
    codeCodeEmail.errorMessage = '';

    dispatch(setInputValueError(codeCodeEmail));
  }

  return null;
};

export default cancelCode;
