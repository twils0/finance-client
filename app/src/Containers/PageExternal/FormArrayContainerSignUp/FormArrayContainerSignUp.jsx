import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

import { motionStatusTypes } from '../../../Constants/uiConstantsApp';
import { formNames } from '../../../Constants/uiConstantsExternal';

import FlexRow from '../../../Components/Flex/FlexRow';
import FormContainerCard from './Forms/FormContainerCard';
import FormContainerInfo from './Forms/FormContainerInfo';
import FormContainerSignUp from './Forms/FormContainerSignUp';

class FormArrayContainerSignUp extends React.Component {
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
      case formNames.CARD: {
        const { stripeRef, handleStripeClear, resetStripeElement } = this.props;

        form = (
          <FormContainerCard
            stripeRef={stripeRef}
            heightRef={heightRef}
            setHeight={setHeight}
            clearElement={clearElement}
            handleStripeClear={handleStripeClear}
            resetStripeElement={resetStripeElement}
          />
        );
        break;
      }
      case formNames.INFO:
        form = (
          <FormContainerInfo
            heightRef={heightRef}
            setHeight={setHeight}
            clearElement={clearElement}
          />
        );
        break;
      case formNames.SIGN_UP:
        form = (
          <FormContainerSignUp
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

FormArrayContainerSignUp.propTypes = {
  stripeRef: PropTypes.func.isRequired,
  heightRef: PropTypes.func.isRequired,
  springSettings: PropTypes.shape({ stiffness: PropTypes.number, damping: PropTypes.number })
    .isRequired,
  width: PropTypes.number,
  widthBuffer: PropTypes.number,
  forms: PropTypes.object.isRequired,
  setHeight: PropTypes.func.isRequired,
  clearElement: PropTypes.func.isRequired,
  handleStripeClear: PropTypes.func.isRequired,
  resetStripeElement: PropTypes.func.isRequired,
};

FormArrayContainerSignUp.defaultProps = {
  width: 300,
  widthBuffer: 60,
};

const mapStateToProps = (state, ownProps) => ({
  stripeRef: ownProps.stripeRef,
  heightRef: ownProps.heightRef,
  springSettings: state.ui.external.utilities.forms.springSettings,
  width: state.ui.external.utilities.forms.width,
  widthBuffer: state.ui.external.utilities.forms.widthBuffer,
  forms: state.ui.external.forms,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
  handleStripeClear: ownProps.handleStripeClear,
  resetStripeElement: ownProps.resetStripeElement,
});

export default connect(mapStateToProps)(FormArrayContainerSignUp);
