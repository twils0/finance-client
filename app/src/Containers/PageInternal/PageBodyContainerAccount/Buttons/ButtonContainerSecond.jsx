import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { statusNames } from '../../../../Constants/dataConstantsAccount';
import { buttonNames } from '../../../../Constants/uiConstantsAccount';

import handleClickSecondButton from '../../../../Actions/uiThunkAccount/handleClickSecondButton';

import ButtonSecond from '../../../../Components/PageInternal/PageBodyAccount/Buttons/ButtonSecond';

class ButtonContainerSecond extends React.Component {
  handleClick = (clickEvent) => {
    clickEvent.preventDefault();
    const { handleClickButton, resetStripeElement } = this.props;

    handleClickButton({ resetStripeElement });
  };

  render() {
    const {
      statusAccount, width, heightBuffer, secondButtonText,
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
      <ButtonSecond
        width={width}
        heightBuffer={heightBuffer}
        disabled={disabled}
        text={secondButtonText}
        handleClick={this.handleClick}
      />
    );
  }
}

ButtonContainerSecond.propTypes = {
  width: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  statusAccount: PropTypes.object.isRequired,
  secondButtonText: PropTypes.string.isRequired,
  resetStripeElement: PropTypes.func.isRequired,
  handleClickButton: PropTypes.func.isRequired,
};

ButtonContainerSecond.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  width: state.ui.internal.account.utilities.buttons.width,
  heightBuffer: state.ui.internal.account.utilities.buttons.heightBuffer,
  statusAccount: state.data.account.status,
  secondButtonText: state.ui.internal.account.buttons[buttonNames.SECOND].text,
  resetStripeElement: ownProps.resetStripeElement,
});

const mapDispatchToProps = dispatch => ({
  handleClickButton: payload => dispatch(handleClickSecondButton(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonContainerSecond);
