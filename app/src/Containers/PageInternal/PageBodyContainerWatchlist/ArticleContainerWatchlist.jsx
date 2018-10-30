import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { requestStatusTypes } from '../../../Constants/universalConstants';
import { statusNames } from '../../../Constants/dataConstantsWatchlist';
import requestSecurityData from '../../../Actions/dataThunkWatchlist/requestSecurityData';

import ArticleWatchlist from '../../../Components/PageInternal/PageBodyWatchlist/Article/ArticleWatchlist';

class ArticleContainerWatchlist extends React.Component {
  constructor(props) {
    super(props);

    const { securities } = this.props;
    const { current } = securities;

    if (current && securities[current]) {
      const currentSecurity = securities[current];

      const { handleSecurityData } = this.props;
      const { id, tickerCusip } = currentSecurity;

      console.log('test con sec data 1');

      handleSecurityData({ id, tickerCusip });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { securities } = this.props;
    const newSecurities = nextProps.securities;

    if (securities.current !== newSecurities.current) {
      const { handleSecurityData } = this.props;
      const { current } = newSecurities;

      if (current && newSecurities[current]) {
        const currentSecurity = newSecurities[current];

        const { id, tickerCusip } = currentSecurity;

        handleSecurityData({ id, tickerCusip });
      }
    }
  }

  componentWillUnmount() {
    console.log('test art unmount');
  }

  render() {
    const {
      outsideWidthTotal,
      widthTable,
      widthBuffer,
      widthIndent,
      mediaWidth,
      menuHeight,
      articleMenuHeight,
      heightBuffer,
      heightIndent,
      status,
      securities,
    } = this.props;
    const statusLoading = status[statusNames.SECURITIES].status !== requestStatusTypes.SUCCESS
      || status[statusNames.GET_SECURITY_DATA].status === requestStatusTypes.LOADING;

    return (
      <ArticleWatchlist
        outsideWidthTotal={outsideWidthTotal}
        widthTable={widthTable}
        widthBuffer={widthBuffer}
        widthIndent={widthIndent}
        mediaWidth={mediaWidth}
        menuHeight={menuHeight}
        articleMenuHeight={articleMenuHeight}
        heightBuffer={heightBuffer}
        heightIndent={heightIndent}
        statusLoading={statusLoading}
        securities={securities}
      />
    );
  }
}

ArticleContainerWatchlist.propTypes = {
  outsideWidthTotal: PropTypes.number.isRequired,
  widthTable: PropTypes.number.isRequired,
  widthBuffer: PropTypes.number.isRequired,
  widthIndent: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  menuHeight: PropTypes.number.isRequired,
  articleMenuHeight: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  heightIndent: PropTypes.number.isRequired,
  securities: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  handleSecurityData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  outsideWidthTotal: state.ui.internal.watchlist.utilities.article.outsideWidthTotal,
  widthTable: state.ui.internal.watchlist.utilities.articleTable.width,
  widthBuffer: state.ui.internal.watchlist.utilities.article.widthBuffer,
  widthIndent: state.ui.internal.watchlist.utilities.article.widthIndent,
  mediaWidth: state.ui.internal.watchlist.utilities.pageBody.mediaWidth,
  menuHeight: state.ui.internal.utilities.menu.height,
  articleMenuHeight: state.ui.internal.watchlist.utilities.articleMenu.height,
  heightBuffer: state.ui.internal.watchlist.utilities.article.heightBuffer,
  heightIndent: state.ui.internal.watchlist.utilities.article.heightIndent,
  securities: state.data.watchlist.securities,
  status: state.data.watchlist.status,
});

const mapDispatchToProps = dispatch => ({
  handleSecurityData: payload => dispatch(requestSecurityData(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArticleContainerWatchlist);
