import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { BeatLoader } from 'halogenium';

import theme from '../../../../themes';

import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { errorMessages } from '../../../../Constants/uiConstantsApp';
import { formNames } from '../../../../Constants/uiConstantsExternal';
import loadStripe from '../../../../Actions/uiThunkApp/loadStripe';
import { setInputValueError } from '../../../../Actions/uiActionsExternal';

import FlexColumn from '../../../../Components/Flex/FlexColumn';
import FormCard from '../../../../Components/PageExternal/FormArraySignUp/Forms/FormCard';

class FormContainerCard extends React.Component {
  componentWillMount() {
    const { stripe, handleStripe } = this.props;

    if (stripe.status === requestStatusTypes.IDLE) {
      handleStripe();
    }
  }

  componentDidMount() {
    this.props.setHeight(formNames.CARD);
  }

  componentDidUpdate() {
    this.props.setHeight(formNames.CARD);
  }

  componentWillUnmount() {
    this.props.clearElement(formNames.CARD);
    this.props.resetStripeElement();
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
          case errorMessages.PROMO_CODE_INVALID: {
            input.errorMessage = '';
            break;
          }
          case errorMessages.PROMO_CODE_EXPIRED: {
            input.errorMessage = '';
            break;
          }
          case errorMessages.NO_NAME_ON_CARD: {
            if (input.value) {
              input.errorMessage = '';
            }
            break;
          }
          default:
            input.errorMessage = '';
            break;
        }
      }

      handleInputValueError(input);
    }
  };

  render() {
    const {
      stripeRef,
      heightRef,
      stripe,
      width,
      mediaWidth,
      formHeightBuffer,
      inputHeightBuffer,
      currentForm,
      inputs,
    } = this.props;

    if (stripe.status !== requestStatusTypes.SUCCESS) {
      const widthString = `${width}px`;

      return (
        <FlexColumn width={widthString} height="100%">
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      );
    }
    return (
      <StripeProvider stripe={stripe.stripeObject}>
        <Elements>
          <FormCard
            stripeRef={stripeRef}
            heightRef={heightRef}
            width={width}
            mediaWidth={mediaWidth}
            formHeightBuffer={formHeightBuffer}
            inputHeightBuffer={inputHeightBuffer}
            currentFormBool={currentForm === formNames.CARD}
            inputs={inputs}
            handleInputChange={this.handleInputChange}
          />
        </Elements>
      </StripeProvider>
    );
  }
}

FormContainerCard.propTypes = {
  stripeRef: PropTypes.func.isRequired,
  heightRef: PropTypes.func.isRequired,
  stripe: PropTypes.object,
  width: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
  currentForm: PropTypes.string.isRequired,
  inputs: PropTypes.object.isRequired,
  setHeight: PropTypes.func.isRequired,
  clearElement: PropTypes.func.isRequired,
  resetStripeElement: PropTypes.func.isRequired,
  handleStripe: PropTypes.func.isRequired,
  handleInputValueError: PropTypes.func.isRequired,
};

FormContainerCard.defaultProps = {
  stripe: {},
};

const mapStateToProps = (state, ownProps) => ({
  stripeRef: ownProps.stripeRef,
  heightRef: ownProps.heightRef,
  stripe: state.ui.app.stripe,
  width: state.ui.external.utilities.forms.width,
  mediaWidth: state.ui.external.utilities.forms.mediaWidth,
  formHeightBuffer: state.ui.external.utilities.forms.heightBuffer,
  inputHeightBuffer: state.ui.external.utilities.forms.inputs.heightBuffer,
  currentForm: state.ui.external.forms.current,
  inputs: state.ui.external.forms[formNames.CARD].inputs,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
  resetStripeElement: ownProps.resetStripeElement,
});

const mapDispatchToProps = dispatch => ({
  handleStripe: () => dispatch(loadStripe()),
  handleInputValueError: payload => dispatch(setInputValueError(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormContainerCard);
