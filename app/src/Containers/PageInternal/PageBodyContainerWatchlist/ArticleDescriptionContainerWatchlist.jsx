import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Paragraph from '../../../Components/Paragraph';

const ArticleDescriptionContainerWatchlist = (props) => {
  const { securities } = props;
  const { current } = securities;

  if (current && securities[current]) {
    const currentSecurity = securities[current];

    if (currentSecurity.data && currentSecurity.data.description) {
      const { articleDescriptionMinWidth } = props;
      const articleDescriptionMinWidthString = `${articleDescriptionMinWidth}px`;
      const { description } = currentSecurity.data;

      return (
        <Paragraph
          flex="1 1"
          alignSelf="flex-start"
          margin="0"
          width="100%"
          minWidth={articleDescriptionMinWidthString}
        >
          {description}
        </Paragraph>
      );
    }
  }
  return null;
};

ArticleDescriptionContainerWatchlist.propTypes = {
  articleDescriptionMinWidth: PropTypes.number.isRequired,
  securities: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  articleDescriptionMinWidth: state.ui.internal.watchlist.utilities.articleDescription.minWidth,
  securities: state.data.watchlist.securities,
});

export default connect(mapStateToProps)(ArticleDescriptionContainerWatchlist);
