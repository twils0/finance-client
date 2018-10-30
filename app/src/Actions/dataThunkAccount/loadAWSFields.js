import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import { requestStatusTypes } from '../../Constants/universalConstants';
import { codeTypeNames } from '../../Constants/dataConstantsAuth';
import { statusNames, fieldNames } from '../../Constants/dataConstantsAccount';
import { setCodeType } from '../dataActionsAuth';
import requestLogout from '../dataThunkAuth/requestLogout';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';
import { setAccountStatus, setFields } from '../dataActionsAccount';

import handleErrorCatch from '../../handleErrorCatch';

import { demo } from '../../../../mode.config.json';
import demoFields from '../../../../demo/demoFields';

const loadAWSFields = () => async (dispatch, getState) => {
  const state = getState();

  if (state.data.account.status[statusNames.AWS_FIELDS].status !== requestStatusTypes.LOADING) {
    dispatch(
      setAccountStatus({
        id: statusNames.AWS_FIELDS,
        status: requestStatusTypes.LOADING,
      }),
    );

    let { user } = state.data.aws;
    const payload = {};

    try {
      if (!user) {
        ({ user } = await dispatch(requestAWSUser()));
      }

      let fields = null;

      if (!demo) {
        fields = await Auth.userAttributes(user);
      } else {
        fields = demoFields;
      }

      fields.forEach((field) => {
        switch (field.Name) {
          case 'name':
            payload[fieldNames.NAME] = {
              id: fieldNames.NAME,
              value: field.Value,
            };
            break;
          case 'email':
            payload[fieldNames.EMAIL] = {
              id: fieldNames.EMAIL,
              value: field.Value,
            };
            break;
          case 'custom:email_ver': {
            dispatch(
              setCodeType({ id: codeTypeNames.VERIFY_EMAIL, needed: field.Value !== 'true' }),
            );
            break;
          }
          case 'custom:email_additional':
            payload[fieldNames.EMAIL_ADDITIONAL] = {
              id: fieldNames.EMAIL_ADDITIONAL,
              value: field.Value,
            };
            break;
          case 'custom:email_additional_ver':
            dispatch(
              setCodeType({
                id: codeTypeNames.VERIFY_EMAIL_ADDITIONAL,
                needed: field.Value !== 'true',
              }),
            );
            break;
          case 'phone_number': {
            payload[fieldNames.PHONE] = {
              id: fieldNames.PHONE,
              value: field.Value,
            };
            break;
          }
          default:
            break;
        }
      });
    } catch (errorCatch) {
      const error = handleErrorCatch(errorCatch);

      dispatch(
        setAccountStatus({
          id: statusNames.AWS_FIELDS,
          status: requestStatusTypes.ERROR,
        }),
      );

      if (typeof error === 'object' && error && error.code === 'NotAuthorizedException') {
        dispatch(requestLogout());

        return null;
      }

      if (!demo) {
        raven.captureException(error, {
          logger: 'loadAWSFields',
        });
      }

      return Promise.reject(error);
    }

    dispatch(setFields(payload));

    dispatch(
      setAccountStatus({
        id: statusNames.AWS_FIELDS,
        status: requestStatusTypes.SUCCESS,
      }),
    );
  }

  return null;
};

export default loadAWSFields;
