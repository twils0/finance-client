import stripeConfig from '../../../stripe.config.json';
import dbConfig from '../../../db.config.json';
import iexConfig from '../../../iex.config.json';

export const baseURLs = {
  STRIPE: stripeConfig.url,
  DB: dbConfig.url,
  IEX: iexConfig.urls.api,
  IEX_DEV: iexConfig.urls.dev,
  IEX_TERMS: iexConfig.urls.terms,
};

export const URLs = {
  CUSTOMERS: '/customers',
  USERS: '/users',
  EMAILS: '/emails',
  SECURITIES: '/securities',
  SECURITIES_SEARCH: '/securities/search',
  IEX_COMPANY: tickerCusip => `/stock/${tickerCusip}/company`,
  IEX_QUOTE: tickerCusip => `/stock/${tickerCusip}/quote`,
};

export const axiosConfig = {
  STRIPE: {
    baseURL: baseURLs.STRIPE,
    timeout: 30000,
  },
  DB: {
    baseURL: baseURLs.DB,
    timeout: 30000,
  },
  IEX: {
    baseURL: baseURLs.IEX,
    timeout: 30000,
  },
};

export const pathNames = {
  DEFAULT: '*',
  LOGIN: '/login',
  SIGN_UP: '/signup',
  CODE: '/code',
  CODE_VERIFY_EMAIL: '/code/:verificationId?',
  TERMS: '/terms',
  INTERNAL: '/internal',
  WATCHLIST: '/internal/watchlist',
  WATCHLIST_SECURITY_ID: '/internal/watchlist/:securityId?',
  ACCOUNT: '/internal/account',
};

export const requestStatusTypes = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};
