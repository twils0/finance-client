import { setSecuritiesAll } from '../dataActionsWatchlist';

const deleteSecurity = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'id')) {
    throw new Error(`Please enter a value for the 'id' key - ${JSON.stringify(payload)}`);
  }

  return (dispatch, getState) => {
    const state = getState();

    const newSecurities = { ...state.data.watchlist.securities };
    const { list } = newSecurities;
    const index = list.indexOf(payload.id);

    if (newSecurities.current === payload.id) {
      if (list.length > 1) {
        if (index === 0) {
          [, newSecurities.current] = list;
        } else {
          newSecurities.current = list[index - 1];
        }
      } else {
        newSecurities.current = null;
      }
    }

    newSecurities.list.splice(index, 1);

    delete newSecurities[payload.id];

    dispatch(setSecuritiesAll({ securities: newSecurities }));
  };
};

export default deleteSecurity;
