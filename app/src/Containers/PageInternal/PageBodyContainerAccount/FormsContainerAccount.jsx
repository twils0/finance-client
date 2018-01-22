import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

import { motionStatusTypes } from '../../../Constants/uiConstantsApp';
import { formNames } from '../../../Constants/uiConstantsAccount';
import { setFormHeight } from '../../../Actions/uiActionsAccount';

import FlexRow from '../../../Components/Flex/FlexRow';
import FlexColumn from '../../../Components/Flex/FlexColumn';
import FormsSwitch from '../../../Components/PageInternal/PageBodyAccount/FormsSwitch';
import FormArrayContainerAccount from './FormArrayContainerAccount';
import ButtonArrayContainerAccount from './ButtonArrayContainerAccount';

class FormsContainerAccount extends React.Component {
  constructor(props) {
    super(props);

    this.motionStatus = motionStatusTypes.IDLE;

    this.elements = {
      [formNames.CODE]: null,
      [formNames.PROFILE]: null,
      [formNames.BILLING]: null,
      [formNames.CHANGE_PASSWORD]: null,
      [formNames.DELETE_ACCOUNT]: null,
    };
  }

  onRest = () => {
    if (this.motionStatus === motionStatusTypes.ACTIVE) {
      this.motionStatus = motionStatusTypes.IDLE;
    }
  };

  setHeight = (form) => {
    if (form) {
      const { forms } = this.props;
      const formElement = this.elements[form];

      if (formElement && forms[form]) {
        const height = formElement.offsetHeight;

        if (height !== forms[form].height && height > 0) {
          if (form === forms.current && this.motionStatus === motionStatusTypes.IDLE) {
            this.motionStatus = motionStatusTypes.ACTIVE;
          }

          this.props.handleFormHeight({ id: form, height });
        }
      }
    }
  };

  heightRef = (element) => {
    if (element && element.id && !this.elements[element.id]) {
      this.elements[element.id] = element;
    }
  };

  clearElement = (elementId) => {
    if (elementId && this.elements[elementId]) {
      this.elements[elementId] = null;
    }
  };

  renderFormArray = (style) => {
    const { mediaWidth } = this.props;

    return (
      <FlexRow style={style} position="relative" overflowX="hidden" overflowY="hidden" width="100%">
        {window.innerWidth < mediaWidth ? (
          <FormsSwitch
            stripeRef={this.props.stripeRef}
            heightRef={this.heightRef}
            setHeight={this.setHeight}
            clearElement={this.clearElement}
            resetStripeElement={this.props.resetStripeElement}
            form={this.props.forms.current}
          />
        ) : (
          <FormArrayContainerAccount
            stripeRef={this.props.stripeRef}
            heightRef={this.heightRef}
            setHeight={this.setHeight}
            clearElement={this.clearElement}
            resetStripeElement={this.props.resetStripeElement}
          />
        )}
      </FlexRow>
    );
  };

  renderFormArrayMotion = () => {
    const { forms, formsHeightBuffer, springSettings } = this.props;
    let { height } = forms[forms.current];
    height += formsHeightBuffer;

    return (
      <Motion style={{ height: spring(height, springSettings) }} onRest={this.onRest}>
        {this.renderFormArray}
      </Motion>
    );
  };

  render() {
    const {
      width, widthBuffer, mediaWidth, resetStripeElement, stripeElement,
    } = this.props;
    const widthString = `${width + widthBuffer}px`;
    const widthBufferHalfString = `${widthBuffer / 2}px`;
    const mediaWidthString = `${mediaWidth}px`;

    return (
      <FlexColumn
        alignItems="flex-end"
        justifyContent="center"
        overflowY="visible"
        width={widthString}
        mediaWidth={mediaWidthString}
        padding={`0 ${widthBufferHalfString}
        0 ${widthBufferHalfString}
        `}
      >
        {this.renderFormArrayMotion()}
        <ButtonArrayContainerAccount
          resetStripeElement={resetStripeElement}
          stripeElement={stripeElement}
        />
      </FlexColumn>
    );
  }
}

FormsContainerAccount.propTypes = {
  stripeRef: PropTypes.func.isRequired,
  springSettings: PropTypes.shape({ stiffness: PropTypes.number, damping: PropTypes.number })
    .isRequired,
  width: PropTypes.number.isRequired,
  widthBuffer: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  formsHeightBuffer: PropTypes.number.isRequired,
  forms: PropTypes.object.isRequired,
  stripeElement: PropTypes.object,
  handleFormHeight: PropTypes.func.isRequired,
  resetStripeElement: PropTypes.func.isRequired,
};

FormsContainerAccount.defaultProps = {
  stripeElement: {},
};

const mapStateToProps = (state, ownProps) => ({
  stripeRef: ownProps.stripeRef,
  stripe: state.ui.app.stripe,
  springSettings: state.ui.external.utilities.forms.springSettings,
  width: state.ui.internal.account.utilities.forms.width,
  widthBuffer: state.ui.internal.account.utilities.forms.widthBuffer,
  mediaWidth: state.ui.internal.account.utilities.pageBody.mediaWidth,
  formsHeightBuffer: state.ui.internal.account.utilities.forms.formsHeightBuffer,
  forms: state.ui.internal.account.forms,
  stripeElement: ownProps.stripeElement,
  resetStripeElement: ownProps.resetStripeElement,
});

const mapDispatchToProps = dispatch => ({
  handleFormHeight: payload => dispatch(setFormHeight(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormsContainerAccount));
