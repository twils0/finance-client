import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { setAuthenticated } from '../dataActionsAuth';
import requestLogout from './requestLogout';
import requestAWSUser from '../dataThunkAWS/requestAWSUser';

const setSession = () => (dispatch, getState) => {
  const state = getState();
  let { authenticated } = state.data.auth;

  if (
    state.data.auth.status[statusNames.LOGOUT].status !== requestStatusTypes.LOADING
    || state.data.auth.status[statusNames.DELETE_ACCOUNT].status !== requestStatusTypes.LOADING
  ) {
    const currentTime = new Date();
    const sessionTimeString = window.sessionStorage.getSecurity('sessionTime');
    let sessionTime = null;

    if (sessionTimeString) {
      sessionTime = new Date(sessionTimeString);
    }

    if (sessionTime) {
      if (currentTime >= sessionTime && authenticated) {
        authenticated = false;
        dispatch(requestLogout());
      } else if (authenticated) {
        const interval = window.sessionStorage.getSecurity('interval');

        currentTime.setMinutes(currentTime.getMinutes() + 30);
        window.sessionStorage.setSecurity('sessionTime', currentTime);

        if (!interval) {
          const intervalId = window.setInterval(() => {
            const currentTimeInterval = new Date();
            const sessionTimeStringInterval = window.sessionStorage.getSecurity('sessionTime');
            let sessionTimeInterval = null;

            if (sessionTimeStringInterval) {
              sessionTimeInterval = new Date(sessionTimeStringInterval);
            }

            const stateInterval = getState();

            if (
              !sessionTimeInterval
              || (currentTimeInterval >= sessionTimeInterval && stateInterval.data.auth.authenticated)
            ) {
              dispatch(requestLogout());
            }
          }, 60000);

          window.sessionStorage.setSecurity('interval', intervalId);
        }

        if (!state.data.aws.user) {
          dispatch(requestAWSUser()).catch(() => {
            dispatch(requestLogout());
          });
        }
      } else {
        authenticated = true;
        dispatch(setAuthenticated({ authenticated }));

        if (!state.data.aws.user) {
          dispatch(requestAWSUser()).catch(() => {
            dispatch(requestLogout());
          });
        }
      }
    } else if (authenticated) {
      authenticated = false;
      dispatch(requestLogout());
    }
  }

  return authenticated;
};

export default setSession;
