import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { BeatLoader } from 'halogenium';

import theme from '../../themes';
import { store } from '../../App';

import { pathNames, requestStatusTypes } from '../../Constants/universalConstants';
import { statusNames as statusNamesAuth } from '../../Constants/dataConstantsAuth';
import { statusNames as statusNamesWatchlist } from '../../Constants/dataConstantsWatchlist';
import { imageNames } from '../../Constants/uiConstantsApp';
import { pageBodyNames } from '../../Constants/uiConstantsInternal';
import { setAuthStatus, setRedirectURL } from '../../Actions/dataActionsAuth';
import setSession from '../../Actions/dataThunkAuth/setSession';
import loadImage from '../../Actions/uiThunkApp/loadImage';
import { setSecuritiesCurrent } from '../../Actions/dataActionsWatchlist';
import loadSecurities from '../../Actions/dataThunkWatchlist/loadSecurities';
import requestUpdateSecurities from '../../Actions/dataThunkWatchlist/requestUpdateSecurities';
import { setCurrentPageBody } from '../../Actions/uiActionsInternal';

import Loading from '../../Components/Loading';
import FlexColumn from '../../Components/Flex/FlexColumn';
import Page from '../../Components/Page';
import TopMenuContainerInternal from './TopMenuContainerInternal/TopMenuContainerInternal';

const loadableState = store.getState();
const { menu } = loadableState.ui.internal.utilities;

const LoadableWatchlist = Loadable({
  loader: () => import('./PageBodyContainerWatchlist/PageBodyContainerWatchlist'),
  loading: () => <Loading menuHeight={menu.height + menu.heightBuffer} />,
  delay: 0,
});

const LoadableAccount = Loadable({
  loader: () => import('./PageBodyContainerAccount/PageBodyContainerAccount'),
  loading: () => <Loading menuHeight={menu.height + menu.heightBuffer} />,
  delay: 0,
});

class PageContainerInternal extends React.Component {
  constructor(props) {
    super(props);

    const {
      handleSession,
      redirectURL,
      handleAuthStatus,
      statusAuth,
      statusexampleHeader,
      statusAWS,
      statusSecurities,
      securities,
      match,
      currentPageBody,
    } = this.props;
    const { path, url, params } = match;
    const { securityId } = params;

    this.initSessionAuth = handleSession();

    if (redirectURL !== url) {
      this.setRedirect(match);
    }

    if (statusAuth[statusNamesAuth.LOGOUT].status !== requestStatusTypes.IDLE) {
      handleAuthStatus({ id: statusNamesAuth.LOGOUT, status: requestStatusTypes.IDLE });
    }
    if (statusAuth[statusNamesAuth.DELETE_ACCOUNT].status !== requestStatusTypes.IDLE) {
      handleAuthStatus({ id: statusNamesAuth.DELETE_ACCOUNT, status: requestStatusTypes.IDLE });
    }

    if (statusexampleHeader === requestStatusTypes.IDLE) {
      this.props.handleImage({ id: imageNames.EXAMPLE_HEADER });
    }

    if (statusAWS === requestStatusTypes.SUCCESS && statusSecurities === requestStatusTypes.IDLE) {
      this.props.handleSecurities();
    }

    this.setCurrentSecurity(path, securityId, securities);

    this.setCurrentPageBody(path, currentPageBody);
  }

  componentDidMount() {
    if (this.initSessionAuth) {
      this.initSessionAuth = false;
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      statusAWS, redirectURL, statusSecurities, match, securities, currentPageBody,
    } = nextProps;
    const { path, url, params } = match;
    const { securityId } = params;

    if (statusAWS === requestStatusTypes.SUCCESS && statusSecurities === requestStatusTypes.IDLE) {
      this.props.handleSecurities();
    }

    if (this.props.match.url !== url && redirectURL !== url) {
      this.setRedirect(match);
    }

    this.setCurrentSecurity(path, securityId, securities);

    this.setCurrentPageBody(path, currentPageBody);
  }

  componentWillUpdate() {
    this.props.handleSession();
  }

  setRedirect = (match) => {
    const { path, url } = match;

    if (
      path === pathNames.WATCHLIST_SECURITY_ID
      || path === pathNames.WATCHLIST
      || path === pathNames.ACCOUNT
    ) {
      this.props.handleRedirectURL({ redirectURL: url });
    }
  };

