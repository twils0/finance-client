import React from 'react';
import PropTypes from 'prop-types';
import { BeatLoader } from 'halogenium';

import theme from '../../../../themes';

import Article from '../../../Article';
import FlexColumn from '../../../Flex/FlexColumn';
import TopMenuContainerWatchlist from '../../../../Containers/PageInternal/PageBodyContainerWatchlist/TopMenuContainerWatchlist';
import ArticleDescriptionContainerWatchlist from '../../../../Containers/PageInternal/PageBodyContainerWatchlist/ArticleDescriptionContainerWatchlist';
import ArticleGridContainerDataWatchlist from '../../../../Containers/PageInternal/PageBodyContainerWatchlist/ArticleGridContainerDataWatchlist';

const ArticleWatchlist = (props) => {
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
    statusLoading,
    securities,
  } = props;
  const widthString = `calc(100% - ${outsideWidthTotal}px)`;
  const widthLeftColumnString = `${widthTable + widthIndent / 2}px`;
  const widthBufferHalfString = `${widthBuffer / 2}px`;
  const widthIndentHalfString = `${widthIndent / 2}px`;
  const mediaWidthString = `${mediaWidth}px`;
  const heightString = `calc(100% - ${menuHeight}px)`;
  const articleHeightString = `calc(100% - ${articleMenuHeight}px)`;
  const heightBufferHalfString = `${heightBuffer / 2}px`;
  const heightIndentHalfString = `${heightIndent / 2}px`;
  let currentSecurity = null;

  if (securities && securities.current) {
    currentSecurity = securities.current;
  }

  return (
    <Article
      margin={`${heightBufferHalfString} 0`}
      responsiveMargin={`0 0 ${heightBufferHalfString} 0`}
      padding={`0 ${widthBufferHalfString}`}
      width={widthString}
      mediaWidth={mediaWidthString}
      responsiveWidth="100%"
      height={heightString}
    >
      {!currentSecurity ? (
        <FlexColumn width="100%" mediaWidth={mediaWidthString} height={articleHeightString} />
      ) : (
        <TopMenuContainerWatchlist />
      )}
      {!currentSecurity || !statusLoading ? null : (
        <FlexColumn width="100%" mediaWidth={mediaWidthString} height={articleHeightString}>
          <BeatLoader color={theme.color.secondary.default} />
        </FlexColumn>
      )}
      {!currentSecurity || statusLoading ? null : (
        <FlexColumn
          alignItems="flex-start"
          padding={`
          ${heightIndentHalfString}
          ${widthIndentHalfString}
          ${heightIndentHalfString}
          0
        `}
          width={widthLeftColumnString}
          mediaWidth={mediaWidthString}
          responsivePadding={`
          ${heightIndentHalfString}
          0
          ${heightIndentHalfString}
          0
        `}
          responsiveWidth="100%"
        >
          <ArticleGridContainerDataWatchlist />
        </FlexColumn>
      )}
      {!currentSecurity || statusLoading ? null : (
        <FlexColumn
          flex="1 1"
          padding={`
          ${heightIndentHalfString}
          0
          ${heightIndentHalfString}
          ${widthIndentHalfString}
        `}
          mediaWidth={mediaWidthString}
          responsivePadding={`
          ${heightIndentHalfString}
          0
          ${heightIndentHalfString}
          0
        `}
        >
          <ArticleDescriptionContainerWatchlist />
        </FlexColumn>
      )}
    </Article>
  );
};

ArticleWatchlist.propTypes = {
  widthTable: PropTypes.number.isRequired,
  widthBuffer: PropTypes.number.isRequired,
  widthIndent: PropTypes.number.isRequired,
  outsideWidthTotal: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  menuHeight: PropTypes.number.isRequired,
  articleMenuHeight: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  heightIndent: PropTypes.number.isRequired,
  statusLoading: PropTypes.bool.isRequired,
  securities: PropTypes.object.isRequired,
};

export default ArticleWatchlist;
