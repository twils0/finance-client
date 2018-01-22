import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { BeatLoader } from 'halogenium';

import theme from '../../../../themes';

import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { statusNames, fieldNames } from '../../../../Constants/dataConstantsAccount';
import { errorMessages } from '../../../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../../../Constants/uiConstantsAccount';
import { setInputValueError } from '../../../../Actions/uiActionsAccount';

import FlexColumn from '../../../../Components/Flex/FlexColumn';
import FormBilling from '../../../../Components/PageInternal/PageBodyAccount/Forms/FormBilling';

class FormContainerBilling extends React.Component {
  componentWillMount() {
    const { inputs, dataAccountFields, handleInputValueError } = this.props;

    const uiNameOnCard = inputs[inputNames[formNames.BILLING].NAME_ON_CARD];
    const uiPromoCode = inputs[inputNames[formNames.BILLING].PROMO_CODE];
    // uiStripe.value is used for error handling
    // do not set it equal to dataStripe

    uiNameOnCard.value = dataAccountFields[fieldNames.NAME_ON_CARD].value;
    uiPromoCode.value = dataAccountFields[fieldNames.PROMO_CODE].value;
    if (
      dataAccountFields[fieldNames.PROMO_CODE].value &&
      !dataAccountFields[fieldNames.PROMO_CODE_VALID].value
    ) {
      uiPromoCode.errorMessage = errorMessages.PROMO_CODE_EXPIRED;
    }

    handleInputValueError(uiNameOnCard);
    handleInputValueError(uiPromoCode);
  }

  componentDidMount() {
    this.props.setHeight(formNames.BILLING);
  }

  componentWillUpdate(nextProps) {
    if (
      nextProps.statusAccount[statusNames.UPDATE_STRIPE_FIELDS_REQUEST].status ===
      requestStatusTypes.LOADING
    ) {
      const { clearElement, resetStripeElement } = nextProps;

      clearElement(formNames.BILLING);
      resetStripeElement();
    }
  }

  componentDidUpdate() {
    this.props.setHeight(formNames.BILLING);
  }

  componentWillUnmount() {
    this.props.clearElement(formNames.BILLING);
  }

  handleInputChange = (inputEvent) => {
    inputEvent.preventDefault();
    const { inputs, handleInputValueError } = this.props;
    const input = { ...inputs[inputEvent.target.id] };

    if (input) {
      if (inputEvent.target.value || input.value) {
        input.value = inputEvent.target.value;
      }

      if (input.errorMessage) {
        switch (input.errorMessage) {
          case errorMessages.NO_NAME_ON_CARD: {
            if (input.value) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.PROMO_CODE_INVALID: {
            input.errorMessage = '';
            break;
          }
          case errorMessages.PROMO_CODE_EXPIRED: {
            input.errorMessage = '';
            break;
          }
          default:
            input.errorMessage = '';
            break;
        }
      }
    }

    handleInputValueError(input);
  };

  render() {
    const {
      stripeRef,
      heightRef,
      stripe,
      rowWidthIndent,
      headerWidthBufferRight,
      mediaWidth,
      height,
      rowHeight,
      rowHeightBuffer,
      statusAccount,
      currentForm,
      editForm,
      inputs,
    } = this.props;

    if (
      statusAccount[statusNames.UPDATE_STRIPE_FIELDS_REQUEST].status === requestStatusTypes.LOADING
    ) {
      const heightString = `${height}px`;

      return (
        <FlexColumn width="100%" height={heightString}>
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      );
    }
    return (
      <StripeProvider stripe={stripe.stripeObject}>
        <Elements>
          <FormBilling
            stripeRef={stripeRef}
            heightRef={heightRef}
            rowWidthIndent={rowWidthIndent}
            headerWidthBufferRight={headerWidthBufferRight}
            mediaWidth={mediaWidth}
            rowHeight={rowHeight}
            rowHeightBuffer={rowHeightBuffer}
            currentFormBool={currentForm === formNames.BILLING}
            editForm={editForm}
            inputs={inputs}
            handleInputChange={this.handleInputChange}
          />
        </Elements>
      </StripeProvider>
    );
  }
}

FormContainerBilling.propTypes = {
  stripeRef: PropTypes.func.isRequired,
  heightRef: PropTypes.func.isRequired,
  stripe: PropTypes.object,
  rowWidthIndent: PropTypes.number.isRequired,
  headerWidthBufferRight: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowHeightBuffer: PropTypes.number.isRequired,
  dataAccountFields: PropTypes.object.isRequired,
  statusAccount: PropTypes.object.isRequired,
  currentForm: PropTypes.string.isRequired,
  editForm: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
  setHeight: PropTypes.func.isRequired,
  clearElement: PropTypes.func.isRequired,
  resetStripeElement: PropTypes.func.isRequired,
  handleInputValueError: PropTypes.func.isRequired,
};

FormContainerBilling.defaultProps = {
  stripe: {},
};

const mapStateToProps = (state, ownProps) => ({
  stripeRef: ownProps.stripeRef,
  heightRef: ownProps.heightRef,
  stripe: state.ui.app.stripe,
  rowWidthIndent: state.ui.internal.account.utilities.forms.rowWidthIndent,
  headerWidthBufferRight: state.ui.internal.account.utilities.forms.headerWidthBufferRight,
  mediaWidth: state.ui.internal.account.utilities.pageBody.mediaWidth,
  height: state.ui.internal.account.forms[formNames.BILLING].height,
  rowHeight: state.ui.internal.account.utilities.forms.rowHeight,
  rowHeightBuffer: state.ui.internal.account.utilities.forms.rowHeightBuffer,
  heightBuffer: state.ui.internal.account.utilities.forms.heightBuffer,
  dataAccountFields: state.data.account.fields,
  statusAccount: state.data.account.status,
  currentForm: state.ui.internal.account.forms.current,
  editForm: state.ui.internal.account.forms[formNames.BILLING].edit,
  inputs: state.ui.internal.account.forms[formNames.BILLING].inputs,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
  resetStripeElement: ownProps.resetStripeElement,
});

const mapDispatchToProps = dispatch => ({
  handleInputValueError: payload => dispatch(setInputValueError(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormContainerBilling);
