import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

import { codeTypeNames } from '../../Constants/dataConstantsAuth';
import { fieldNames } from '../../Constants/dataConstantsAccount';
import { errorMessages } from '../../Constants/uiConstantsApp';
import {
  formNames,
  buttonNames,
  buttonTexts,
  inputNames,
} from '../../Constants/uiConstantsAccount';
import { setCodeType } from '../dataActionsAuth';
import { setField } from '../dataActionsAccount';
import requestUpdateStripeFields from '../dataThunkAccount/requestUpdateStripeFields';
import requestUpdateDBFields from '../dataThunkAccount/requestUpdateDBFields';
import {
  setFormEdit,
  setButtonText,
  setButtonVisible,
  setInputValueError,
  setCurrentForm,
} from '../uiActionsAccount';
import handleCancel from './handleCancel';

const firstButtonProfile = () => async (dispatch, getState) => {
  const state = getState();
  const secondButtonVisible = state.ui.internal.account.buttons[buttonNames.SECOND].visible;

  if (!secondButtonVisible) {
    const profileFormEdit = state.ui.internal.account.forms[formNames.PROFILE].edit;
    const firstButtonText = state.ui.internal.account.buttons[buttonNames.FIRST].text;
    const secondButtonText = state.ui.internal.account.buttons[buttonNames.SECOND].text;

    if (!profileFormEdit) {
      dispatch(setFormEdit({ id: formNames.PROFILE, edit: true }));
    }
    if (firstButtonText !== buttonTexts.UPDATE) {
      dispatch(setButtonText({ id: buttonNames.FIRST, text: buttonTexts.UPDATE }));
    }
    if (secondButtonText !== buttonTexts.CANCEL) {
      dispatch(setButtonText({ id: buttonNames.SECOND, text: buttonTexts.CANCEL }));
    }

    dispatch(setButtonVisible({ id: buttonNames.SECOND, visible: true }));
  } else {
    const { forms } = state.ui.internal.account;

    const profileName = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].NAME];
    const profileEmail = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL];
    const profileEmailAdditional = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];
    const profilePhone = forms[formNames.PROFILE].inputs[inputNames[formNames.PROFILE].PHONE];

    if (!profileName.value) {
      profileName.errorMessage = errorMessages.NO_NAME;
    }

    if (!profileEmail.value) {
      profileEmail.errorMessage = errorMessages.NO_EMAIL;
    } else if (!isEmail(profileEmail.value)) {
      profileEmail.errorMessage = errorMessages.INVALID_EMAIL;
    }

    if (profileEmailAdditional.value && !isEmail(profileEmailAdditional.value)) {
      profileEmailAdditional.errorMessage = errorMessages.INVALID_EMAIL;
    }

    const sanitizedPhone = profilePhone.value.replace(/[-() ]/g, '');
    if (!sanitizedPhone) {
      profilePhone.errorMessage = errorMessages.NO_PHONE;
    } else if (!isMobilePhone(sanitizedPhone, 'en-US')) {
      profilePhone.errorMessage = errorMessages.INVALID_PHONE;
    }

    if (
      profileName.errorMessage
      || profileEmail.errorMessage
      || profileEmailAdditional.errorMessage
      || profilePhone.errorMessage
    ) {
      dispatch(setInputValueError(profileName));
      dispatch(setInputValueError(profileEmail));
      dispatch(setInputValueError(profileEmailAdditional));
      dispatch(setInputValueError(profilePhone));
    } else {
      const { fields } = state.data.account;
      const E164Phone = `+1${sanitizedPhone}`;

      const payload = {};

      if (fields[fieldNames.NAME].value !== profileName.value) {
        payload.name = profileName.value;
      }
      if (fields[fieldNames.EMAIL].value !== profileEmail.value) {
        dispatch(setCodeType({ id: codeTypeNames.VERIFY_EMAIL, needed: true }));
        payload.email = profileEmail.value;
      }
      if (fields[fieldNames.EMAIL_ADDITIONAL].value !== profileEmailAdditional.value) {
        dispatch(setCodeType({ id: codeTypeNames.VERIFY_EMAIL_ADDITIONAL, needed: true }));
        payload.emailAdditional = profileEmailAdditional.value;
      }
      if (fields[fieldNames.PHONE].value !== E164Phone) {
        dispatch(setCodeType({ id: codeTypeNames.VERIFY_PHONE, needed: true }));
        payload.phone = E164Phone;
      }

      if (Object.keys(payload).length > 0) {
        try {
          if (payload.email) {
            await Promise.all([
              dispatch(requestUpdateStripeFields(payload)),
              dispatch(requestUpdateDBFields(payload)),
            ]);
          } else {
            await dispatch(requestUpdateDBFields(payload));
          }

          if (fields[fieldNames.NAME].value !== profileName.value) {
            dispatch(setField({ id: fieldNames.NAME, value: profileName.value }));
          }
          if (fields[fieldNames.EMAIL].value !== profileEmail.value) {
            dispatch(setField({ id: fieldNames.EMAIL, value: profileEmail.value }));
          }
          if (fields[fieldNames.EMAIL_ADDITIONAL].value !== profileEmailAdditional.value) {
            dispatch(
              setField({
                id: fieldNames.EMAIL_ADDITIONAL,
                value: profileEmailAdditional.value,
              }),
            );
          }
          if (fields[fieldNames.PHONE].value !== E164Phone) {
            dispatch(setField({ id: fieldNames.PHONE, value: E164Phone }));
          }

          dispatch(handleCancel());

          if (payload.phone) {
            dispatch(setCurrentForm({ current: formNames.CODE }));
          }
        } catch (error) {
          switch (error.code) {
            case 'AliasExistsException':
              profileEmail.errorMessage = errorMessages.EMAIL_IN_USE_INTERNAL;

              dispatch(setInputValueError(profileEmail));
              break;
            case 'UsernameExistsException':
              profileEmail.errorMessage = errorMessages.EMAIL_IN_USE_INTERNAL;

              dispatch(setInputValueError(profileEmail));
              break;
            default: {
              profilePhone.errorMessage = errorMessages.INTERNAL_ERROR;

              dispatch(setInputValueError(profilePhone));
              break;
            }
          }
        }
      } else {
        dispatch(handleCancel());
      }
    }
  }

  return null;
};

export default firstButtonProfile;
