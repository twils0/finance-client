import React from 'react';
import PropTypes from 'prop-types';

import { formNames } from '../../../Constants/uiConstantsAccount';

import FormContainerCode from '../../../Containers/PageInternal/PageBodyContainerAccount/Forms/FormContainerCode';
import FormContainerProfile from '../../../Containers/PageInternal/PageBodyContainerAccount/Forms/FormContainerProfile';
import FormContainerChangePassword from '../../../Containers/PageInternal/PageBodyContainerAccount/Forms/FormContainerChangePassword';
import FormContainerBilling from '../../../Containers/PageInternal/PageBodyContainerAccount/Forms/FormContainerBilling';
import FormContainerDeleteAccount from '../../../Containers/PageInternal/PageBodyContainerAccount/Forms/FormContainerDeleteAccount';

const FormsSwitch = (props) => {
  const {
    form, heightRef, setHeight, clearElement,
  } = props;
  switch (form) {
    case formNames.CODE:
      return (
        <FormContainerCode
          heightRef={heightRef}
          setHeight={setHeight}
          clearElement={clearElement}
        />
      );
    case formNames.PROFILE:
      return (
        <FormContainerProfile
          heightRef={heightRef}
          setHeight={setHeight}
          clearElement={clearElement}
        />
      );
    case formNames.BILLING: {
      const { stripeRef, resetStripeElement } = props;

      return (
        <FormContainerBilling
          stripeRef={stripeRef}
          heightRef={heightRef}
          setHeight={setHeight}
          clearElement={clearElement}
          resetStripeElement={resetStripeElement}
        />
      );
    }
    case formNames.CHANGE_PASSWORD:
      return (
        <FormContainerChangePassword
          heightRef={heightRef}
          setHeight={setHeight}
          clearElement={clearElement}
        />
      );
    case formNames.DELETE_ACCOUNT:
      return (
        <FormContainerDeleteAccount
          heightRef={heightRef}
          setHeight={setHeight}
          clearElement={clearElement}
        />
      );
    default:
      break;
  }
  return null;
};

FormsSwitch.propTypes = {
  stripeRef: PropTypes.func.isRequired,
  heightRef: PropTypes.func.isRequired,
  setHeight: PropTypes.func.isRequired,
  clearElement: PropTypes.func.isRequired,
  resetStripeElement: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
};

export default FormsSwitch;
