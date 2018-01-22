import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { pathNames, requestStatusTypes } from '../../../Constants/universalConstants';
import { buttonNames, pageBodyNames } from '../../../Constants/uiConstantsInternal';
import { statusNames } from '../../../Constants/dataConstantsWatchlist';
import requestLogout from '../../../Actions/dataThunkAuth/requestLogout';

import TopMenu from '../../../Components/TopMenu';
import FlexRow from '../../../Components/Flex/FlexRow';
import Img from '../../../Components/Img';
import SearchBar from './SearchBarContainer';
import Header2 from '../../../Components/Header2';
import ButtonWatchlist from '../../../Components/PageInternal/TopMenu/Buttons/ButtonWatchlist';
import ButtonAccount from '../../../Components/PageInternal/TopMenu/Buttons/ButtonAccount';
import ButtonLogout from '../../../Components/PageInternal/TopMenu/Buttons/ButtonLogout';

class TopMenuContainerInternal extends React.Component {
  handleMenuButtonClick = (clickEvent) => {
    clickEvent.preventDefault();
    const { currentPageBody } = this.props;

    switch (clickEvent.target.id) {
      case buttonNames.WATCHLIST:
        if (currentPageBody !== pageBodyNames.WATCHLIST) {
          this.props.history.push(pathNames.WATCHLIST);
        }
        break;
      case buttonNames.ACCOUNT:
        if (currentPageBody !== pageBodyNames.ACCOUNT) {
          this.props.history.push(pathNames.ACCOUNT);
        }
        break;
      case buttonNames.LOGOUT:
        this.props.handleLogout();
        break;
      default:
        break;
    }
  };

  render() {
    const {
      menuWidthBuffer,
      menuSecurityWidthBuffer,
      mediaWidth,
      menuHeight,
      menuHeightBuffer,
      menuImgWidth,
      menuSecurityHeightBuffer,
      searchBarWidth,
      searchBarHeight,
      srcexampleHeader,
      currentSecurity,
      statusWatchlistSecurities,
    } = this.props;
    const menuWidthBufferString = `${menuWidthBuffer}px`;
    const menuWidthBufferHalfString = `${menuWidthBuffer / 2}px`;
    const menuSecurityWidthBufferString = `${menuSecurityWidthBuffer}px`;
    const mediaWidthString = `${mediaWidth}px`;
    const menuHeightString = `${menuHeight}px`;
    const menuHeightBufferHalfString = `${menuHeightBuffer / 2}px`;
    const menuImgWidthString = `${menuImgWidth}px`;
    const menuSecurityHeightBufferHalfString = `${menuSecurityHeightBuffer / 2}px`;
    const searchBarHeightString = `${searchBarHeight}px`;
    const searchBarWidthString = `${searchBarWidth}px`;

    const hideMessage = currentSecurity
      || statusWatchlistSecurities === requestStatusTypes.IDLE
      || statusWatchlistSecurities === requestStatusTypes.LOADING
      || statusWatchlistSecurities === requestStatusTypes.ERROR;

    return (
      <TopMenu
        width={`calc(100% - ${menuWidthBufferString})`}
        height={menuHeightString}
        mediaWidth={mediaWidthString}
        alignItems="center"
        justifyContent="center"
        padding={`${menuHeightBufferHalfString} ${menuWidthBufferHalfString}`}
      >
        <FlexRow
          flex="0 0 auto"
          justifyContent="flex-start"
          margin={`${menuSecurityHeightBufferHalfString} ${menuSecurityWidthBufferString}`}
          width={menuImgWidthString}
        >
          <Img src={srcexampleHeader} alt="exampleHeader" width={menuImgWidthString} />
        </FlexRow>
        <FlexRow
          position="none"
          flex={hideMessage ? '1 1 auto' : '0 0 auto'}
          alignItems="flex-start"
          justifyContent="flex-start"
          margin={`${menuSecurityHeightBufferHalfString} ${menuSecurityWidthBufferString}`}
          minWidth={searchBarWidthString}
          mediaWidth={mediaWidthString}
          responsiveWidth="none"
          minHeight={searchBarHeightString}
        >
          <SearchBar />
        </FlexRow>
        {hideMessage ? null : (
          <FlexRow
            flex="1 1 auto"
            justifyContent="flex-start"
            responsiveJustifyContent="center"
            mediaWidth={mediaWidthString}
            margin={`${menuSecurityHeightBufferHalfString} ${menuSecurityWidthBufferString} ${menuSecurityHeightBufferHalfString} 0`}
            responsiveMargin={`${menuSecurityHeightBufferHalfString} 0`}
          >
            <Header2
              width="250px"
              responsiveWidth="350px"
              mediaWidth={mediaWidthString}
              responsiveTextAlign="center"
              themeColor="secondary"
            >
              Welcome! Please use the search bar to find securities for your watchlist.
            </Header2>
          </FlexRow>
        )}
        <FlexRow
          flex="0 0 auto"
          margin={`${menuSecurityHeightBufferHalfString} ${menuSecurityWidthBufferString}`}
        >
          <ButtonWatchlist handleClick={this.handleMenuButtonClick} />
        </FlexRow>
        <FlexRow
          flex="0 0 auto"
          margin={`${menuSecurityHeightBufferHalfString} ${menuSecurityWidthBufferString}`}
        >
          <ButtonAccount handleClick={this.handleMenuButtonClick} />
        </FlexRow>
        <FlexRow
          flex="0 0 auto"
          margin={`${menuSecurityHeightBufferHalfString} ${menuSecurityWidthBufferString}`}
        >
          <ButtonLogout handleClick={this.handleMenuButtonClick} />
        </FlexRow>
      </TopMenu>
    );
  }
}

