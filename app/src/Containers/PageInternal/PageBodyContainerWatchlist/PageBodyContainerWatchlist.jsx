import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BeatLoader } from 'halogenium';

import theme from '../../../themes';

import { requestStatusTypes } from '../../../Constants/universalConstants';
import { statusNames } from '../../../Constants/dataConstantsWatchlist';

import PageBody from '../../../Components/PageBody';
import ListContainerWatchlist from './ListContainerWatchlist';
import FlexColumn from '../../../Components/Flex/FlexColumn';
import ArticleContainerWatchlist from './ArticleContainerWatchlist';

const PageBodyContainerWatchlist = (props) => {
  const {
    width, mediaWidth, heightBuffer, menuHeight, menuHeightBuffer, statusSecurities,
  } = props;
  const widthHalfString = `${width / 2}px`;
  const mediaWidthString = `${mediaWidth}px`;
  const heightString = `calc(100% - ${heightBuffer}px)`;
  const heightBufferHalfString = `${heightBuffer / 2}px`;
  const menuHeightString = `${menuHeight + menuHeightBuffer}px`;

  if (statusSecurities !== requestStatusTypes.SUCCESS) {
    return (
      <FlexColumn width="100%" height={`calc(100% - ${menuHeightString})`}>
        <BeatLoader color={theme.color.secondary.default} />
      </FlexColumn>
    );
  }

  console.log('test status sec', statusSecurities);

  return (
    <PageBody mediaWidth={mediaWidthString} height={`calc(100% - ${menuHeightString})`}>
      <ListContainerWatchlist />
      <FlexColumn
        themeColor="secondary"
        borderColorType="default"
        separator
        mediaWidth={mediaWidthString}
        height={heightString}
        margin={`${heightBufferHalfString} 0`}
        borderWidth={`0 ${widthHalfString}`}
        borderRadius="4px"
      />
      <ArticleContainerWatchlist />
    </PageBody>
  );
};

PageBodyContainerWatchlist.propTypes = {
  width: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  menuHeight: PropTypes.number.isRequired,
  menuHeightBuffer: PropTypes.number.isRequired,
  statusSecurities: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  width: state.ui.internal.watchlist.utilities.separatorLine.width,
  mediaWidth: state.ui.internal.watchlist.utilities.pageBody.mediaWidth,
  heightBuffer: state.ui.internal.watchlist.utilities.separatorLine.heightBuffer,
  menuHeight: state.ui.internal.utilities.menu.height,
  menuHeightBuffer: state.ui.internal.utilities.menu.heightBuffer,
  statusSecurities: state.data.watchlist.status[statusNames.SECURITIES].status,
});

export default connect(mapStateToProps)(PageBodyContainerWatchlist);
