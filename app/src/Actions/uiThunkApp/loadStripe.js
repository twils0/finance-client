import { requestStatusTypes } from '../../Constants/universalConstants';
import stripeConfig from '../../../../stripe.config.json';
import { setStripeStatus, setStripeObject } from '../uiActionsApp';

const loadStripe = () => (dispatch, getState) => {
  const state = getState();
  const { apiKey, status } = state.ui.app.stripe;

  if (apiKey && status !== requestStatusTypes.LOADING) {
    dispatch(setStripeStatus({ status: requestStatusTypes.LOADING }));

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;

    script.addEventListener('load', () => {
      dispatch(setStripeObject({ stripeObject: window.Stripe(apiKey) }));
      dispatch(setStripeStatus({ status: requestStatusTypes.SUCCESS }));
    });
    script.addEventListener('error', () => dispatch(setStripeStatus({ status: requestStatusTypes.ERROR })));

    script.src = stripeConfig.src;

    document.head.appendChild(script);
  }

  return null;
};

export default loadStripe;
