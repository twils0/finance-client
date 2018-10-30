import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import { BeatLoader } from 'halogenium';

import theme from '../../themes';

import { pathNames, requestStatusTypes } from '../../Constants/universalConstants';
import { motionStatusTypes, imageNames, errorMessages } from '../../Constants/uiConstantsApp';
import {
  formNames,
  inputNames,
  buttonNames,
  buttonTexts,
} from '../../Constants/uiConstantsExternal';
import requestVerifyEmailLink from '../../Actions/dataThunkAuth/requestVerifyEmailLink';
import { setStripeElementLoaded } from '../../Actions/uiActionsApp';
import loadImage from '../../Actions/uiThunkApp/loadImage';
import {
  setFormHeight,
  setCurrentForm,
  setInputValueError,
  setButtonText,
} from '../../Actions/uiActionsExternal';

import FormArrayContainerLogin from './FormArrayContainerLogin/FormArrayContainerLogin';
import FormArrayContainerSignUp from './FormArrayContainerSignUp/FormArrayContainerSignUp';
import FormArrayContainerCode from './FormArrayContainerCode/FormArrayContainerCode';
import FlexRow from '../../Components/Flex/FlexRow';
import FlexColumn from '../../Components/Flex/FlexColumn';
import Img from '../../Components/Img';
import ButtonContainerFirst from './Buttons/ButtonContainerFirst';
import ButtonContainerSecond from './Buttons/ButtonContainerSecond';

class ContainerExternal extends React.Component {
  constructor(props) {
    super(props);

    const {
      authenticated, match, forms, exampleHeader,
    } = this.props;
    const { path, params } = match;
    const { current } = forms;
    const { verificationId } = params;

    this.motionStatus = motionStatusTypes.IDLE;
    this.elements = {
      stripe: null,
      [formNames.RESET_PASSWORD]: null,
      [formNames.FORGOT_PASSWORD]: null,
      [formNames.LOGIN]: null,
      [formNames.CARD]: null,
      [formNames.INFO]: null,
      [formNames.SIGN_UP]: null,
      [formNames.CODE_MFA_PHONE]: null,
      [formNames.CODE_VERIFY_PHONE]: null,
      [formNames.CODE_VERIFY_EMAIL]: null,
      [formNames.DEVICE]: null,
    };

    if (
      !authenticated
      && path !== pathNames.LOGIN
      && path !== pathNames.SIGN_UP
      && path !== pathNames.CODE
      && path !== pathNames.CODE_VERIFY_EMAIL
      && path !== pathNames.TERMS
    ) {
      this.props.history.replace(pathNames.LOGIN);
    }

    if (exampleHeader.status === requestStatusTypes.IDLE) {
      this.props.handleImage({ id: imageNames.EXAMPLE_HEADER });
    }

    this.setCurrentForm(path, current, verificationId);
    this.setButtons(path, current);
  }

  componentWillReceiveProps(nextProps) {
    const { match, forms } = nextProps;
    const { path, params } = match;
    const { current } = forms;
    const { verificationId } = params;

    this.setCurrentForm(path, current, verificationId);
    this.setButtons(path, current);
  }

  onRest = () => {
    if (this.motionStatus === motionStatusTypes.ACTIVE) {
      this.motionStatus = motionStatusTypes.IDLE;
    }
  };

  setCurrentForm = (path, currentForm, verificationId) => {
    if (
      path === pathNames.LOGIN
      && currentForm !== formNames.RESET_PASSWORD
      && currentForm !== formNames.FORGOT_PASSWORD
      && currentForm !== formNames.LOGIN
    ) {
      this.props.handleCurrentForm({ current: formNames.LOGIN });
    }
    if (
      path === pathNames.SIGN_UP
      && currentForm !== formNames.CARD
      && currentForm !== formNames.INFO
      && currentForm !== formNames.SIGN_UP
    ) {
      this.props.handleCurrentForm({ current: formNames.CARD });
    }
    if (
      (path === pathNames.CODE || path === pathNames.CODE_VERIFY_EMAIL)
      && currentForm !== formNames.CODE_MFA_PHONE
      && currentForm !== formNames.CODE_VERIFY_PHONE
      && currentForm !== formNames.CODE_VERIFY_EMAIL
      && currentForm !== formNames.DEVICE
    ) {
      if (!verificationId || (verificationId && verificationId === ':verificationId')) {
        this.props.handleCurrentForm({ current: formNames.CODE_MFA_PHONE });
      } else {
        const { handleVerifyEmailLink, handleCurrentForm } = this.props;

        handleCurrentForm({ current: formNames.CODE_VERIFY_EMAIL });
        handleVerifyEmailLink({ verificationId });
      }
    }
  };

