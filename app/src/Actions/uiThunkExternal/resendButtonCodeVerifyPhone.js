import { pathNames } from '../../Constants/universalConstants';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import requestVerifyField from '../dataThunkAuth/requestVerifyField';
import { setInputValueError } from '../uiActionsExternal';

const resendButtonCodeVerifyPhone = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'history')) {
    throw new Error(`Please enter a value for the 'history' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.external;
    const codeCodeVerifyPhone = forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

    try {
      await dispatch(requestVerifyField({ field: 'phone_number' }));
    } catch (error) {
      payload.history.replace(pathNames.LOGIN);
    }

    if (codeCodeVerifyPhone.value || codeCodeVerifyPhone.errorMessage) {
      codeCodeVerifyPhone.value = '';
      codeCodeVerifyPhone.errorMessage = '';

      dispatch(setInputValueError(codeCodeVerifyPhone));
    }

    return null;
  };
};

export default resendButtonCodeVerifyPhone;
