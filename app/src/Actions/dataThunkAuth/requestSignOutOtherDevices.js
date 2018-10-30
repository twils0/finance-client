import { Auth } from 'aws-amplify';
import raven from 'raven-js';

import handleErrorCatch from '../../handleErrorCatch';
import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { setAuthStatus } from '../dataActionsAuth';
import { setAWSStatus, setAWSUser } from '../dataActionsAWS';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';

import { demo } from '../../../../mode.config.json';

const requestSignOutOtherDevices = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'email')) {
    throw new Error(`Please enter a value for the 'password' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'password')) {
    throw new Error(`Please enter a value for the 'password' key - ${JSON.stringify(payload)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'remembered')) {
    throw new Error(`Please enter a value for the 'remembered' key - ${JSON.stringify(payload)}`);
  }

  return async (dispatch, getState) => {
    let state = getState();

    if (
      state.data.auth.status[statusNames.SIGN_OUT_DEVICES].status !== requestStatusTypes.LOADING
    ) {
      dispatch(
        setAuthStatus({
          id: statusNames.SIGN_OUT_DEVICES,
          status: requestStatusTypes.LOADING,
        }),
      );

      let { user } = state.data.aws;

      try {
        if (!user) {
          ({ user } = await dispatch(requestAWSUser()));
        }

        if (!demo) {
          await new Promise((resolve, reject) => {
            user.setDeviceStatusRemembered({
              onSuccess: () => {
                resolve();
              },
              onFailure: (error) => {
                reject(error);
              },
            });
          });

          await new Promise((resolve, reject) => {
            user.globalSignOut({
              onSuccess: () => {
                resolve();
              },
              onFailure: (error) => {
                reject(error);
              },
            });
          });
        }

        dispatch(setAWSStatus({ status: requestStatusTypes.LOADING }));

        if (!demo) {
          user = await Auth.signIn(payload.email, payload.password);

          dispatch(setAWSUser({ user }));
        }

        dispatch(setAWSStatus({ status: requestStatusTypes.SUCCESS }));

        if (!demo) {
          if (!payload.remembered) {
            await new Promise((resolve, reject) => {
              user.setDeviceStatusNotRemembered({
                onSuccess: () => {
                  resolve();
                },
                onFailure: (error) => {
                  reject(error);
                },
              });
            });
          }
        }
      } catch (errorCatch) {
        const error = handleErrorCatch(errorCatch);
        state = getState();

        dispatch(
          setAuthStatus({
            id: statusNames.SIGN_OUT_DEVICES,
            status: requestStatusTypes.ERROR,
          }),
        );
        if (state.data.aws.status === requestStatusTypes.LOADING) {
          dispatch(setAWSStatus({ status: requestStatusTypes.ERROR }));
        }

        if (!demo) {
          raven.captureException(error, {
            logger: 'requestSignOutOtherDevices',
          });
        }

        return Promise.reject(error);
      }

      dispatch(
        setAuthStatus({
          id: statusNames.SIGN_OUT_DEVICES,
          status: requestStatusTypes.SUCCESS,
        }),
      );

      return user;
    }

    return null;
  };
};

export default requestSignOutOtherDevices;
