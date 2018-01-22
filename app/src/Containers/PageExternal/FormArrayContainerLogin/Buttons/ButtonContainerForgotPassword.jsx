import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { formNames, inputNames, buttonNames } from '../../../../Constants/uiConstantsExternal';
import { setCurrentForm, setInputValueError } from '../../../../Actions/uiActionsExternal';

import ButtonForgotPassword from '../../../../Components/PageExternal/FormArrayLogin/Buttons/ButtonForgotPassword';

class ButtonContainerForgotPassword extends React.Component {
  handleForgotPasswordButtonClick = (clickEvent) => {
    clickEvent.preventDefault();
    const { forms, handleCurrentForm, handleInputValueError } = this.props;
    const loginEmail = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].EMAIL];
    const loginPassword = forms[formNames.LOGIN].inputs[inputNames[formNames.LOGIN].PASSWORD];

    handleCurrentForm({ current: formNames.FORGOT_PASSWORD });

    if (loginEmail.value || loginEmail.errorMessage) {
      loginEmail.value = '';
      loginEmail.errorMessage = '';

      handleInputValueError(loginEmail);
    }

    if (loginPassword.value || loginPassword.errorMessage) {
      loginPassword.value = '';
      loginPassword.errorMessage = '';

      handleInputValueError(loginPassword);
    }
  };

  render() {
    const { forms, width, text } = this.props;

    return (
      <ButtonForgotPassword
        currentForm={forms.current}
        width={width}
        text={text}
        handleClick={this.handleForgotPasswordButtonClick}
      />
    );
  }
}

ButtonContainerForgotPassword.propTypes = {
  width: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  forms: PropTypes.object.isRequired,
  handleCurrentForm: PropTypes.func.isRequired,
  handleInputValueError: PropTypes.func.isRequired,
};

ButtonContainerForgotPassword.defaultProps = {};

const mapStateToProps = state => ({
  width: state.ui.external.utilities.buttons.width,
  text: state.ui.external.buttons[buttonNames.FORGOT_PASSWORD].text,
  forms: state.ui.external.forms,
});

const mapDispatchToProps = dispatch => ({
  handleCurrentForm: payload => dispatch(setCurrentForm(payload)),
  handleInputValueError: payload => dispatch(setInputValueError(payload)),
});

// eslint-disable-next-line
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ButtonContainerForgotPassword));
