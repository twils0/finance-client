import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { statusNames } from '../../../Constants/dataConstantsWatchlist';

import ArticleGridDataWatchlist from '../../../Components/PageInternal/PageBodyWatchlist/Article/ArticleGridDataWatchlist';

const ArticleGridContainerDataWatchlist = (props) => {
  const {
    securities, articleGridWidthIndent, articleGridHeightBuffer, articleGridHeightIndent,
  } = props;

  const { current } = securities;

  if (current && securities[current]) {
    const currentSecurity = securities[current];

    if (currentSecurity.data && currentSecurity.data.price) {
      const dataPrice = currentSecurity.data.price;

      return (
        <ArticleGridDataWatchlist
          widthIndent={articleGridWidthIndent}
          heightBuffer={articleGridHeightBuffer}
          heightIndent={articleGridHeightIndent}
          dataPrice={dataPrice}
        />
      );
    }
  }
  return null;
};

ArticleGridContainerDataWatchlist.propTypes = {
  articleGridWidthIndent: PropTypes.number.isRequired,
  articleGridHeightBuffer: PropTypes.number.isRequired,
  articleGridHeightIndent: PropTypes.number.isRequired,
  securities: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  articleGridWidthIndent: state.ui.internal.watchlist.utilities.articleGrid.widthIndent,
  articleGridHeightBuffer: state.ui.internal.watchlist.utilities.articleGrid.heightBuffer,
  articleGridHeightIndent: state.ui.internal.watchlist.utilities.articleGrid.heightIndent,
  statusSecurityData: state.data.watchlist.status[statusNames.GET_SECURITY_DATA].status,
  securities: state.data.watchlist.securities,
});

export default connect(mapStateToProps)(ArticleGridContainerDataWatchlist);
