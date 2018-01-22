import { pathNames, requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { formNames, inputNames } from '../../Constants/uiConstantsExternal';
import { setAuthStatus } from '../dataActionsAuth';
import { setInputValueError } from '../uiActionsExternal';

const secondButtonCodePhone = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'history')) {
    throw new Error(`Please enter a value for the 'history' key - ${JSON.stringify(payload)}`);
  }

  return (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.external;
    const { status } = state.data.auth;

    const codeCodeMFAPhone =
      forms[formNames.CODE_MFA_PHONE].inputs[inputNames[formNames.CODE_MFA_PHONE].CODE];
    const codeCodeVerifyPhone =
      forms[formNames.CODE_VERIFY_PHONE].inputs[inputNames[formNames.CODE_VERIFY_PHONE].CODE];

    const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
    const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];
    const infoEmail = forms[formNames.INFO].inputs[inputNames[formNames.INFO].EMAIL];
    const forgotPasswordEmail =
      forms[formNames.FORGOT_PASSWORD].inputs[inputNames[formNames.FORGOT_PASSWORD].EMAIL];

    payload.history.replace(pathNames.LOGIN);

    if (status[statusNames.SIGN_UP].status !== requestStatusTypes.IDLE) {
      dispatch(setAuthStatus({
        id: statusNames.SIGN_UP,
        status: requestStatusTypes.IDLE,
      }));
    }

    if (status[statusNames.LOGIN].status !== requestStatusTypes.IDLE) {
      dispatch(setAuthStatus({
        id: statusNames.LOGIN,
        status: requestStatusTypes.IDLE,
      }));
    }

    if (status[statusNames.LOGIN_MFA].status !== requestStatusTypes.IDLE) {
      dispatch(setAuthStatus({
        id: statusNames.LOGIN_MFA,
        status: requestStatusTypes.IDLE,
      }));
    }

    if (status[statusNames.VERIFY_PHONE].status !== requestStatusTypes.IDLE) {
      dispatch(setAuthStatus({
        id: statusNames.VERIFY_PHONE,
        status: requestStatusTypes.IDLE,
      }));
    }

    if (status[statusNames.SIGN_OUT_DEVICES].status !== requestStatusTypes.IDLE) {
      dispatch(setAuthStatus({
        id: statusNames.SIGN_OUT_DEVICES,
        status: requestStatusTypes.IDLE,
      }));
    }

    if (codeCodeMFAPhone.value || codeCodeMFAPhone.errorMessage) {
      codeCodeMFAPhone.value = '';
      codeCodeMFAPhone.errorMessage = '';

      dispatch(setInputValueError(codeCodeMFAPhone));
    }

    if (codeCodeVerifyPhone.value || codeCodeVerifyPhone.errorMessage) {
      codeCodeVerifyPhone.value = '';
      codeCodeVerifyPhone.errorMessage = '';

      dispatch(setInputValueError(codeCodeVerifyPhone));
    }

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

    if (infoEmail.value || infoEmail.errorMessage) {
      infoEmail.value = '';
      infoEmail.errorMessage = '';

      dispatch(setInputValueError(infoEmail));
    }

    if (forgotPasswordEmail.value || forgotPasswordEmail.errorMessage) {
      forgotPasswordEmail.value = '';
      forgotPasswordEmail.errorMessage = '';

      dispatch(setInputValueError(forgotPasswordEmail));
    }

    return null;
  };
};

export default secondButtonCodePhone;
