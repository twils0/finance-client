import { requestStatusTypes } from '../../Constants/universalConstants';

import { setImageStatus } from '../uiActionsApp';

const loadImage = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }

  return (dispatch, getState) => {
    const state = getState();
    const { id } = payload;

    if (state.ui.app.images[id] && state.ui.app.images[id].status !== requestStatusTypes.LOADING) {
      dispatch(setImageStatus({ id, status: requestStatusTypes.LOADING }));

      const Images = new Image();

      Images.addEventListener('load', () => dispatch(setImageStatus({ id, status: requestStatusTypes.SUCCESS })));
      Images.addEventListener('error', () => dispatch(setImageStatus({ id, status: requestStatusTypes.ERROR })));

      Images.src = state.ui.app.images[id].src;
    }

    return null;
  };
};

export default loadImage;
