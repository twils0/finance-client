export const actionTypes = {
  SET_AUTHENTICATED: 'DATA_AUTH_SET_AUTHENTICATED',
  SET_REDIRECT_URL: 'DATA_AUTH_SET_REDIRECT_URL',
  SET_AUTH_STATUS: 'DATA_AUTH_SET_AUTH_STATUS',
  SET_CODE_TYPE: 'DATA_AUTH_SET_CODE_TYPE',
  RESET_AUTH_STATE: 'DATA_AUTH_RESET_AUTH_STATE',
};

export const statusNames = {
  LOGIN: 'authStatusLogin',
  SIGN_OUT_DEVICES: 'authStatusSignOutDevices',
  LOGIN_MFA: 'authStatusLoginMFA',
  SIGN_UP: 'authStatusSignUp',
  VERIFY_PHONE: 'authStatusVerifyPhone',
  VERIFY_PHONE_CODE: 'authStatusVerifyPhoneCode',
  VERIFY_EMAIL: 'authStatusVerifyEmail',
  VERIFY_EMAIL_LINK: 'authStatusVerifyEmailLink',
  FORGOT_PASSWORD: 'authStatusForgotPassword',
  RESET_PASSWORD: 'authStatusResetPassword',
  CHANGE_PASSWORD: 'authStatusChangePassword',
  DELETE_ACCOUNT: 'authStatusDeleteAccount',
  LOGOUT: 'authStatusLogout',
};

export const codeTypeNames = {
  VERIFY_PHONE: 'verifyPhone',
  VERIFY_EMAIL: 'verifyEmail',
  VERIFY_EMAIL_ADDITIONAL: 'verifyEmailAdditional',
};
