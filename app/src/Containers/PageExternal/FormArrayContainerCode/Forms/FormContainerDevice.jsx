import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BeatLoader } from 'halogenium';

import theme from '../../../../themes';

import { requestStatusTypes } from '../../../../Constants/universalConstants';
import { statusNames } from '../../../../Constants/dataConstantsAuth';
import { formNames } from '../../../../Constants/uiConstantsExternal';

import FlexColumn from '../../../../Components/Flex/FlexColumn';
import FormDevice from '../../../../Components/PageExternal/FormArrayCode/Forms/FormDevice';

class FormContainerDevice extends React.Component {
  componentDidMount() {
    this.props.setHeight(formNames.DEVICE);
  }

  componentWillUpdate(nextProps) {
    const { statusAuth } = nextProps;

    if (
      statusAuth[statusNames.SIGN_OUT_DEVICES].status === requestStatusTypes.LOADING ||
      statusAuth[statusNames.SIGN_OUT_DEVICES].status === requestStatusTypes.SUCCESS
    ) {
      nextProps.clearElement(formNames.DEVICE);
    }
  }

  componentDidUpdate() {
    this.props.setHeight(formNames.DEVICE);
  }

  componentWillUnmount() {
    this.props.clearElement(formNames.DEVICE);
  }

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
      statusAuth[statusNames.SIGN_OUT_DEVICES].status === requestStatusTypes.LOADING ||
      statusAuth[statusNames.SIGN_OUT_DEVICES].status === requestStatusTypes.SUCCESS
    ) {
      const widthString = `${width}px`;

      return (
        <FlexColumn width={widthString} height="100%">
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      );
    }
    return (
      <FormDevice
        heightRef={heightRef}
        width={width}
        mediaWidth={mediaWidth}
        formHeightBuffer={formHeightBuffer}
        inputHeightBuffer={inputHeightBuffer}
        currentFormBool={currentForm === formNames.DEVICE}
        inputs={inputs}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

FormContainerDevice.propTypes = {
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
};

const mapStateToProps = (state, ownProps) => ({
  heightRef: ownProps.heightRef,
  width: state.ui.external.utilities.forms.width,
  mediaWidth: state.ui.external.utilities.forms.mediaWidth,
  formHeightBuffer: state.ui.external.utilities.forms.heightBuffer,
  inputHeightBuffer: state.ui.external.utilities.forms.inputs.heightBuffer,
  statusAuth: state.data.auth.status,
  currentForm: state.ui.external.forms.current,
  inputs: state.ui.external.forms[formNames.DEVICE].inputs,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
});

export default connect(mapStateToProps)(FormContainerDevice);
