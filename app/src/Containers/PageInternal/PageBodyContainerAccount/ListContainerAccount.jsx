import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { formNames, buttonNames } from '../../../Constants/uiConstantsAccount';
import { setCurrentForm } from '../../../Actions/uiActionsAccount';
import handleCancel from '../../../Actions/uiThunkAccount/handleCancel';

import ListAccount from '../../../Components/PageInternal/PageBodyAccount/ListAccount';

class ListContainerAccount extends React.Component {
  handleListButtonClick = (clickEvent) => {
    clickEvent.preventDefault();
    const { handleCancelFormEdit, currentForm, handleCurrentForm } = this.props;

    if (currentForm === formNames.BILLING && clickEvent.target.id !== formNames.BILLING) {
      this.props.resetStripeElement();
    }

    handleCancelFormEdit();

    switch (clickEvent.target.id) {
      case buttonNames.CODE:
        if (currentForm !== formNames.CODE) {
          handleCurrentForm({ current: formNames.CODE });
        }
        break;
      case buttonNames.PROFILE:
        if (currentForm !== formNames.PROFILE) {
          handleCurrentForm({ current: formNames.PROFILE });
        }
        break;
      case buttonNames.BILLING:
        if (currentForm !== formNames.BILLING) {
          handleCurrentForm({ current: formNames.BILLING });
        }
        break;
      case buttonNames.CHANGE_PASSWORD:
        if (currentForm !== formNames.CHANGE_PASSWORD) {
          handleCurrentForm({ current: formNames.CHANGE_PASSWORD });
        }
        break;
      case buttonNames.DELETE_ACCOUNT:
        if (currentForm !== formNames.DELETE_ACCOUNT) {
          handleCurrentForm({ current: formNames.DELETE_ACCOUNT });
        }
        break;
      default:
        break;
    }
  };

  render() {
    const {
      springSettings,
      width,
      widthBuffer,
      rowWidthIndent,
      mediaWidth,
      rowHeight,
      heightBuffer,
      rowHeightBufferBottom,
    } = this.props;

    return (
      <ListAccount
        springSettings={springSettings}
        width={width}
        widthBuffer={widthBuffer}
        rowWidthIndent={rowWidthIndent}
        mediaWidth={mediaWidth}
        rowHeight={rowHeight}
        rowHeightBufferBottom={rowHeightBufferBottom}
        heightBuffer={heightBuffer}
        handleClick={this.handleListButtonClick}
      />
    );
  }
}

ListContainerAccount.propTypes = {
  springSettings: PropTypes.shape({ stiffness: PropTypes.number, damping: PropTypes.number })
    .isRequired,
  width: PropTypes.number.isRequired,
  widthBuffer: PropTypes.number.isRequired,
  rowWidthIndent: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowHeightBufferBottom: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  currentForm: PropTypes.string.isRequired,
  handleCancelFormEdit: PropTypes.func.isRequired,
  handleCurrentForm: PropTypes.func.isRequired,
  resetStripeElement: PropTypes.func.isRequired,
};

ListContainerAccount.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  springSettings: state.ui.internal.account.utilities.list.springSettings,
  width: state.ui.internal.account.utilities.list.width,
  widthBuffer: state.ui.internal.account.utilities.list.widthBuffer,
  rowWidthIndent: state.ui.internal.account.utilities.list.rowWidthIndent,
  mediaWidth: state.ui.internal.account.utilities.pageBody.mediaWidth,
  rowHeight: state.ui.internal.account.utilities.list.rowHeight,
  rowHeightBufferBottom: state.ui.internal.account.utilities.list.rowHeightBufferBottom,
  heightBuffer: state.ui.internal.account.utilities.list.heightBuffer,
  currentForm: state.ui.internal.account.forms.current,
  resetStripeElement: ownProps.resetStripeElement,
});

const mapDispatchToProps = dispatch => ({
  handleCancelFormEdit: () => dispatch(handleCancel()),
  handleCurrentForm: payload => dispatch(setCurrentForm(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListContainerAccount);
