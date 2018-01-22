import React from 'react';
import PropTypes from 'prop-types';

import theme from '../../../../themes';

import { baseURLs } from '../../../../Constants/universalConstants';

import FlexColumn from '../../../Flex/FlexColumn';
import FlexRow from '../../../Flex/FlexRow';
import Header1 from '../../../Header1';
import Header2 from '../../../Header2';
import Header3 from '../../../Header3';
import Paragraph from '../../../Paragraph';

const ArticleGridDataWatchlist = (props) => {
  const {
    widthIndent, heightBuffer, heightIndent, dataPrice,
  } = props;
  const widthIndentString = `${widthIndent}px`;
  const widthIndentHalfString = `${widthIndent / 2}px`;
  const heightBufferHalfString = `${heightBuffer / 2}px`;
  const heightIndentString = `${heightIndent}px`;
  const { amount, date, time } = dataPrice;

  return (
    <FlexColumn
      flexWrap="nowrap"
      alignItems="flex-start"
      padding={`0 0 ${heightBufferHalfString} 0`}
      width="100%"
      height="100%"
    >
      <FlexRow
        justifyContent="flex-start"
        padding={`0 0 ${heightIndentString} 0`}
        width="100%"
        height="100%"
      >
        <FlexColumn alignItems="flex-start" padding={`0 ${widthIndentString} 0 0`}>
          <Header2 themeColor="secondary" margin="0" fontSize="16px">
            Current Price
          </Header2>
          <Header1 margin="0">
            {amount}
          </Header1>
        </FlexColumn>
      </FlexRow>
      <Paragraph themeSize="text" margin="0" padding={`0 0 0 ${widthIndentHalfString}`}>
        {`Updated ${date} at ${time}`}
      </Paragraph>
      <Paragraph themeSize="text" margin="0" padding={`0 0 0 ${widthIndentHalfString}`}>
        {'Data provided for free by '}
        {
          <a
            style={{
              color: theme.color.secondary.default,
              fontFamily: theme.font.default,
              fontSize: theme.size.font.text,
              lineHeight: theme.lineHeight.default,
            }}
            href={baseURLs.IEX_DEV}
            rel="noopener noreferrer"
            target="_blank"
            tabIndex="-1"
          >
            IEX
          </a>
        }
        {'. View '}
        {
          <a
            style={{
              color: theme.color.secondary.default,
              fontFamily: theme.font.default,
              fontSize: theme.size.font.text,
              lineHeight: theme.lineHeight.default,
            }}
            href={baseURLs.IEX_TERMS}
            rel="noopener noreferrer"
            target="_blank"
            tabIndex="-1"
          >
            IEX’s Terms of Use
          </a>
        }
        {'.'}
      </Paragraph>
      <Header3 padding={`0 0 0 ${widthIndentString}`} margin="0" fontSize="13px" />
    </FlexColumn>
  );
};

ArticleGridDataWatchlist.propTypes = {
  widthIndent: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  heightIndent: PropTypes.number.isRequired,
  dataPrice: PropTypes.object.isRequired,
};

export default ArticleGridDataWatchlist;