  setButtons = (path, currentForm) => {
    const { buttons } = this.props;

    if (path === pathNames.LOGIN) {
      if (currentForm === formNames.RESET_PASSWORD) {
        if (buttons[buttonNames.FIRST].text !== buttonTexts.RESET) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.RESET });
        }
        if (buttons[buttonNames.SECOND].text !== buttonTexts.CANCEL) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.CANCEL });
        }
      } else if (currentForm === formNames.FORGOT_PASSWORD) {
        if (buttons[buttonNames.FIRST].text !== buttonTexts.SEND_CODE) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.SEND_CODE });
        }
        if (buttons[buttonNames.SECOND].text !== buttonTexts.LOG_IN) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.LOG_IN });
        }
      } else {
        if (buttons[buttonNames.FIRST].text !== buttonTexts.LOG_IN) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.LOG_IN });
        }
        if (buttons[buttonNames.SECOND].text !== buttonTexts.SIGN_UP) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.SIGN_UP });
        }
      }
    }

    if (path === pathNames.SIGN_UP) {
      if (currentForm === formNames.INFO) {
        if (buttons[buttonNames.FIRST].text !== buttonTexts.NEXT) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.NEXT });
        }
        if (buttons[buttonNames.SECOND].text !== buttonTexts.PREVIOUS) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.PREVIOUS });
        }
      } else if (currentForm === formNames.SIGN_UP) {
        if (buttons[buttonNames.FIRST].text !== buttonTexts.SIGN_UP) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.SIGN_UP });
        }
        if (buttons[buttonNames.SECOND].text !== buttonTexts.PREVIOUS) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.PREVIOUS });
        }
      } else {
        if (buttons[buttonNames.FIRST].text !== buttonTexts.NEXT) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.NEXT });
        }
        if (buttons[buttonNames.SECOND].text !== buttonTexts.LOG_IN) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.LOG_IN });
        }
      }
    }

    if (path === pathNames.CODE || path === pathNames.CODE_VERIFY_EMAIL) {
      if (currentForm === formNames.CODE_VERIFY_PHONE || currentForm === formNames.CODE_MFA_PHONE) {
        if (buttons[buttonNames.FIRST].text !== buttonTexts.SUBMIT) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.SUBMIT });
        }
        if (buttons[buttonNames.SECOND].text !== buttonTexts.CANCEL) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.CANCEL });
        }
      } else if (currentForm === formNames.CODE_VERIFY_EMAIL) {
        if (buttons[buttonNames.FIRST].text !== buttonTexts.CONTINUE) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.CONTINUE });
        }
        if (buttons[buttonNames.SECOND].text !== buttonTexts.CANCEL) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.CANCEL });
        }
      } else if (currentForm === formNames.DEVICE) {
        if (buttons[buttonNames.FIRST].text !== buttonTexts.YES) {
          this.props.handleButtonText({ id: buttonNames.FIRST, text: buttonTexts.YES });
        }
        if (buttons[buttonNames.SECOND].text !== buttonTexts.NO) {
          this.props.handleButtonText({ id: buttonNames.SECOND, text: buttonTexts.NO });
        }
      }
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

  handleStripeChange = (stripeEvent) => {
    const cardStripe = this.props.forms[formNames.CARD].inputs[inputNames[formNames.CARD].STRIPE];
    const { error } = stripeEvent;

    if (error) {
      switch (error.code) {
        case 'invalid_number':
          cardStripe.value = errorMessages.INVALID_CARD_NUMBER;
          break;
        case 'incomplete_number':
          cardStripe.value = errorMessages.INCOMPLETE_CARD_NUMBER;
          break;
        case 'invalid_expiry_year_past':
          cardStripe.value = errorMessages.INVALID_CARD_EXPIRATION_DATE;
          break;
        case 'incomplete_expiry':
          cardStripe.value = errorMessages.INVALID_CARD_EXPIRATION_DATE;
          break;
        case 'incomplete_cvc':
          cardStripe.value = errorMessages.INVALID_CARD_CVC;
          break;
        case 'incomplete_zip':
          cardStripe.value = errorMessages.INVALID_CARD_ZIP_CODE;
          break;
        default:
          cardStripe.value = stripeEvent.error.message;
          break;
      }

      cardStripe.errorMessage = cardStripe.value;
    } else if (stripeEvent.empty) {
      cardStripe.value = errorMessages.NO_STRIPE;
    } else if (cardStripe.errorMessage) {
      cardStripe.value = '';
      cardStripe.errorMessage = '';
    } else if (stripeEvent.complete) {
      cardStripe.value = 'complete';
    }

    this.props.handleInputValueError(cardStripe);
  };

  handleStripeLoaded = (loaded) => {
    this.props.handleStripeElementLoaded({
      id: inputNames[formNames.CARD].STRIPE,
      loaded,
    });
  };

  handleStripeClear = () => {
    if (this.elements.stripe) {
      this.elements.stripe.clear();
    }
  };

  resetStripeElement = () => {
    if (this.elements.stripe) {
      this.elements.stripe = null;
      this.handleStripeLoaded(false);
    }
  };

  stripeRef = (element) => {
    if (element && !this.elements.stripe) {
      this.elements.stripe = element;
      element.on('change', this.handleStripeChange);
      this.handleStripeLoaded(true);
    }
  };

  clearElement = (elementId) => {
    if (elementId && this.elements[elementId]) {
      this.elements[elementId] = null;
    }
  };

  renderFormArrayContainerLogin = () => (
    <FormArrayContainerLogin
      heightRef={this.heightRef}
      setHeight={this.setHeight}
      clearElement={this.clearElement}
    />
  );

  renderFormArrayContainerSignUp = () => (
    <FormArrayContainerSignUp
      stripeRef={this.stripeRef}
      heightRef={this.heightRef}
      setHeight={this.setHeight}
      clearElement={this.clearElement}
      handleStripeClear={this.handleStripeClear}
      resetStripeElement={this.resetStripeElement}
    />
  );

  renderFormContainerCode = () => (
    <FormArrayContainerCode
      heightRef={this.heightRef}
      setHeight={this.setHeight}
      clearElement={this.clearElement}
    />
  );

  renderForms = (style) => {
    const { width, widthBuffer } = this.props;
    const widthString = `${width + widthBuffer}px`;

    return (
      <FlexRow
        style={style}
        position="relative"
        overflowX="hidden"
        overflowY="hidden"
        width={widthString}
      >
        <Route path={pathNames.LOGIN} render={this.renderFormArrayContainerLogin} />
        <Route path={pathNames.SIGN_UP} render={this.renderFormArrayContainerSignUp} />
        <Route path={pathNames.CODE_VERIFY_EMAIL} render={this.renderFormContainerCode} />
      </FlexRow>
    );
  };

  renderFormsMotion = () => {
    const { forms } = this.props;
    const { height } = forms[forms.current];

    return (
      <Motion
        defaultStyle={{ height }}
        style={{ height: spring(height, this.props.springSettings) }}
        onRest={this.onRest}
      >
        {this.renderForms}
      </Motion>
    );
  };

  render() {
    const { width, statusFonts, exampleHeader } = this.props;
    const widthString = `${width}px`;

    if (
      statusFonts !== requestStatusTypes.SUCCESS
      || exampleHeader.status !== requestStatusTypes.SUCCESS
    ) {
      return (
        <FlexColumn width="100%" height="100%">
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      );
    }
    return (
      <FlexColumn
        flex="0 0 auto"
        flexWrap="nowrap"
        alignItems="center"
        justifyContent="center"
        alignSelf="center"
        padding="20px 0"
        height="100%"
        minHeight="100vh"
      >
        <Img margin="0 0 0 -15px" src={exampleHeader.src} alt="exampleHeader" width={widthString} />
        {this.renderFormsMotion()}
        <ButtonContainerFirst
          stripeElement={this.elements.stripe}
          resetStripeElement={this.resetStripeElement}
        />
        <ButtonContainerSecond resetStripeElement={this.resetStripeElement} />
      </FlexColumn>
    );
  }
}