  setCurrentSecurity = (path, securityId, securities) => {
    if (path === pathNames.WATCHLIST || path === pathNames.WATCHLIST_SECURITY_ID) {
      if (
        securityId
        && securityId !== ':securityId'
        && securities
        && Object.keys(securities).indexOf(securityId) > -1
      ) {
        if (securities && securityId !== securities.current) {
          const { handleSecuritiesCurrent, handleUpdateSecurities } = this.props;

          handleSecuritiesCurrent({ current: securityId });
          handleUpdateSecurities();
        }
      } else if (securities && securities.current) {
        this.props.history.replace(`${pathNames.WATCHLIST}/${securities.current}`);
      }
    }
  };

  setCurrentPageBody = (path, currentPageBody) => {
    if (path === pathNames.WATCHLIST_SECURITY_ID && currentPageBody !== pageBodyNames.WATCHLIST) {
      this.props.handleCurrentPageBody({ current: pageBodyNames.WATCHLIST });
    }
    if (path === pathNames.ACCOUNT && currentPageBody !== pageBodyNames.ACCOUNT) {
      this.props.handleCurrentPageBody({ current: pageBodyNames.ACCOUNT });
    }
  };

  render() {
    const {
      authenticated, statusFonts, statusexampleHeader, statusAWS, statusAuth,
    } = this.props;

    if (!this.initSessionAuth && !authenticated) {
      return <Redirect to={pathNames.LOGIN} />;
    }

    if (
      statusFonts !== requestStatusTypes.SUCCESS
      || statusexampleHeader !== requestStatusTypes.SUCCESS
      || statusAWS === requestStatusTypes.LOADING
      || statusAuth[statusNamesAuth.LOGOUT].status === requestStatusTypes.LOADING
      || statusAuth[statusNamesAuth.LOGOUT].status === requestStatusTypes.SUCCESS
      || statusAuth[statusNamesAuth.DELETE_ACCOUNT].status === requestStatusTypes.LOADING
      || statusAuth[statusNamesAuth.DELETE_ACCOUNT].status === requestStatusTypes.SUCCESS
    ) {
      return (
        <FlexColumn width="100%" height="100%">
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      );
    }

    return (
      <Page id="pageInternal" noBackgroundImage>
        <TopMenuContainerInternal />
        <Route path={pathNames.WATCHLIST_SECURITY_ID} component={LoadableWatchlist} />
        <Route path={pathNames.ACCOUNT} component={LoadableAccount} />
      </Page>
    );
  }
}

PageContainerInternal.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  redirectURL: PropTypes.string.isRequired,
  statusAuth: PropTypes.object.isRequired,
  statusexampleHeader: PropTypes.string.isRequired,
  securities: PropTypes.object.isRequired,
  currentPageBody: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
  statusFonts: PropTypes.string.isRequired,
  statusAWS: PropTypes.string.isRequired,
  statusSecurities: PropTypes.string.isRequired,
  handleSession: PropTypes.func.isRequired,
  handleAuthStatus: PropTypes.func.isRequired,
  handleSecuritiesCurrent: PropTypes.func.isRequired,
  handleUpdateSecurities: PropTypes.func.isRequired,
  handleCurrentPageBody: PropTypes.func.isRequired,
  handleImage: PropTypes.func.isRequired,
  handleSecurities: PropTypes.func.isRequired,
  handleRedirectURL: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  match: ownProps.match,
  history: ownProps.history,
  redirectURL: state.data.auth.redirectURL,
  statusAuth: state.data.auth.status,
  statusexampleHeader: state.ui.app.images.exampleHeader.status,
  securities: state.data.watchlist.securities,
  currentPageBody: state.ui.internal.pageBodies.current,
  authenticated: state.data.auth.authenticated,
  statusFonts: state.ui.app.fonts.status,
  statusAWS: state.data.aws.status,
  statusSecurities: state.data.watchlist.status[statusNamesWatchlist.SECURITIES].status,
});

const mapDispatchToProps = dispatch => ({
  handleSession: () => dispatch(setSession()),
  handleAuthStatus: payload => dispatch(setAuthStatus(payload)),
  handleSecuritiesCurrent: payload => dispatch(setSecuritiesCurrent(payload)),
  handleUpdateSecurities: payload => dispatch(requestUpdateSecurities(payload)),
  handleCurrentPageBody: payload => dispatch(setCurrentPageBody(payload)),
  handleImage: id => dispatch(loadImage(id)),
  handleSecurities: () => dispatch(loadSecurities()),
  handleRedirectURL: payload => dispatch(setRedirectURL(payload)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PageContainerInternal),
);
