import { formNames } from '../../Constants/uiConstantsExternal';

import resendButtonCodeVerifyPhone from './resendButtonCodeVerifyPhone';

const handleClickResendButton = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'history')) {
    throw new Error(`Please enter a value for the 'history' key - ${JSON.stringify(payload)}`);
  }

  return (dispatch, getState) => {
    const state = getState();
    const { forms } = state.ui.external;

    switch (forms.current) {
      case formNames.CODE_VERIFY_PHONE: {
        const { history } = payload;

        dispatch(resendButtonCodeVerifyPhone({ history }));
        break;
      }
      default:
        break;
    }

    return null;
  };
};

export default handleClickResendButton;
