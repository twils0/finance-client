import { formNames } from '../../Constants/uiConstantsAccount';

import cancelCode from './cancelCode';
import cancelProfile from './cancelProfile';
import cancelBilling from './cancelBilling';
import cancelChangePassword from './cancelChangePassword';
import cancelDeleteAccount from './cancelDeleteAccount';

const handleCancel = () => (dispatch, getState) => {
  const state = getState();

  const { forms } = state.ui.internal.account;

  switch (forms.current) {
    case formNames.CODE:
      dispatch(cancelCode());
      break;
    case formNames.PROFILE:
      dispatch(cancelProfile());
      break;
    case formNames.BILLING:
      dispatch(cancelBilling());
      break;
    case formNames.CHANGE_PASSWORD:
      dispatch(cancelChangePassword());
      break;
    case formNames.DELETE_ACCOUNT:
      dispatch(cancelDeleteAccount());
      break;
    default:
      break;
  }

  return null;
};

export default handleCancel;
