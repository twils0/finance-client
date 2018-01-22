import { actionTypes } from '../Constants/uiConstantsInternal';

export const setCurrentPageBody = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'current')) {
    throw new Error(`Please enter a valid 'current' key - ${JSON.stringify(payload)}`);
  }

  return {
    type: actionTypes.SET_CURRENT_PAGE_BODY,
    payload,
  };
};

export default setCurrentPageBody;
