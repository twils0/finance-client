import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import equals from 'validator/lib/equals';
import { BeatLoader } from 'halogenium';

import theme from '../../../../themes';

import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { statusNames } from '../../../../Constants/dataConstantsAuth';
import { errorMessages } from '../../../../Constants/uiConstantsApp';
import { formNames, inputNames } from '../../../../Constants/uiConstantsAccount';
import { setInputValueError } from '../../../../Actions/uiActionsAccount';

import FlexColumn from '../../../../Components/Flex/FlexColumn';
import FormChangePassword from '../../../../Components/PageInternal/PageBodyAccount/Forms/FormChangePassword';

class FormContainerChangePassword extends React.Component {
  componentDidMount() {
    this.props.setHeight(formNames.CHANGE_PASSWORD);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.statusAuth[statusNames.CHANGE_PASSWORD].status === requestStatusTypes.LOADING) {
      nextProps.clearElement(formNames.CHANGE_PASSWORD);
    }
  }

  componentDidUpdate() {
    this.props.setHeight(formNames.CHANGE_PASSWORD);
  }

  componentWillUnmount() {
    this.props.clearElement(formNames.CHANGE_PASSWORD);
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
          case errorMessages.NO_PASSWORD: {
            if (input.value) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.NO_NEW_PASSWORD: {
            if (input.value) {
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
          case errorMessages.NO_MATCH_PASSWORD: {
            if (
              equals(
                inputs[inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD].value,
                inputs[inputNames[formNames.CHANGE_PASSWORD].NEW_PASSWORD2].value,
              )
            ) {
              input.errorMessage = '';
            }
            break;
          }
          case errorMessages.PASSWORD_NOT_FOUND: {
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
      rowWidthIndent,
      headerWidthBufferRight,
      mediaWidth,
      height,
      rowHeight,
      rowHeightBuffer,
      statusAuth,
      currentForm,
      inputs,
    } = this.props;

    if (statusAuth[statusNames.CHANGE_PASSWORD].status === requestStatusTypes.LOADING) {
      const heightString = `${height}px`;

      return (
        <FlexColumn width="100%" height={heightString}>
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      );
    }
    return (
      <FormChangePassword
        heightRef={heightRef}
        rowWidthIndent={rowWidthIndent}
        headerWidthBufferRight={headerWidthBufferRight}
        mediaWidth={mediaWidth}
        rowHeight={rowHeight}
        rowHeightBuffer={rowHeightBuffer}
        currentFormBool={currentForm === formNames.CHANGE_PASSWORD}
        inputs={inputs}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

FormContainerChangePassword.propTypes = {
  heightRef: PropTypes.func.isRequired,
  rowWidthIndent: PropTypes.number.isRequired,
  headerWidthBufferRight: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowHeightBuffer: PropTypes.number.isRequired,
  statusAuth: PropTypes.object.isRequired,
  currentForm: PropTypes.string.isRequired,
  inputs: PropTypes.object.isRequired,
  setHeight: PropTypes.func.isRequired,
  clearElement: PropTypes.func.isRequired,
  handleInputValueError: PropTypes.func.isRequired,
};

FormContainerChangePassword.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  heightRef: ownProps.heightRef,
  rowWidthIndent: state.ui.internal.account.utilities.forms.rowWidthIndent,
  headerWidthBufferRight: state.ui.internal.account.utilities.forms.headerWidthBufferRight,
  mediaWidth: state.ui.internal.account.utilities.pageBody.mediaWidth,
  height: state.ui.internal.account.forms[formNames.BILLING].height,
  rowHeight: state.ui.internal.account.utilities.forms.rowHeight,
  rowHeightBuffer: state.ui.internal.account.utilities.forms.rowHeightBuffer,
  heightBuffer: state.ui.internal.account.utilities.forms.heightBuffer,
  statusAuth: state.data.auth.status,
  currentForm: state.ui.internal.account.forms.current,
  inputs: state.ui.internal.account.forms[formNames.CHANGE_PASSWORD].inputs,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
});

const mapDispatchToProps = dispatch => ({
  handleInputValueError: payload => dispatch(setInputValueError(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormContainerChangePassword);
