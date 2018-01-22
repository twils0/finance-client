import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

import theme from '../../../themes';

import { buttonNames, formNames, buttonTexts } from '../../../Constants/uiConstantsAccount';
import { setButtonText, setButtonVisible } from '../../../Actions/uiActionsAccount';

import BlockDiv from '../../../Components/Block/BlockDiv';
import FlexRow from '../../../Components/Flex/FlexRow';
import ButtonContainerFirst from './Buttons/ButtonContainerFirst';
import ButtonContainerSecond from './Buttons/ButtonContainerSecond';

class ButtonArrayContainerAccount extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.currentForm !== nextProps.currentForm) {
      this.setButtonText(nextProps.currentForm);
    }
  }

  setButtonText = (currentForm) => {
    const { firstButtonText } = this.props;

    switch (currentForm) {
      case formNames.CODE:
        if (firstButtonText !== buttonTexts.SUBMIT) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.SUBMIT });
        }
        if (this.props.secondButtonText !== buttonTexts.RESEND) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.RESEND });
        }
        if (!this.props.secondButtonVisible) {
          this.props.handleButtonVisible({ id: buttonNames.SECOND, visible: true });
        }
        break;
      case formNames.PROFILE:
        if (firstButtonText !== buttonTexts.EDIT) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.EDIT });
        }
        if (this.props.secondButtonText !== buttonTexts.CANCEL) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.CANCEL });
        }
        if (this.props.secondButtonVisible) {
          this.props.handleButtonVisible({ id: buttonNames.SECOND, visible: false });
        }
        break;
      case formNames.BILLING: {
        if (firstButtonText !== buttonTexts.EDIT) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.EDIT });
        }
        if (this.props.secondButtonText !== buttonTexts.CANCEL) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.CANCEL });
        }
        if (this.props.secondButtonVisible) {
          this.props.handleButtonVisible({ id: buttonNames.SECOND, visible: false });
        }
        break;
      }
      case formNames.CHANGE_PASSWORD: {
        if (firstButtonText !== buttonTexts.SUBMIT) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.SUBMIT });
        }
        if (this.props.secondButtonText !== buttonTexts.CANCEL) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.CANCEL });
        }
        if (!this.props.secondButtonVisible) {
          this.props.handleButtonVisible({ id: buttonNames.SECOND, visible: true });
        }
        break;
      }
      case formNames.DELETE_ACCOUNT: {
        if (firstButtonText !== buttonTexts.DELETE) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.DELETE });
        }
        if (this.props.secondButtonText !== buttonTexts.CANCEL) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.CANCEL });
        }
        if (this.props.secondButtonVisible) {
          this.props.handleButtonVisible({ id: buttonNames.SECOND, visible: false });
        }
        break;
      }
      default:
        break;
    }
  };

  renderSecondButton = (style) => {
    const { width } = this.props;
    const widthString = `${width}px`;

    return (
      <FlexRow style={{ zIndex: 0, ...style }} position="absolute" width={widthString}>
        <ButtonContainerSecond resetStripeElement={this.props.resetStripeElement} />
      </FlexRow>
    );
  };

  render() {
    const {
      springSettings,
      width,
      widthBuffer,
      heightBuffer,
      secondButtonVisible,
      resetStripeElement,
      stripeElement,
    } = this.props;

    const widthString = `${width}px`;
    const heightString = `calc(1em + ${theme.lineHeight.default} + ${heightBuffer / 2}px)`; // unideal workaround for mobile browsers
    const rightSecond = secondButtonVisible ? width + widthBuffer : 0;
    const opacitySecond = secondButtonVisible ? 1 : 0;

    return (
      <BlockDiv alignSelf="flex-end" width={widthString} height={heightString}>
        <FlexRow style={{ zIndex: 1 }} position="absolute" width={widthString}>
          <ButtonContainerFirst
            resetStripeElement={resetStripeElement}
            stripeElement={stripeElement}
          />
        </FlexRow>
        <Motion
          key={`motion_${buttonNames.SECOND}`}
          style={{
            right: spring(rightSecond, springSettings),
            opacity: spring(opacitySecond, springSettings),
          }}
          onRest={this.onRest}
        >
          {this.renderSecondButton}
        </Motion>
      </BlockDiv>
    );
  }
}

ButtonArrayContainerAccount.propTypes = {
  springSettings: PropTypes.shape({ stiffness: PropTypes.number, damping: PropTypes.number })
    .isRequired,
  width: PropTypes.number.isRequired,
  widthBuffer: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  currentForm: PropTypes.string.isRequired,
  firstButtonText: PropTypes.string.isRequired,
  secondButtonText: PropTypes.string.isRequired,
  secondButtonVisible: PropTypes.bool.isRequired,
  resetStripeElement: PropTypes.func.isRequired,
  stripeElement: PropTypes.object,
  handleButtonText: PropTypes.func.isRequired,
  handleButtonVisible: PropTypes.func.isRequired,
};

ButtonArrayContainerAccount.defaultProps = {
  stripeElement: {},
};

const mapStateToProps = (state, ownProps) => ({
  springSettings: state.ui.internal.account.utilities.buttons.springSettings,
  width: state.ui.internal.account.utilities.buttons.width,
  widthBuffer: state.ui.internal.account.utilities.buttons.widthBuffer,
  heightBuffer: state.ui.internal.account.utilities.buttons.heightBuffer,
  currentForm: state.ui.internal.account.forms.current,
  firstButtonText: state.ui.internal.account.buttons[buttonNames.FIRST].text,
  secondButtonText: state.ui.internal.account.buttons[buttonNames.SECOND].text,
  secondButtonVisible: state.ui.internal.account.buttons[buttonNames.SECOND].visible,
  resetStripeElement: ownProps.resetStripeElement,
  stripeElement: ownProps.stripeElement,
});

const mapDispatchToProps = dispatch => ({
  handleButtonText: payload => dispatch(setButtonText(payload)),
  handleButtonVisible: payload => dispatch(setButtonVisible(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonArrayContainerAccount);
