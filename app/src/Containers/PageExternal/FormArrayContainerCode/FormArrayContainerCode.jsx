import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

import { motionStatusTypes } from '../../../Constants/uiConstantsApp';
import { formNames } from '../../../Constants/uiConstantsExternal';

import FlexRow from '../../../Components/Flex/FlexRow';
import FormContainerCodeMFAPhone from './Forms/FormContainerCodeMFAPhone';
import FormContainerCodeVerifyEmail from './Forms/FormContainerCodeVerifyEmail';
import FormContainerDevice from './Forms/FormContainerDevice';

class FormArrayCode extends React.Component {
  constructor(props) {
    super(props);

    this.motionStatus = motionStatusTypes.IDLE;
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.forms.current !== nextProps.forms.current
      && this.motionStatus === motionStatusTypes.IDLE
    ) {
      this.motionStatus = motionStatusTypes.ACTIVE;
    }
  }

  onRest = () => {
    if (this.motionStatus === motionStatusTypes.ACTIVE) {
      this.motionStatus = motionStatusTypes.IDLE;
    }
  };

  renderForm = (formName) => {
    const { heightRef, setHeight, clearElement } = this.props;
    let form = null;

    switch (formName) {
      case formNames.CODE_MFA_PHONE:
        form = (
          <FormContainerCodeMFAPhone
            heightRef={heightRef}
            setHeight={setHeight}
            clearElement={clearElement}
          />
        );
        break;
      case formNames.CODE_VERIFY_EMAIL:
        form = (
          <FormContainerCodeVerifyEmail
            heightRef={heightRef}
            setHeight={setHeight}
            clearElement={clearElement}
          />
        );
        break;
      case formNames.DEVICE:
        form = (
          <FormContainerDevice
            heightRef={heightRef}
            setHeight={setHeight}
            clearElement={clearElement}
          />
        );
        break;
      default:
        break;
    }

    return style => (
      <FlexRow style={style} position="absolute" top="0px" height="100%">
        {form}
      </FlexRow>
    );
  };

  render() {
    const {
      width, widthBuffer, forms, springSettings,
    } = this.props;
    const currentIndex = forms.list.indexOf(forms.current);

    return forms.list.map((form, index) => {
      const multiple = index - currentIndex;
      const left = multiple * (width * 1.5) + widthBuffer / 2;

      return (
        <Motion
          key={`motion_${form}`}
          style={{ left: spring(left, springSettings) }}
          onRest={this.onRest}
        >
          {this.renderForm(form)}
        </Motion>
      );
    });
  }
}

FormArrayCode.propTypes = {
  heightRef: PropTypes.func.isRequired,
  springSettings: PropTypes.shape({ stiffness: PropTypes.number, damping: PropTypes.number })
    .isRequired,
  width: PropTypes.number.isRequired,
  widthBuffer: PropTypes.number.isRequired,
  forms: PropTypes.object.isRequired,
  setHeight: PropTypes.func.isRequired,
  clearElement: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  history: ownProps.history,
  heightRef: ownProps.heightRef,
  springSettings: state.ui.external.utilities.forms.springSettings,
  width: state.ui.external.utilities.forms.width,
  widthBuffer: state.ui.external.utilities.forms.widthBuffer,
  statusAuth: state.data.auth.status,
  forms: state.ui.external.forms,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
});

export default withRouter(connect(mapStateToProps)(FormArrayCode));
