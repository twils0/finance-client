import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { codeTypeNames } from '../../../../Constants/dataConstantsAuth';
import { fieldNames } from '../../../../Constants/dataConstantsAccount';
import { formNames } from '../../../../Constants/uiConstantsExternal';

import FormCodeVerifyEmail from '../../../../Components/PageExternal/FormArrayCode/Forms/FormCodeVerifyEmail';

class FormContainerCodeVerifyEmail extends React.Component {
  constructor(props) {
    super(props);
    this.props.setHeight(formNames.CODE_VERIFY_EMAIL);
  }

  componentDidMount() {
    this.props.setHeight(formNames.CODE_VERIFY_EMAIL);
  }

  componentDidUpdate() {
    this.props.setHeight(formNames.CODE_VERIFY_EMAIL);
  }

  componentWillUnmount() {
    this.props.clearElement(formNames.CODE_VERIFY_EMAIL);
  }

  render() {
    const {
      heightRef, width, formHeightBuffer, inputHeightBuffer, codeTypes, fields,
    } = this.props;

    const emailNeeded = codeTypes[codeTypeNames.VERIFY_EMAIL].needed;
    const emailAdditionalNeeded = codeTypes[codeTypeNames.VERIFY_EMAIL_ADDITIONAL].needed;
    let email = null;
    let emailAdditional = null;

    if (emailNeeded) {
      email = fields[fieldNames.EMAIL].value;
    }
    if (emailAdditionalNeeded) {
      emailAdditional = fields[fieldNames.EMAIL_ADDITIONAL].value;
    }

    return (
      <FormCodeVerifyEmail
        heightRef={heightRef}
        width={width}
        formHeightBuffer={formHeightBuffer}
        inputHeightBuffer={inputHeightBuffer}
        email={email}
        emailAdditional={emailAdditional}
      />
    );
  }
}

FormContainerCodeVerifyEmail.propTypes = {
  heightRef: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
  codeTypes: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  setHeight: PropTypes.func.isRequired,
  clearElement: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  match: ownProps.match,
  heightRef: ownProps.heightRef,
  width: state.ui.external.utilities.forms.width,
  mediaWidth: state.ui.external.utilities.forms.mediaWidth,
  formHeightBuffer: state.ui.external.utilities.forms.heightBuffer,
  inputHeightBuffer: state.ui.external.utilities.forms.inputs.heightBuffer,
  statusAuth: state.data.auth.status,
  codeTypes: state.data.auth.codeTypes,
  fields: state.data.account.fields,
  setHeight: ownProps.setHeight,
  clearElement: ownProps.clearElement,
});

export default withRouter(connect(mapStateToProps)(FormContainerCodeVerifyEmail));
