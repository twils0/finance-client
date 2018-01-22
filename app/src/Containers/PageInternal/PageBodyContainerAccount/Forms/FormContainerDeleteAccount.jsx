import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BeatLoader } from 'halogenium';

import theme from '../../../../themes';

import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { statusNames } from '../../../../Constants/dataConstantsAuth';
import { errorMessages } from '../../../../Constants/uiConstantsApp';
import { formNames } from '../../../../Constants/uiConstantsAccount';
import { setInputValueError } from '../../../../Actions/uiActionsAccount';

import FlexColumn from '../../../../Components/Flex/FlexColumn';
import FormDeleteAccount from '../../../../Components/PageInternal/PageBodyAccount/Forms/FormDeleteAccount';

class FormContainerDeleteAccount extends React.Component {
  componentDidMount() {
    this.props.setHeight(formNames.DELETE_ACCOUNT);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.statusAuth[statusNames.DELETE_ACCOUNT].status === requestStatusTypes.LOADING) {
      nextProps.clearElement(formNames.DELETE_ACCOUNT);
    }
  }

  componentDidUpdate() {
    this.props.setHeight(formNames.DELETE_ACCOUNT);
  }

  componentWillUnmount() {
    this.props.clearElement(formNames.DELETE_ACCOUNT);
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
          case errorMessages.INVALID_DELETE_ACCOUNT: {
            if (input.value && input.value === 'delete') {
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
      editForm,
      inputs,
    } = this.props;

    if (statusAuth[statusNames.DELETE_ACCOUNT].status === requestStatusTypes.LOADING) {
      const heightString = `${height}px`;

      return (
        <FlexColumn width="100%" height={heightString}>
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      );
    }
    return (
      <FormDeleteAccount
        heightRef={heightRef}
        rowWidthIndent={rowWidthIndent}
        headerWidthBufferRight={headerWidthBufferRight}
        mediaWidth={mediaWidth}
        rowHeight={rowHeight}
        rowHeightBuffer={rowHeightBuffer}
        currentFormBool={currentForm === formNames.DELETE_ACCOUNT}
        editForm={editForm}
        inputs={inputs}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

FormContainerDeleteAccount.propTypes = {
  heightRef: PropTypes.func.isRequired,
  rowWidthIndent: PropTypes.number.isRequired,
  headerWidthBufferRight: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowHeightBuffer: PropTypes.number.isRequired,
  statusAuth: PropTypes.object.isRequired,
  currentForm: PropTypes.string.isRequired,
  editForm: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
  setHeight: PropTypes.func.isRequired,
  clearElement: PropTypes.func.isRequired,
  handleInputValueError: PropTypes.func.isRequired,
};

FormContainerDeleteAccount.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  heightRef: ownProps.heightRef,
  rowWidthIndent: state.ui.internal.account.utilities.forms.rowWidthIndent,
  headerWidthBufferRight: state.ui.internal.account.utilities.forms.headerWidthBufferRight,
  mediaWidth: state.ui.internal.account.utilities.pageBody.mediaWidth,
  height: state.ui.internal.account.forms[formNames.BILLING].height,
  rowHeight: state.ui.internal.account.utilities.forms.rowHeight,
  rowHeightBuffer: state.ui.internal.account.utilities.forms.rowHeightBuffer,
  heightBuffer: state.ui.internal.account.utilities.forms.heightBuffer,
  currentForm: state.ui.internal.account.forms.current,
  statusAuth: state.data.auth.status,
  editForm: state.ui.internal.account.forms[formNames.DELETE_ACCOUNT].edit,
  inputs: state.ui.internal.account.forms[formNames.DELETE_ACCOUNT].inputs,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
});

const mapDispatchToProps = dispatch => ({
  handleInputValueError: payload => dispatch(setInputValueError(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormContainerDeleteAccount);
