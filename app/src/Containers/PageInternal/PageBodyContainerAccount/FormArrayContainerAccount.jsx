import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

import FlexRow from '../../../Components/Flex/FlexRow';
import FormsSwitch from '../../../Components/PageInternal/PageBodyAccount/FormsSwitch';

class FormArrayContainerAccount extends React.Component {
  renderForm = (form) => {
    const {
      stripeRef, heightRef, setHeight, clearElement, resetStripeElement,
    } = this.props;

    return style => (
      <FlexRow style={style} position="absolute" left="0px" width="100%">
        <FormsSwitch
          stripeRef={stripeRef}
          heightRef={heightRef}
          setHeight={setHeight}
          clearElement={clearElement}
          resetStripeElement={resetStripeElement}
          form={form}
        />
      </FlexRow>
    );
  };

  render() {
    const {
      forms, formArrayFormsHeight, formsHeightBuffer, springSettings,
    } = this.props;
    const currentIndex = forms.list.indexOf(forms.current);

    return forms.list.map((form, index) => {
      const multiple = index - currentIndex;
      const top = multiple * formArrayFormsHeight + (multiple + 1) * (formsHeightBuffer / 2);

      return (
        <Motion
          key={`motion_${form}`}
          style={{ top: spring(top, springSettings) }}
          onRest={this.onRest}
        >
          {this.renderForm(form)}
        </Motion>
      );
    });
  }
}

FormArrayContainerAccount.propTypes = {
  stripeRef: PropTypes.func.isRequired,
  heightRef: PropTypes.func.isRequired,
  formArrayFormsHeight: PropTypes.number.isRequired,
  formsHeightBuffer: PropTypes.number.isRequired,
  springSettings: PropTypes.shape({ stiffness: PropTypes.number, damping: PropTypes.number })
    .isRequired,
  forms: PropTypes.object.isRequired,
  setHeight: PropTypes.func.isRequired,
  clearElement: PropTypes.func.isRequired,
  resetStripeElement: PropTypes.func.isRequired,
};

FormArrayContainerAccount.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  stripeRef: ownProps.stripeRef,
  heightRef: ownProps.heightRef,
  formArrayFormsHeight: state.ui.internal.account.utilities.forms.formArrayFormsHeight,
  formsHeightBuffer: state.ui.internal.account.utilities.forms.formsHeightBuffer,
  springSettings: state.ui.internal.account.utilities.forms.springSettings,
  forms: state.ui.internal.account.forms,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
  resetStripeElement: ownProps.resetStripeElement,
});

export default connect(mapStateToProps)(FormArrayContainerAccount);
