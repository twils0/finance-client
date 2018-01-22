import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { BeatLoader } from 'halogenium';

import theme from '../../../../themes';

import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { statusNames, fieldNames } from '../../../../Constants/dataConstantsAccount';
import { errorMessages } from '../../../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../../../Constants/uiConstantsAccount';
import { setInputValueError } from '../../../../Actions/uiActionsAccount';

import FlexColumn from '../../../../Components/Flex/FlexColumn';
import FormProfile from '../../../../Components/PageInternal/PageBodyAccount/Forms/FormProfile';

class FormContainerProfile extends React.Component {
  componentWillMount() {
    const { inputs, dataAccountFields, handleInputValueError } = this.props;

    const uiName = inputs[inputNames[formNames.PROFILE].NAME];
    const uiEmail = inputs[inputNames[formNames.PROFILE].EMAIL];
    const uiEmailAdditional = inputs[inputNames[formNames.PROFILE].EMAIL_ADDITIONAL];
    const uiPhone = inputs[inputNames[formNames.PROFILE].PHONE];
    const dataPhone = dataAccountFields[fieldNames.PHONE].value;

    uiName.value = dataAccountFields[fieldNames.NAME].value;
    uiEmail.value = dataAccountFields[fieldNames.EMAIL].value;
    uiEmailAdditional.value = dataAccountFields[fieldNames.EMAIL_ADDITIONAL].value;

    if (dataPhone) {
      const E164Phone = dataAccountFields[fieldNames.PHONE].value;
      const formattedPhone = `${E164Phone.substring(2, 5)}-${E164Phone.substring(
        5,
        8,
      )}-${E164Phone.substring(8, 12)}`;

      uiPhone.value = formattedPhone;
    }

    handleInputValueError(uiName);
    handleInputValueError(uiEmail);
    handleInputValueError(uiEmailAdditional);
    handleInputValueError(uiPhone);
  }

  componentDidMount() {
    this.props.setHeight(formNames.PROFILE);
  }

  componentWillUpdate(nextProps) {
    const { statusAccount } = nextProps;

    if (
      statusAccount[statusNames.UPDATE_AWS_FIELDS].status === requestStatusTypes.LOADING ||
      statusAccount[statusNames.UPDATE_STRIPE_FIELDS_REQUEST].status ===
        requestStatusTypes.LOADING ||
      statusAccount[statusNames.UPDATE_DB_FIELDS].status === requestStatusTypes.LOADING
    ) {
      nextProps.clearElement(formNames.PROFILE);
    }
  }

  componentDidUpdate() {
    this.props.setHeight(formNames.PROFILE);
  }

  componentWillUnmount() {
    this.props.clearElement(formNames.PROFILE);
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
            if (
              isEmail(input.value) ||
              input.id === inputNames[formNames.PROFILE].EMAIL_ADDITIONAL
            ) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.EMAIL_IN_USE_INTERNAL: {
            if (isEmail(input.value)) {
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
      rowWidthIndent,
      headerWidthBufferRight,
      mediaWidth,
      height,
      rowHeight,
      rowHeightBuffer,
      statusAccount,
      currentForm,
      editForm,
      inputs,
    } = this.props;

    if (
      statusAccount[statusNames.UPDATE_AWS_FIELDS].status === requestStatusTypes.LOADING ||
      statusAccount[statusNames.UPDATE_STRIPE_FIELDS_REQUEST].status ===
        requestStatusTypes.LOADING ||
      statusAccount[statusNames.UPDATE_DB_FIELDS].status === requestStatusTypes.LOADING
    ) {
      const heightString = `${height}px`;

      return (
        <FlexColumn width="100%" height={heightString}>
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      );
    }
    return (
      <FormProfile
        heightRef={heightRef}
        rowWidthIndent={rowWidthIndent}
        headerWidthBufferRight={headerWidthBufferRight}
        mediaWidth={mediaWidth}
        rowHeight={rowHeight}
        rowHeightBuffer={rowHeightBuffer}
        currentFormBool={currentForm === formNames.PROFILE}
        editForm={editForm}
        inputs={inputs}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

FormContainerProfile.propTypes = {
  heightRef: PropTypes.func.isRequired,
  rowWidthIndent: PropTypes.number.isRequired,
  headerWidthBufferRight: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowHeightBuffer: PropTypes.number.isRequired,
  statusAccount: PropTypes.object.isRequired,
  currentForm: PropTypes.string.isRequired,
  editForm: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
  dataAccountFields: PropTypes.object.isRequired,
  setHeight: PropTypes.func.isRequired,
  clearElement: PropTypes.func.isRequired,
  handleInputValueError: PropTypes.func.isRequired,
};

FormContainerProfile.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  heightRef: ownProps.heightRef,
  rowWidthIndent: state.ui.internal.account.utilities.forms.rowWidthIndent,
  headerWidthBufferRight: state.ui.internal.account.utilities.forms.headerWidthBufferRight,
  mediaWidth: state.ui.internal.account.utilities.pageBody.mediaWidth,
  height: state.ui.internal.account.forms[formNames.BILLING].height,
  rowHeight: state.ui.internal.account.utilities.forms.rowHeight,
  rowHeightBuffer: state.ui.internal.account.utilities.forms.rowHeightBuffer,
  heightBuffer: state.ui.internal.account.utilities.forms.heightBuffer,
  statusAccount: state.data.account.status,
  currentForm: state.ui.internal.account.forms.current,
  editForm: state.ui.internal.account.forms[formNames.PROFILE].edit,
  inputs: state.ui.internal.account.forms[formNames.PROFILE].inputs,
  dataAccountFields: state.data.account.fields,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
});

const mapDispatchToProps = dispatch => ({
  handleInputValueError: payload => dispatch(setInputValueError(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormContainerProfile);
