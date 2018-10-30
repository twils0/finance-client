import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BeatLoader } from 'halogenium';

import theme from '../../../themes';

import { requestStatusTypes } from '../../../Constants/universalConstants';
import { statusNames } from '../../../Constants/dataConstantsAccount';
import { errorMessages } from '../../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../../Constants/uiConstantsAccount';
import loadStripeFields from '../../../Actions/dataThunkAccount/loadStripeFields';
import loadAWSFields from '../../../Actions/dataThunkAccount/loadAWSFields';
import loadStripe from '../../../Actions/uiThunkApp/loadStripe';
import { setStripeElementLoaded } from '../../../Actions/uiActionsApp';
import { setInputValueError } from '../../../Actions/uiActionsAccount';

import PageBody from '../../../Components/PageBody';
import ListContainerAccount from './ListContainerAccount';
import FlexColumn from '../../../Components/Flex/FlexColumn';
import FormsContainerAccount from './FormsContainerAccount';

class PageBodyContainerAccount extends React.Component {
  constructor(props) {
    super(props);

    const { statusAWS } = this.props;

    if (statusAWS === requestStatusTypes.SUCCESS) {
      const { statusStripe, statusAccount } = this.props;

      if (statusStripe === requestStatusTypes.IDLE || statusStripe === requestStatusTypes.ERROR) {
        this.props.handleStripe();
      }

      if (
        statusAccount[statusNames.AWS_FIELDS].status === requestStatusTypes.IDLE ||
        statusAccount[statusNames.AWS_FIELDS].status === requestStatusTypes.ERROR
      ) {
        this.props.handleAWSFields();
      }

      if (
        statusStripe === requestStatusTypes.SUCCESS &&
        statusAccount[statusNames.AWS_FIELDS].status === requestStatusTypes.SUCCESS &&
        statusAccount[statusNames.STRIPE_FIELDS].status === requestStatusTypes.IDLE
      ) {
        this.props.handleStripeFields();
      }
    }

    this.elements = {
      stripe: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { statusAWS, statusStripe, statusAccount } = nextProps;

    if (statusAWS === requestStatusTypes.SUCCESS) {
      if (statusStripe === requestStatusTypes.IDLE || statusStripe === requestStatusTypes.ERROR) {
        this.props.handleStripe();
      }

      if (
        statusAccount[statusNames.AWS_FIELDS].status === requestStatusTypes.IDLE ||
        statusAccount[statusNames.AWS_FIELDS].status === requestStatusTypes.ERROR
      ) {
        this.props.handleAWSFields();
      }

      if (
        statusStripe === requestStatusTypes.SUCCESS &&
        statusAccount[statusNames.AWS_FIELDS].status === requestStatusTypes.SUCCESS &&
        statusAccount[statusNames.STRIPE_FIELDS].status === requestStatusTypes.IDLE
      ) {
        this.props.handleStripeFields();
      }
    }
  }

  handleStripeChange = stripeEvent => {
    const billingStripe = this.props.forms[formNames.BILLING].inputs[
      inputNames[formNames.BILLING].STRIPE
    ];
    const { error } = stripeEvent;

    if (error) {
      switch (error.code) {
        case 'invalid_number':
          billingStripe.value = errorMessages.INVALID_CARD_NUMBER;
          break;
        case 'incomplete_number':
          billingStripe.value = errorMessages.INCOMPLETE_CARD_NUMBER;
          break;
        case 'invalid_expiry_year_past':
          billingStripe.value = errorMessages.INVALID_CARD_EXPIRATION_DATE;
          break;
        case 'incomplete_expiry':
          billingStripe.value = errorMessages.INVALID_CARD_EXPIRATION_DATE;
          break;
        case 'incomplete_cvc':
          billingStripe.value = errorMessages.INVALID_CARD_CVC;
          break;
        case 'incomplete_zip':
          billingStripe.value = errorMessages.INVALID_CARD_ZIP_CODE;
          break;
        default:
          billingStripe.value = stripeEvent.error.message;
          break;
      }

      billingStripe.errorMessage = billingStripe.value;
    } else if (stripeEvent.empty) {
      billingStripe.value = errorMessages.NO_STRIPE;
    } else if (billingStripe.errorMessage) {
      billingStripe.value = '';
      billingStripe.errorMessage = '';
    } else if (stripeEvent.complete) {
      billingStripe.value = 'complete';
    }

    this.props.handleInputValueError(billingStripe);
  };

  handleStripeLoaded = loaded => {
    this.props.handleStripeElementLoaded({
      id: inputNames[formNames.BILLING].STRIPE,
      loaded,
    });
  };

  resetStripeElement = () => {
    if (this.elements.stripe) {
      this.elements.stripe = null;
      this.handleStripeLoaded(false);
    }
  };

  stripeRef = element => {
    if (element && !this.elements.stripe) {
      this.elements.stripe = element;
      element.on('change', this.handleStripeChange);
      this.handleStripeLoaded(true);
    }
  };

  render() {
    const {
      width,
      mediaWidth,
      height,
      heightBuffer,
      menuHeight,
      menuHeightBuffer,
      statusStripe,
      statusAccount,
    } = this.props;
    const widthHalfString = `${width / 2}px`;
    const mediaWidthString = `${mediaWidth}px`;
    const heightString = `${height - heightBuffer}px`;
    const heightBufferHalfString = `${heightBuffer / 2}px`;
    const menuHeightString = `${menuHeight + menuHeightBuffer}px`;

    if (
      statusStripe !== requestStatusTypes.SUCCESS ||
      statusAccount[statusNames.AWS_FIELDS].status !== requestStatusTypes.SUCCESS ||
      statusAccount[statusNames.STRIPE_FIELDS].status !== requestStatusTypes.SUCCESS
    ) {
      return (
        <FlexColumn width="100%" height={`calc(100% - ${menuHeightString})`}>
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      );
    }

    return (
      <PageBody
        mediaWidth={mediaWidthString}
        responsive
        height={`calc(100% - ${menuHeightString})`}
      >
        <ListContainerAccount resetStripeElement={this.resetStripeElement} />
        <FlexColumn
          themeColor="secondary"
          borderColorType="default"
          separator
          mediaWidth={mediaWidthString}
          height={heightString}
          margin={`${heightBufferHalfString} 0`}
          borderWidth={`0 ${widthHalfString}`}
          borderRadius="4px"
        />
        <FormsContainerAccount
          stripeRef={this.stripeRef}
          resetStripeElement={this.resetStripeElement}
          stripeElement={this.elements.stripe}
        />
      </PageBody>
    );
  }
}

PageBodyContainerAccount.propTypes = {
  width: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  menuHeight: PropTypes.number.isRequired,
  menuHeightBuffer: PropTypes.number.isRequired,
  statusAWS: PropTypes.string.isRequired,
  statusStripe: PropTypes.string.isRequired,
  statusAccount: PropTypes.object.isRequired,
  forms: PropTypes.object.isRequired,
  handleStripe: PropTypes.func.isRequired,
  handleAWSFields: PropTypes.func.isRequired,
  handleStripeFields: PropTypes.func.isRequired,
  handleInputValueError: PropTypes.func.isRequired,
  handleStripeElementLoaded: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  width: state.ui.internal.account.utilities.separatorLine.width,
  mediaWidth: state.ui.internal.account.utilities.pageBody.mediaWidth,
  height: state.ui.internal.account.utilities.separatorLine.height,
  heightBuffer: state.ui.internal.account.utilities.separatorLine.heightBuffer,
  menuHeight: state.ui.internal.utilities.menu.height,
  menuHeightBuffer: state.ui.internal.utilities.menu.heightBuffer,
  statusAWS: state.data.aws.status,
  statusStripe: state.ui.app.stripe.status,
  statusAccount: state.data.account.status,
  forms: state.ui.internal.account.forms,
});

const mapDispatchToProps = dispatch => ({
  handleStripe: () => dispatch(loadStripe()),
  handleAWSFields: () => dispatch(loadAWSFields()),
  handleStripeFields: () => dispatch(loadStripeFields()),
  handleInputValueError: payload => dispatch(setInputValueError(payload)),
  handleStripeElementLoaded: payload => dispatch(setStripeElementLoaded(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageBodyContainerAccount);