TopMenuContainerInternal.propTypes = {
  history: PropTypes.object.isRequired,
  menuWidthBuffer: PropTypes.number.isRequired,
  menuSecurityWidthBuffer: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  menuHeight: PropTypes.number.isRequired,
  menuHeightBuffer: PropTypes.number.isRequired,
  menuImgWidth: PropTypes.number.isRequired,
  menuSecurityHeightBuffer: PropTypes.number.isRequired,
  searchBarWidth: PropTypes.number.isRequired,
  searchBarHeight: PropTypes.number.isRequired,
  srcexampleHeader: PropTypes.string.isRequired,
  currentPageBody: PropTypes.string.isRequired,
  currentSecurity: PropTypes.string.isRequired,
  statusWatchlistSecurities: PropTypes.string.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

TopMenuContainerInternal.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  history: ownProps.history,
  menuWidthBuffer: state.ui.internal.utilities.menu.widthBuffer,
  menuSecurityWidthBuffer: state.ui.internal.utilities.menuSecurity.widthBuffer,
  mediaWidth: state.ui.internal.utilities.menu.mediaWidth,
  menuHeight: state.ui.internal.utilities.menu.height,
  menuHeightBuffer: state.ui.internal.utilities.menu.heightBuffer,
  menuImgWidth: state.ui.internal.utilities.menuImg.width,
  menuSecurityHeightBuffer: state.ui.internal.utilities.menuSecurity.heightBuffer,
  searchBarWidth: state.ui.internal.utilities.menuSearchBar.width,
  searchBarHeight: state.ui.internal.utilities.menuSearchBar.height,
  srcexampleHeader: state.ui.app.images.exampleHeader.src,
  currentPageBody: state.ui.internal.pageBodies.current,
  currentSecurity: state.data.watchlist.securities.current || '',
  statusWatchlistSecurities: state.data.watchlist.status[statusNames.SECURITIES].status,
});

const mapDispatchToProps = dispatch => ({
  handleLogout: () => dispatch(requestLogout()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(TopMenuContainerInternal),
);
