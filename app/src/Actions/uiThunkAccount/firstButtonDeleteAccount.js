import { errorMessages } from '../../Constants/uiConstantsApp';
import {
  formNames,
  buttonNames,
  buttonTexts,
  inputNames,
} from '../../Constants/uiConstantsAccount';
import requestDeleteAccount from '../dataThunkAuth/requestDeleteAccount';
import {
  setFormEdit,
  setButtonText,
  setButtonVisible,
  setInputValueError,
} from '../uiActionsAccount';

const firstButtonDeleteAccount = () => async (dispatch, getState) => {
  const state = getState();
  const secondButtonVisible = state.ui.internal.account.buttons[buttonNames.SECOND].visible;

  if (!secondButtonVisible) {
    const deleteAccountFormEdit = state.ui.internal.account.forms[formNames.DELETE_ACCOUNT].edit;
    const firstButtonText = state.ui.internal.account.buttons[buttonNames.FIRST].text;
    const secondButtonText = state.ui.internal.account.buttons[buttonNames.SECOND].text;

    if (!deleteAccountFormEdit) {
      dispatch(setFormEdit({ id: formNames.DELETE_ACCOUNT, edit: true }));
    }
    if (firstButtonText !== buttonTexts.CONFIRM) {
      dispatch(setButtonText({ id: buttonNames.FIRST, text: buttonTexts.CONFIRM }));
    }
    if (secondButtonText !== buttonTexts.CANCEL) {
      dispatch(setButtonText({ id: buttonNames.SECOND, text: buttonTexts.CANCEL }));
    }

    dispatch(setButtonVisible({ id: buttonNames.SECOND, visible: true }));
  } else {
    const { forms } = state.ui.internal.account;

    const deleteAccountConfirm =
      forms[formNames.DELETE_ACCOUNT].inputs[inputNames[formNames.DELETE_ACCOUNT].CONFIRM];

    if (deleteAccountConfirm.value !== 'delete') {
      deleteAccountConfirm.errorMessage = errorMessages.INVALID_DELETE_ACCOUNT;
    }

    if (deleteAccountConfirm.errorMessage) {
      dispatch(setInputValueError(deleteAccountConfirm));
    } else {
      try {
        await dispatch(requestDeleteAccount());

        if (deleteAccountConfirm.value || deleteAccountConfirm.errorMessage) {
          deleteAccountConfirm.value = '';
          deleteAccountConfirm.errorMessage = '';

          dispatch(setInputValueError(deleteAccountConfirm));
        }
      } catch (error) {
        deleteAccountConfirm.value = '';
        deleteAccountConfirm.errorMessage = errorMessages.INTERNAL_ERROR;

        dispatch(setInputValueError(deleteAccountConfirm));
      }
    }
  }

  return null;
};

export default firstButtonDeleteAccount;
