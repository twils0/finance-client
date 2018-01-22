export const actionTypes = {
  SET_ACCOUNT_STATUS: 'DATA_ACCOUNT_SET_ACCOUNT_STATUS',
  SET_FIELD: 'DATA_ACCOUNT_SET_FIELD',
  SET_FIELDS: 'DATA_ACCOUNT_SET_FIELDS',
  RESET_ACCOUNT_STATE: 'DATA_ACCOUNT_RESET_ACCOUNT_STATE',
};

export const statusNames = {
  AWS_FIELDS: 'accountStatusAWSFields',
  STRIPE_FIELDS: 'accountStatusStripeFields',
  UPDATE_STRIPE_FIELDS_TOKEN: 'accountStatusUpdateStripeFieldsToken',
  UPDATE_STRIPE_FIELDS_REQUEST: 'accountStatusUpdateStripeFieldsRequest',
  UPDATE_DB_FIELDS: 'accountStatusUpdateDBFields',
  UPDATE_AWS_FIELDS: 'accountStatusUpdateAWSFields',
};

export const fieldNames = {
  NAME: 'accountName',
  EMAIL: 'accountEmail',
  EMAIL_ADDITIONAL: 'accountEmailAdditional',
  PHONE: 'accountPhone',
  NAME_ON_CARD: 'accountNameOnCard',
  PROMO_CODE: 'accountPromoCode',
  PROMO_CODE_VALID: 'accountPromoCodeValid',
  CUSTOMER: 'accountCustomer',
};
