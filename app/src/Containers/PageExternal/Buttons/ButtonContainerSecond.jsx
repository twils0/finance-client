import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { requestStatusTypes } from '../../../Constants/universalConstants';
import { statusNames } from '../../../Constants/dataConstantsAuth';
import { buttonNames } from '../../../Constants/uiConstantsExternal';
import handleClickSecondButton from '../../../Actions/uiThunkExternal/handleClickSecondButton';

import ButtonSecond from '../../../Components/PageExternal/Buttons/ButtonSecond';

class ButtonContainerSecond extends React.Component {
  handleClick = (clickEvent) => {
    clickEvent.preventDefault();
    const { handleClickButton, history, resetStripeElement } = this.props;

    handleClickButton({ history, resetStripeElement });
  };

  render() {
    const { width, statusAuth, text } = this.props;
    let disabled = false;

    if (
      statusAuth[statusNames.LOGIN].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.SIGN_OUT_DEVICES].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.LOGIN_MFA].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.VERIFY_EMAIL].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.FORGOT_PASSWORD].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.CHANGE_PASSWORD].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.SIGN_UP].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.SIGN_UP].status === requestStatusTypes.SUCCESS
    ) {
      disabled = true;
    }

    return (
      <ButtonSecond width={width} disabled={disabled} text={text} handleClick={this.handleClick} />
    );
  }
}

ButtonContainerSecond.propTypes = {
  history: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  statusAuth: PropTypes.object.isRequired,
  resetStripeElement: PropTypes.func.isRequired,
  handleClickButton: PropTypes.func.isRequired,
};

ButtonContainerSecond.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  width: state.ui.external.utilities.buttons.width,
  heightBuffer: state.ui.external.utilities.buttons.heightBuffer,
  forms: state.ui.external.forms,
  text: state.ui.external.buttons[buttonNames.SECOND].text,
  statusAuth: state.data.auth.status,
  resetStripeElement: ownProps.resetStripeElement,
});

const mapDispatchToProps = dispatch => ({
  handleClickButton: payload => dispatch(handleClickSecondButton(payload)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ButtonContainerSecond),
);
