import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { formNames, buttonNames } from '../../../../Constants/uiConstantsExternal';

import handleClickResendButton from '../../../../Actions/uiThunkExternal/handleClickResendButton';

import ButtonResend from '../../../../Components/PageExternal/FormArrayCode/Buttons/ButtonResend';

class ButtonContainerResend extends React.Component {
  handleClick = (clickEvent) => {
    clickEvent.preventDefault();
    const { handleClickButton, history } = this.props;

    handleClickButton({ history });
  };

  render() {
    const {
      forms, width, buttonTextPhone, buttonTextEmail,
    } = this.props;
    let text = null;

    if (forms.current === formNames.CODE_VERIFY_PHONE) {
      text = buttonTextPhone;
    } else {
      text = buttonTextEmail;
    }

    return (
      <ButtonResend
        currentForm={forms.current}
        width={width}
        text={text}
        handleClick={this.handleClick}
      />
    );
  }
}

ButtonContainerResend.propTypes = {
  history: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  buttonTextPhone: PropTypes.string.isRequired,
  buttonTextEmail: PropTypes.string.isRequired,
  forms: PropTypes.object.isRequired,
  handleClickButton: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  history: ownProps.history,
  width: state.ui.external.utilities.buttons.width,
  buttonTextPhone: state.ui.external.buttons[buttonNames.RESEND_PHONE].text,
  buttonTextEmail: state.ui.external.buttons[buttonNames.RESEND_EMAIL].text,
  forms: state.ui.external.forms,
});

const mapDispatchToProps = dispatch => ({
  handleClickButton: payload => dispatch(handleClickResendButton(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ButtonContainerResend));
