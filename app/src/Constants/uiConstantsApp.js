export const actionTypes = {
  SET_FONTS_STATUS: 'APP_SET_FONTS_STATUS',
  LOAD_FONTS: 'APP_LOAD_FONTS',
  SET_IMAGE_STATUS: 'APP_SET_IMAGE_STATUS',
  LOAD_IMAGE: 'APP_LOAD_IMAGE',
  SET_STRIPE_STATUS: 'APP_SET_STRIPE_STATUS',
  SET_STRIPE_ELEMENT_LOADED: 'APP_SET_STRIPE_ELEMENT_LOADED',
  LOAD_STRIPE: 'APP_FETCH_STRIPE',
  SET_STRIPE_OBJECT: 'APP_SET_STRIPE_OBJECT',
};

export const motionStatusTypes = {
  IDLE: 'IDLE',
  ACTIVE: 'ACTIVE',
};

export const imageNames = {
  EXAMPLE_HEADER: 'exampleHeader',
};

export const errorMessages = {
  NO_EMAIL: 'Please enter your email address.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  NO_PASSWORD: 'Please enter your password.',
  NO_NEW_PASSWORD: 'Please enter your new password.',
  INVALID_PASSWORD:
    'Please enter a password containing at least 8 characters, one of the following special characters, $@!%*#?&, one letter, and one number.',
  NO_MATCH_PASSWORD: 'This password does not match your password above.',
  NO_NAME_ON_CARD: 'Please enter the name shown on your credit card.',
  NO_STRIPE: 'Please enter your credit card information.',
  INVALID_CARD_NUMBER: 'Please enter a valid credit card number.',
  INCOMPLETE_CARD_NUMBER: 'Please enter your full credit card number.',
  INVALID_CARD_EXPIRATION_DATE: 'Please enter a valid expiration date.',
  INVALID_CARD_CVC: 'Please enter a valid CVC.',
  INVALID_CARD_ZIP_CODE: 'Please enter a valid zip code.',
  NO_NAME: 'Please enter your name.',
  NO_PHONE: 'Please enter your mobile phone number.',
  INVALID_PHONE: 'Please enter a valid mobile phone number.',
  NO_VERIFICATION_CODE_PHONE: 'Please enter the verification code sent to your mobile phone.',
  NO_VERIFICATION_CODE_EMAIL: 'Please enter the verification code sent to your email.',
  NO_CONFIRMATION_CODE_PHONE: 'Please enter the confirmation code sent to your mobile phone.',
  INVALID_VERIFICATION_CODE:
    'Please verify you have entered the correct verification code or request a new code.',
  INVALID_CONFIRMATION_CODE:
    'Please verify you have entered the correct confirmation code or request a new code.',
  EXPIRED_VERIFICATION_CODE: 'This verification code has expired.',
  EXPIRED_CONFIRMATION_CODE: 'This confirmation code has expired.',
  EMAIL_IN_USE:
    'An account using this email already exists. Please login or use a different email.',
  EMAIL_IN_USE_INTERNAL:
    'An account using this email already exists. Please use a different email.',
  EMAIL_NOT_FOUND:
    'This email is not associated with an account. Please enter another email or sign up.',
  PASSWORD_NOT_FOUND: 'This password does not match our records.',
  PROMO_CODE_INVALID: 'Please enter a valid promo code.',
  PROMO_CODE_EXPIRED: 'This promo code is no longer valid.',
  RETRY_SIGN_UP: 'Please click "Cancel" below and login.',
  INVALID_DELETE_ACCOUNT: 'Please type "delete" to confirm you would like to delete your account',
  LIMIT_EXCEEDED:
    'You have reached your login attempt limit. Please allow some time and try again.',
  INTERNAL_ERROR:
    'Please try your request again. If unsuccessful on subsequent attempts, please contact customer service.',
};
