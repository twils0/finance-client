import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames } from '../../Constants/dataConstantsAuth';
import { setAuthStatus } from '../../Actions/dataActionsAuth';

import Page from '../../Components/Page';
import ContainerExternal from './ContainerExternal';

class PageContainerExternal extends React.Component {
  constructor(props) {
    super(props);
    const { statusAuth } = this.props;

    if (statusAuth[statusNames.LOGOUT].status !== requestStatusTypes.IDLE) {
      this.props.handleAuthStatus({ id: statusNames.LOGOUT, status: requestStatusTypes.IDLE });
    }
    if (statusAuth[statusNames.DELETE_ACCOUNT].status !== requestStatusTypes.IDLE) {
      this.props.handleAuthStatus({
        id: statusNames.DELETE_ACCOUNT,
        status: requestStatusTypes.IDLE,
      });
    }
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <Page>
          <ContainerExternal />
        </Page>
      );
    }

    return <Redirect to={this.props.redirectURL} />;
  }
}

PageContainerExternal.propTypes = {
  statusAuth: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  redirectURL: PropTypes.string.isRequired,
  handleAuthStatus: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  match: ownProps.match,
  statusAuth: state.data.auth.status,
  authenticated: state.data.auth.authenticated,
  redirectURL: state.data.auth.redirectURL,
});

const mapDispatchToProps = dispatch => ({
  handleAuthStatus: payload => dispatch(setAuthStatus(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PageContainerExternal);
