import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { requestStatusTypes } from '../../../Constants/universalConstants';
import { statusNames } from '../../../Constants/dataConstantsAuth';
import { buttonNames } from '../../../Constants/uiConstantsExternal';

import handleClickFirstButton from '../../../Actions/uiThunkExternal/handleClickFirstButton';

import ButtonFirst from '../../../Components/PageExternal/Buttons/ButtonFirst';

class ButtonContainerFirst extends React.Component {
  handleClick = (clickEvent) => {
    clickEvent.preventDefault();
    const {
      handleClickButton, history, match, stripeElement, resetStripeElement,
    } = this.props;

    handleClickButton({
      history,
      match,
      stripeElement,
      resetStripeElement,
    });
  };

  render() {
    const {
      width, heightBuffer, statusAuth, text,
    } = this.props;
    let disabled = false;

    if (
      statusAuth[statusNames.LOGIN].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.SIGN_OUT_DEVICES].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.LOGIN_MFA].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.VERIFY_PHONE].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.VERIFY_PHONE_CODE].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.VERIFY_EMAIL].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.FORGOT_PASSWORD].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.CHANGE_PASSWORD].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.SIGN_UP].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.SIGN_UP].status === requestStatusTypes.SUCCESS
    ) {
      disabled = true;
    }

    return (
      <ButtonFirst
        width={width}
        heightBuffer={heightBuffer}
        disabled={disabled}
        text={text}
        handleClick={this.handleClick}
      />
    );
  }
}

ButtonContainerFirst.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  stripeElement: PropTypes.object,
  width: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  statusAuth: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  resetStripeElement: PropTypes.func.isRequired,
  handleClickButton: PropTypes.func.isRequired,
};

ButtonContainerFirst.defaultProps = {
  stripeElement: {},
};

const mapStateToProps = (state, ownProps) => ({
  history: ownProps.history,
  match: ownProps.match,
  stripeElement: ownProps.stripeElement,
  width: state.ui.external.utilities.buttons.width,
  heightBuffer: state.ui.external.utilities.buttons.heightBuffer,
  statusAuth: state.data.auth.status,
  text: state.ui.external.buttons[buttonNames.FIRST].text,
  resetStripeElement: ownProps.resetStripeElement,
});

const mapDispatchToProps = dispatch => ({
  handleClickButton: payload => dispatch(handleClickFirstButton(payload)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ButtonContainerFirst),
);
