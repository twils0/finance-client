export const actionTypes = {
  SET_CURRENT_FORM: 'ACCOUNT_SET_CURRENT_FORM',
  SET_FORM_HEIGHT: 'ACCOUNT_SET_FORM_HEIGHT',
  SET_FORM_EDIT: 'ACCOUNT_SET_FORM_EDIT',
  SET_INPUT_VALUE_ERROR: 'ACCOUNT_SET_INPUT_VALUE_ERROR',
  SET_BUTTON_TEXT: 'ACCOUNT_SET_BUTTON_TEXT',
  SET_BUTTON_VISIBLE: 'ACCOUNT_SET_BUTTON_VISIBLE',
};

export const formNames = {
  CODE: 'codeForm',
  PROFILE: 'profileForm',
  BILLING: 'billingForm',
  CHANGE_PASSWORD: 'changePasswordForm',
  DELETE_ACCOUNT: 'deleteAccountForm',
};

export const buttonNames = {
  PROFILE: 'profileButton',
  BILLING: 'billingButton',
  CHANGE_PASSWORD: 'changePasswordButton',
  DELETE_ACCOUNT: 'deleteAccountButton',
  FIRST: 'firstButton',
  SECOND: 'secondButton',
};

export const buttonTexts = {
  RESEND: 'Resend',
  SUBMIT: 'Submit',
  EDIT: 'Edit',
  UPDATE: 'Update',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  CONFIRM: 'Confirm',
};

export const inputNames = {
  [formNames.CODE]: {
    CODE_PHONE: 'codeCodePhone',
  },
  [formNames.PROFILE]: {
    NAME: 'profileName',
    EMAIL: 'profileEmail',
    EMAIL_ADDITIONAL: 'profileEmailAdditional',
    PHONE: 'profilePhone',
  },
  [formNames.BILLING]: {
    NAME_ON_CARD: 'billingNameOnCard',
    PROMO_CODE: 'billingPromoCode',
    STRIPE: 'billingStripe',
  },
  [formNames.CHANGE_PASSWORD]: {
    OLD_PASSWORD: 'changePasswordOldPassword',
    NEW_PASSWORD: 'changePasswordNewPassword',
    NEW_PASSWORD2: 'changePasswordNewPassword2',
  },
  [formNames.DELETE_ACCOUNT]: {
    CONFIRM: 'deleteAccountConfirm',
  },
};
