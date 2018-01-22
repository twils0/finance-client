import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import equals from 'validator/lib/equals';
import { BeatLoader } from 'halogenium';

import theme from '../../../../themes';

import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { statusNames } from '../../../../Constants/dataConstantsAuth';
import { errorMessages } from '../../../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../../../Constants/uiConstantsExternal';
import { setInputValueError } from '../../../../Actions/uiActionsExternal';

import FlexColumn from '../../../../Components/Flex/FlexColumn';
import FormResetPassword from '../../../../Components/PageExternal/FormArrayLogin/Forms/FormResetPassword';

class FormContainerResetPassword extends React.Component {
  componentDidMount() {
    this.props.setHeight(formNames.RESET_PASSWORD);
  }

  componentWillUpdate(nextProps) {
    const { statusAuth } = nextProps;

    if (
      statusAuth[statusNames.RESET_PASSWORD].status === requestStatusTypes.LOADING ||
      statusAuth[statusNames.RESET_PASSWORD].status === requestStatusTypes.SUCCESS
    ) {
      nextProps.clearElement(formNames.RESET_PASSWORD);
    }
  }

  componentDidUpdate() {
    this.props.setHeight(formNames.RESET_PASSWORD);
  }

  componentWillUnmount() {
    this.props.clearElement(formNames.RESET_PASSWORD);
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
          case errorMessages.NO_CODE: {
            if (input.value) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.INVALID_CODE: {
            input.errorMessage = '';
            break;
          }
          case errorMessages.NO_PASSWORD: {
            if (input.value) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.NO_MATCH_PASSWORD: {
            if (
              equals(
                inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD].value,
                inputs[inputNames[formNames.RESET_PASSWORD].PASSWORD2].value,
              )
            ) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.INVALID_PASSWORD: {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
            if (!passwordRegex.test(input.value)) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.NO_TERMS: {
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
      statusAuth[statusNames.RESET_PASSWORD].status === requestStatusTypes.LOADING ||
      statusAuth[statusNames.RESET_PASSWORD].status === requestStatusTypes.SUCCESS
    ) {
      const widthString = `${width}px`;

      return (
        <FlexColumn width={widthString} height="100%">
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      );
    }
    return (
      <FormResetPassword
        heightRef={heightRef}
        width={width}
        mediaWidth={mediaWidth}
        formHeightBuffer={formHeightBuffer}
        inputHeightBuffer={inputHeightBuffer}
        currentFormBool={currentForm === formNames.RESET_PASSWORD}
        inputs={inputs}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

FormContainerResetPassword.propTypes = {
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

FormContainerResetPassword.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  heightRef: ownProps.heightRef,
  width: state.ui.external.utilities.forms.width,
  mediaWidth: state.ui.external.utilities.forms.mediaWidth,
  formHeightBuffer: state.ui.external.utilities.forms.heightBuffer,
  inputHeightBuffer: state.ui.external.utilities.forms.inputs.heightBuffer,
  statusAuth: state.data.auth.status,
  currentForm: state.ui.external.forms.current,
  inputs: state.ui.external.forms[formNames.RESET_PASSWORD].inputs,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
});

const mapDispatchToProps = dispatch => ({
  handleInputValueError: payload => dispatch(setInputValueError(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormContainerResetPassword));
