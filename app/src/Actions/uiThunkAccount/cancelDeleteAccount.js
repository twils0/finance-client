import {
  buttonNames,
  buttonTexts,
  formNames,
  inputNames,
} from '../../Constants/uiConstantsAccount';
import {
  setInputValueError,
  setFormEdit,
  setButtonText,
  setButtonVisible,
} from '../uiActionsAccount';

const cancelDeleteAccount = () => (dispatch, getState) => {
  const state = getState();

  const { forms } = state.ui.internal.account;
  const deleteAccountConfirm =
    forms[formNames.DELETE_ACCOUNT].inputs[inputNames[formNames.DELETE_ACCOUNT].CONFIRM];

  if (state.ui.internal.account.forms[formNames.DELETE_ACCOUNT].edit) {
    dispatch(setFormEdit({ id: formNames.DELETE_ACCOUNT, edit: false }));
  }
  if (state.ui.internal.account.buttons[buttonNames.FIRST].text !== buttonTexts.DELETE) {
    dispatch(setButtonText({ id: buttonNames.FIRST, text: buttonTexts.DELETE }));
  }
  if (state.ui.internal.account.buttons[buttonNames.SECOND].visible) {
    dispatch(setButtonVisible({ id: buttonNames.SECOND, visible: false }));
  }

  if (deleteAccountConfirm.value || deleteAccountConfirm.errorMessage) {
    deleteAccountConfirm.value = '';
    deleteAccountConfirm.errorMessage = '';

    dispatch(setInputValueError(deleteAccountConfirm));
  }

  return null;
};

export default cancelDeleteAccount;
