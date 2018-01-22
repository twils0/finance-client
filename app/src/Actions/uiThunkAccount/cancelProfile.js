import { fieldNames } from '../../Constants/dataConstantsAccount';
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

const cancelProfile = () => (dispatch, getState) => {
  const state = getState();

  const { forms } = state.ui.internal.account;
  const { fields } = state.data.account;

  const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
  const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
  const profileEmailAdditional =
    forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];
  const profilePhone = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE];
  const E164Phone = fields[fieldNames.PHONE].value;
  let formattedPhone = null;

  if (E164Phone) {
    formattedPhone = `${E164Phone.substring(2, 5)}-${E164Phone.substring(
      5,
      8,
    )}-${E164Phone.substring(8, 12)}`;
  }

  if (state.ui.internal.account.forms[formNames.PROFILE].edit) {
    dispatch(setFormEdit({ id: formNames.PROFILE, edit: false }));
  }
  if (state.ui.internal.account.buttons[buttonNames.FIRST].text !== buttonTexts.EDIT) {
    dispatch(setButtonText({ id: buttonNames.FIRST, text: buttonTexts.EDIT }));
  }
  if (state.ui.internal.account.buttons[buttonNames.SECOND].visible) {
    dispatch(setButtonVisible({ id: buttonNames.SECOND, visible: false }));
  }

  if (fields[fieldNames.NAME].value !== profileName.value || profileName.errorMessage) {
    profileName.value = fields[fieldNames.NAME].value;
    profileName.errorMessage = '';

    dispatch(setInputValueError(profileName));
  }

  if (fields[fieldNames.EMAIL].value !== profileEmail.value || profileEmail.errorMessage) {
    profileEmail.value = fields[fieldNames.EMAIL].value;
    profileEmail.errorMessage = '';

    dispatch(setInputValueError(profileEmail));
  }

  if (
    fields[fieldNames.EMAIL_ADDITIONAL].value !== profileEmailAdditional.value ||
    profileEmailAdditional.errorMessage
  ) {
    profileEmailAdditional.value = fields[fieldNames.EMAIL_ADDITIONAL].value;
    profileEmailAdditional.errorMessage = '';

    dispatch(setInputValueError(profileEmailAdditional));
  }

  if (formattedPhone !== profilePhone.value || profilePhone.errorMessage) {
    profilePhone.value = formattedPhone;
    profilePhone.errorMessage = '';

    dispatch(setInputValueError(profilePhone));
  }

  return null;
};

export default cancelProfile;
