import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { requestStatusTypes } from '../../../Constants/universalConstants';
import { statusNames } from '../../../Constants/dataConstantsWatchlist';
import requestUpdateSecurities from '../../../Actions/dataThunkWatchlist/requestUpdateSecurities';
import deleteSecurity from '../../../Actions/dataThunkWatchlist/deleteSecurity';

import TopMenu from '../../../Components/TopMenu';
import FlexRow from '../../../Components/Flex/FlexRow';
import FlexColumn from '../../../Components/Flex/FlexColumn';
import Header2 from '../../../Components/Header2';
import ButtonUnsubscribe from '../../../Components/PageInternal/PageBodyWatchlist/Article/ButtonUnsubscribe';

class TopMenuContainerWatchlist extends React.Component {
  handleUnsubscribeButtonClick = (clickEvent) => {
    clickEvent.preventDefault();
    const { securities } = this.props;
    const { current } = securities;

    if (current && securities[current]) {
      const { handleDeleteSecurity, handleUpdateSecurities } = this.props;

      handleDeleteSecurity({ id: current });

      handleUpdateSecurities();
    }
  };

  render() {
    const {
      menuSecurityWidthBuffer,
      mediaWidth,
      menuSecurityHeightBuffer,
      securities,
    } = this.props;
    const menuSecurityWidthBufferHalfString = `${menuSecurityWidthBuffer / 2}px`;
    const mediaWidthString = `${mediaWidth}px`;
    const menuSecurityHeightBufferHalfString = `${menuSecurityHeightBuffer / 2}px`;
    let currentSecurity = null;
    let categoryExchangeTickerCusip = null;

    if (securities.current && securities[securities.current]) {
      currentSecurity = securities[securities.current];

      if (currentSecurity && currentSecurity.exchange) {
        categoryExchangeTickerCusip = `${currentSecurity.category} (${currentSecurity.exchange}: ${
          currentSecurity.tickerCusip
        })`;
      } else {
        categoryExchangeTickerCusip = `${currentSecurity.category} (${
          currentSecurity.tickerCusip
        })`;
      }
    }

    if (currentSecurity) {
      const { status } = this.props;
      const statusLoading = status[statusNames.SECURITIES].status !== requestStatusTypes.SUCCESS
        || status[statusNames.GET_SECURITY_DATA].status === requestStatusTypes.LOADING;

      return (
        <TopMenu
          alignItems="flex-end"
          justifyContent="center"
          responsivePadding={`0 0 ${menuSecurityHeightBufferHalfString} 0`}
          width="100%"
          mediaWidth={mediaWidthString}
          borderWidth="0 0 1px 0"
        >
          <FlexRow
            flex="1 1 auto"
            justifyContent="flex-start"
            padding={`0 ${menuSecurityWidthBufferHalfString}
            ${menuSecurityHeightBufferHalfString} 0`}
            width="100%"
            mediaWidth={mediaWidthString}
            responsivePadding={`${menuSecurityHeightBufferHalfString} 0`}
          >
            <FlexColumn
              width="100%"
              alignItems="flex-start"
              mediaWidth={mediaWidthString}
              responsiveAlignSecurities="center"
            >
              <Header2
                themeColor="secondary"
                colorType="default"
                fontSize="24px"
                fontFamily="Titillium Web"
                margin="0"
                mediaWidth={mediaWidthString}
                responsiveTextAlign="center"
                responsivePadding={`0 0 ${menuSecurityHeightBufferHalfString} 0`}
              >
                {currentSecurity && currentSecurity.name}
              </Header2>
              <Header2
                colorType="default"
                fontSize="17px"
                fontFamily="Titillium Web"
                margin="0"
                padding={`${menuSecurityHeightBufferHalfString} 0 0 0`}
                mediaWidth={mediaWidthString}
                responsiveTextAlign="center"
              >
                {categoryExchangeTickerCusip}
              </Header2>
            </FlexColumn>
          </FlexRow>
          <FlexRow
            flex="0 0 auto"
            padding={`${menuSecurityHeightBufferHalfString} 0
          ${menuSecurityHeightBufferHalfString} ${menuSecurityWidthBufferHalfString}`}
            mediaWidth={mediaWidthString}
            responsivePadding={`${menuSecurityHeightBufferHalfString} 0`}
          >
            <ButtonUnsubscribe
              statusLoading={statusLoading}
              handleClick={this.handleUnsubscribeButtonClick}
            />
          </FlexRow>
        </TopMenu>
      );
    }
    return null;
  }
}

TopMenuContainerWatchlist.propTypes = {
  menuSecurityWidthBuffer: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  menuSecurityHeightBuffer: PropTypes.number.isRequired,
  securities: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  handleDeleteSecurity: PropTypes.func.isRequired,
  handleUpdateSecurities: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  menuSecurityWidthBuffer: state.ui.internal.watchlist.utilities.articleMenuSecurity.widthBuffer,
  mediaWidth: state.ui.internal.watchlist.utilities.pageBody.mediaWidth,
  menuSecurityHeightBuffer: state.ui.internal.watchlist.utilities.articleMenuSecurity.heightBuffer,
  securities: state.data.watchlist.securities,
  status: state.data.watchlist.status,
});

const mapDispatchToProps = dispatch => ({
  handleDeleteSecurity: payload => dispatch(deleteSecurity(payload)),
  handleUpdateSecurities: () => dispatch(requestUpdateSecurities()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopMenuContainerWatchlist);
