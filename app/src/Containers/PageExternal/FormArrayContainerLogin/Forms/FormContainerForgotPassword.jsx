import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import { BeatLoader } from 'halogenium';

import theme from '../../../../themes';

import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { statusNames } from '../../../../Constants/dataConstantsAuth';
import { errorMessages } from '../../../../Constants/uiConstantsApp';
import { formNames } from '../../../../Constants/uiConstantsExternal';
import { setInputValueError } from '../../../../Actions/uiActionsExternal';

import FlexColumn from '../../../../Components/Flex/FlexColumn';
import FormForgotPassword from '../../../../Components/PageExternal/FormArrayLogin/Forms/FormForgotPassword';

class FormContainerForgotPassword extends React.Component {
  componentDidMount() {
    this.props.setHeight(formNames.FORGOT_PASSWORD);
  }

  componentWillUpdate(nextProps) {
    const { statusAuth } = nextProps;

    if (
      statusAuth[statusNames.FORGOT_PASSWORD].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.FORGOT_PASSWORD].status === requestStatusTypes.SUCCESS
    ) {
      nextProps.clearElement(formNames.FORGOT_PASSWORD);
    }
  }

  componentDidUpdate() {
    this.props.setHeight(formNames.FORGOT_PASSWORD);
  }

  componentWillUnmount() {
    this.props.clearElement(formNames.FORGOT_PASSWORD);
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
          case errorMessages.NO_EMAIL: {
            if (input.value && isEmail(input.value)) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.INVALID_EMAIL: {
            if (isEmail(input.value)) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.EMAIL_NOT_FOUND: {
            if (isEmail(input.value)) {
              input.errorMessage = '';
            }
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
      heightRef,
      width,
      mediaWidth,
      formHeightBuffer,
      inputHeightBuffer,
      statusAuth,
      currentForm,
      inputs,
    } = this.props;

    if (
      statusAuth[statusNames.FORGOT_PASSWORD].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.FORGOT_PASSWORD].status === requestStatusTypes.SUCCESS
    ) {
      const widthString = `${width}px`;

      return (
        <FlexColumn width={widthString} height="100%">
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      );
    }
    return (
      <FormForgotPassword
        heightRef={heightRef}
        width={width}
        mediaWidth={mediaWidth}
        formHeightBuffer={formHeightBuffer}
        inputHeightBuffer={inputHeightBuffer}
        currentFormBool={currentForm === formNames.FORGOT_PASSWORD}
        inputs={inputs}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

FormContainerForgotPassword.propTypes = {
  heightRef: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
  statusAuth: PropTypes.object.isRequired,
  currentForm: PropTypes.string.isRequired,
  inputs: PropTypes.object.isRequired,
  setHeight: PropTypes.func.isRequired,
  clearElement: PropTypes.func.isRequired,
  handleInputValueError: PropTypes.func.isRequired,
};

FormContainerForgotPassword.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  heightRef: ownProps.heightRef,
  width: state.ui.external.utilities.forms.width,
  mediaWidth: state.ui.external.utilities.forms.mediaWidth,
  formHeightBuffer: state.ui.external.utilities.forms.heightBuffer,
  inputHeightBuffer: state.ui.external.utilities.forms.inputs.heightBuffer,
  statusAuth: state.data.auth.status,
  currentForm: state.ui.external.forms.current,
  inputs: state.ui.external.forms[formNames.FORGOT_PASSWORD].inputs,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
});

const mapDispatchToProps = dispatch => ({
  handleInputValueError: payload => dispatch(setInputValueError(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormContainerForgotPassword);
