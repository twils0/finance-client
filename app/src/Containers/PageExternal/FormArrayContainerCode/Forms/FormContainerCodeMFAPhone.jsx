import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BeatLoader } from 'halogenium';

import theme from '../../../../themes';

import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { statusNames } from '../../../../Constants/dataConstantsAuth';
import { errorMessages } from '../../../../Constants/uiConstantsApp';
import { formNames } from '../../../../Constants/uiConstantsExternal';
import { setInputValueError } from '../../../../Actions/uiActionsExternal';

import FlexColumn from '../../../../Components/Flex/FlexColumn';
import FormCodeMFAPhone from '../../../../Components/PageExternal/FormArrayCode/Forms/FormCodeMFAPhone';

class FormContainerCodeMFAPhone extends React.Component {
  componentDidMount() {
    this.props.setHeight(formNames.CODE_MFA_PHONE);
  }

  componentWillUpdate(nextProps) {
    const { statusAuth } = nextProps;

    if (
      statusAuth[statusNames.LOGIN_MFA].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.LOGIN_MFA].status === requestStatusTypes.SUCCESS
    ) {
      nextProps.clearElement(formNames.CODE_MFA_PHONE);
    }
  }

  componentDidUpdate() {
    this.props.setHeight(formNames.CODE_MFA_PHONE);
  }

  componentWillUnmount() {
    this.props.clearElement(formNames.CODE_MFA_PHONE);
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
          case errorMessages.NO_VERIFICATION_CODE_PHONE: {
            if (input.value) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.NO_CONFIRMATION_CODE_PHONE: {
            if (input.value) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.INVALID_VERIFICATION_CODE:
            input.errorMessage = '';
            break;
          case errorMessages.INVALID_CONFIRMATION_CODE:
            input.errorMessage = '';
            break;
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
      statusAuth[statusNames.LOGIN_MFA].status === requestStatusTypes.LOADING
      || statusAuth[statusNames.LOGIN_MFA].status === requestStatusTypes.SUCCESS
    ) {
      const widthString = `${width}px`;

      return (
        <FlexColumn width={widthString} height="100%">
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      );
    }
    return (
      <FormCodeMFAPhone
        heightRef={heightRef}
        width={width}
        mediaWidth={mediaWidth}
        formHeightBuffer={formHeightBuffer}
        inputHeightBuffer={inputHeightBuffer}
        currentFormBool={currentForm === formNames.CODE_MFA_PHONE}
        inputs={inputs}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

FormContainerCodeMFAPhone.propTypes = {
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

const mapStateToProps = (state, ownProps) => ({
  heightRef: ownProps.heightRef,
  width: state.ui.external.utilities.forms.width,
  mediaWidth: state.ui.external.utilities.forms.mediaWidth,
  formHeightBuffer: state.ui.external.utilities.forms.heightBuffer,
  inputHeightBuffer: state.ui.external.utilities.forms.inputs.heightBuffer,
  statusAuth: state.data.auth.status,
  currentForm: state.ui.external.forms.current,
  inputs: state.ui.external.forms[formNames.CODE_MFA_PHONE].inputs,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
});

const mapDispatchToProps = dispatch => ({
  handleInputValueError: payload => dispatch(setInputValueError(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormContainerCodeMFAPhone);
