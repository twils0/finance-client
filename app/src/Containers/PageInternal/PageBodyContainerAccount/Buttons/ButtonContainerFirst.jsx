import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { buttonNames } from '../../../../Constants/uiConstantsAccount';
import { statusNames } from '../../../../Constants/dataConstantsAccount';
import handleClickFirstButton from '../../../../Actions/uiThunkAccount/handleClickFirstButton';

import ButtonFirst from '../../../../Components/PageInternal/PageBodyAccount/Buttons/ButtonFirst';

class ButtonContainerFirst extends React.Component {
  handleClick = (clickEvent) => {
    clickEvent.preventDefault();
    const { handleClickButton, stripeElement, resetStripeElement } = this.props;

    handleClickButton({ stripeElement, resetStripeElement });
  };

  render() {
    const {
      statusAccount, width, heightBuffer, firstButtonText,
    } = this.props;
    let disabled = false;

    if (
      statusAccount[statusNames.UPDATE_STRIPE_FIELDS_REQUEST].status ===
        requestStatusTypes.LOADING ||
      statusAccount[statusNames.UPDATE_DB_FIELDS].status === requestStatusTypes.LOADING ||
      statusAccount[statusNames.UPDATE_AWS_FIELDS].status === requestStatusTypes.LOADING
    ) {
      disabled = true;
    }

    return (
      <ButtonFirst
        width={width}
        heightBuffer={heightBuffer}
        disabled={disabled}
        text={firstButtonText}
        handleClick={this.handleClick}
      />
    );
  }
}

ButtonContainerFirst.propTypes = {
  width: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  statusAccount: PropTypes.object.isRequired,
  firstButtonText: PropTypes.string.isRequired,
  stripeElement: PropTypes.object,
  resetStripeElement: PropTypes.func.isRequired,
  handleClickButton: PropTypes.func.isRequired,
};

ButtonContainerFirst.defaultProps = {
  stripeElement: {},
};

const mapStateToProps = (state, ownProps) => ({
  width: state.ui.internal.account.utilities.buttons.width,
  heightBuffer: state.ui.internal.account.utilities.buttons.heightBuffer,
  statusAccount: state.data.account.status,
  firstButtonText: state.ui.internal.account.buttons[buttonNames.FIRST].text,
  stripeElement: ownProps.stripeElement,
  resetStripeElement: ownProps.resetStripeElement,
});

const mapDispatchToProps = dispatch => ({
  handleClickButton: payload => dispatch(handleClickFirstButton(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonContainerFirst);
