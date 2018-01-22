import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

import { errorMessages } from '../../../../Constants/uiConstantsApp';
import { formNames } from '../../../../Constants/uiConstantsExternal';
import { setInputValueError } from '../../../../Actions/uiActionsExternal';

import FormInfo from '../../../../Components/PageExternal/FormArraySignUp/Forms/FormInfo';

class FormContainerInfo extends React.Component {
  componentDidMount() {
    this.props.setHeight(formNames.INFO);
  }

  componentDidUpdate() {
    this.props.setHeight(formNames.INFO);
  }

  componentWillUnmount() {
    this.props.clearElement(formNames.INFO);
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
          case errorMessages.NO_NAME: {
            if (input.value) {
              input.errorMessage = '';
            }
            break;
          }
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
          case errorMessages.EMAIL_IN_USE: {
            if (isEmail(input.value)) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.NO_PASSWORD: {
            if (input.value) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.NO_PHONE: {
            const testPhone = input.value.replace(/[-() ]/g, '');
            if (input.value && isMobilePhone(testPhone, 'en-US')) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.INVALID_PHONE: {
            const testPhone = input.value.replace(/[-() ]/g, '');
            if (isMobilePhone(testPhone, 'en-US')) {
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
      currentForm,
      inputs,
    } = this.props;

    return (
      <FormInfo
        heightRef={heightRef}
        width={width}
        mediaWidth={mediaWidth}
        formHeightBuffer={formHeightBuffer}
        inputHeightBuffer={inputHeightBuffer}
        currentFormBool={currentForm === formNames.INFO}
        inputs={inputs}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

FormContainerInfo.propTypes = {
  heightRef: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
  currentForm: PropTypes.string.isRequired,
  inputs: PropTypes.object.isRequired,
  setHeight: PropTypes.func.isRequired,
  clearElement: PropTypes.func.isRequired,
  handleInputValueError: PropTypes.func.isRequired,
};

FormContainerInfo.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  heightRef: ownProps.heightRef,
  width: state.ui.external.utilities.forms.width,
  mediaWidth: state.ui.external.utilities.forms.mediaWidth,
  formHeightBuffer: state.ui.external.utilities.forms.heightBuffer,
  inputHeightBuffer: state.ui.external.utilities.forms.inputs.heightBuffer,
  currentForm: state.ui.external.forms.current,
  inputs: state.ui.external.forms[formNames.INFO].inputs,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
});

const mapDispatchToProps = dispatch => ({
  handleInputValueError: payload => dispatch(setInputValueError(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormContainerInfo));
