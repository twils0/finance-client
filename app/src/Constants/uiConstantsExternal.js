export const actionTypes = {
  SET_CURRENT_FORM: 'EXTERNAL_SET_CURRENT_FORM',
  SET_FORM_HEIGHT: 'EXTERNAL_SET_FORM_HEIGHT',
  SET_INPUT_VALUE_ERROR: 'EXTERNAL_SET_INPUT_VALUE_ERROR',
  SET_BUTTON_TEXT: 'EXTERNAL_SET_BUTTON_TEXT',
};

export const formNames = {
  RESET_PASSWORD: 'resetPasswordForm',
  FORGOT_PASSWORD: 'forgotPasswordForm',
  LOGIN: 'loginForm',
  CARD: 'cardForm',
  INFO: 'infoForm',
  SIGN_UP: 'signUpForm',
  CODE_MFA_PHONE: 'codePhoneMFAForm',
  CODE_VERIFY_PHONE: 'codePhoneVerifyForm',
  CODE_VERIFY_EMAIL: 'codeEmailVerifyForm',
  DEVICE: 'deviceForm',
};

export const inputNames = {
  [formNames.RESET_PASSWORD]: {
    CODE: 'codeResetPassword',
    PASSWORD: 'passwordResetPassword',
    PASSWORD2: 'password2ResetPassword',
  },
  [formNames.FORGOT_PASSWORD]: {
    EMAIL: 'loginPasswordEmail',
  },
  [formNames.LOGIN]: {
    EMAIL: 'loginEmail',
    PASSWORD: 'loginPassword',
  },
  [formNames.CARD]: {
    NAME_ON_CARD: 'cardNameOnCard',
    PROMO_CODE: 'cardPromoCode',
    STRIPE: 'cardStripe',
  },
  [formNames.INFO]: {
    NAME: 'infoName',
    PHONE: 'infoPhone',
    EMAIL: 'infoEmail',
  },
  [formNames.SIGN_UP]: {
    PASSWORD: 'signUpPassword',
    PASSWORD2: 'signUpPassword2',
  },
  [formNames.CODE_MFA_PHONE]: {
    CODE: 'codeMFAPhoneCode',
  },
  [formNames.CODE_VERIFY_PHONE]: {
    CODE: 'codeVerifyPhoneCode',
  },
  [formNames.CODE_VERIFY_EMAIL]: {
    CODE: 'codeVerifyEmailCode',
  },
};

export const buttonNames = {
  FIRST: 'firstButton',
  SECOND: 'secondButton',
  FORGOT_PASSWORD: 'forgotPasswordButton',
  RESEND_PHONE: 'resendPhoneButton',
  RESEND_EMAIL: 'resendEmailButton',
};

export const buttonTexts = {
  RESET: 'Reset',
  CANCEL: 'Cancel',
  SEND_CODE: 'Send Code',
  RESEND_PHONE: 'Resend SMS',
  RESEND_EMAIL: 'Resend Email',
  LOG_IN: 'Log In',
  FORGOT_PASSWORD: 'Forgot Password',
  SIGN_UP: 'Sign Up',
  NEXT: 'Next',
  PREVIOUS: 'Previous',
  SUBMIT: 'Submit',
  YES: 'Yes',
  NO: 'No',
  CONTINUE: 'Continue',
};