ContainerExternal.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  springSettings: PropTypes.shape({ stiffness: PropTypes.number, damping: PropTypes.number })
    .isRequired,
  width: PropTypes.number.isRequired,
  widthBuffer: PropTypes.number.isRequired,
  statusFonts: PropTypes.string.isRequired,
  exampleHeader: PropTypes.object.isRequired,
  buttons: PropTypes.object.isRequired,
  forms: PropTypes.object.isRequired,
  handleCurrentForm: PropTypes.func.isRequired,
  handleVerifyEmailLink: PropTypes.func.isRequired,
  handleFormHeight: PropTypes.func.isRequired,
  handleStripeElementLoaded: PropTypes.func.isRequired,
  handleButtonText: PropTypes.func.isRequired,
  handleInputValueError: PropTypes.func.isRequired,
  handleImage: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  match: ownProps.match,
  history: ownProps.history,
  authenticated: state.data.auth.authenticated,
  stripe: state.ui.app.stripe,
  springSettings: state.ui.external.utilities.forms.springSettings,
  width: state.ui.external.utilities.forms.width,
  widthBuffer: state.ui.external.utilities.forms.widthBuffer,
  mediaWidth: state.ui.external.utilities.forms.mediaWidth,
  statusFonts: state.ui.app.fonts.status,
  exampleHeader: state.ui.app.images.exampleHeader,
  buttons: state.ui.external.buttons,
  forms: state.ui.external.forms,
});

const mapDispatchToProps = dispatch => ({
  handleCurrentForm: payload => dispatch(setCurrentForm(payload)),
  handleVerifyEmailLink: payload => dispatch(requestVerifyEmailLink(payload)),
  handleFormHeight: payload => dispatch(setFormHeight(payload)),
  handleStripeElementLoaded: payload => dispatch(setStripeElementLoaded(payload)),
  handleButtonText: payload => dispatch(setButtonText(payload)),
  handleInputValueError: payload => dispatch(setInputValueError(payload)),
  handleImage: id => dispatch(loadImage(id)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ContainerExternal),
);
