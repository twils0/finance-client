import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAccount';
import requestLogout from '../dataThunkAuth/requestLogout';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';
import { setAccountStatus } from '../dataActionsAccount';

import handleErrorCatch from '../../handleErrorCatch';

const requestUpdateAWSFields = (payload) => {
  if (
    !Object.prototype.hasOwnProperty.call(payload, 'email') &&
    !Object.prototype.hasOwnProperty.call(payload, 'name') &&
    !Object.prototype.hasOwnProperty.call(payload, 'phone')
  ) {
    throw new Error(`Please enter a value for either the 'email', 'name', or 'phone' keys- ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    const state = getState();

    if (
      state.data.account.status[statusNames.UPDATE_AWS_FIELDS].status !== requestStatusTypes.LOADING
    ) {
      dispatch(setAccountStatus({
        id: statusNames.UPDATE_AWS_FIELDS,
        status: requestStatusTypes.LOADING,
      }));

      const updatePayload = { ...payload };
      if (payload.phone) {
        delete updatePayload.phone;
        updatePayload.phone_number = payload.phone;
      }
      if (payload.emailAdditional) {
        delete updatePayload.emailAdditional;
      }

      let { user } = state.data.aws;

      try {
        if (!user) {
          ({ user } = await dispatch(requestAWSUser()));
        }

        await Auth.updateUserAttributes(user, updatePayload);
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);

        dispatch(setAccountStatus({
          id: statusNames.UPDATE_AWS_FIELDS,
          status: requestStatusTypes.ERROR,
        }));

        if (typeof error === 'object' && error.code === 'NotAuthorizedException') {
          dispatch(requestLogout());

          return null;
        }

        if (
          typeof error === 'object' &&
          error &&
          (error.code === 'AliasExistsException' || error.code === 'UsernameExistsException')
        ) {
          return Promise.reject(error);
        }

        raven.captureException(error, {
          logger: 'requestUpdateAWSFields',
        });

        return Promise.reject(error);
      }

      dispatch(setAccountStatus({
        id: statusNames.UPDATE_AWS_FIELDS,
        status: requestStatusTypes.SUCCESS,
      }));
    }

    return null;
  };
};

export default requestUpdateAWSFields;
