import React from 'react';
import PropTypes from 'prop-types';
import { BeatLoader } from 'halogenium';

import theme from '../themes';

import { errorMessages } from '../Constants/uiConstantsApp';

import FlexColumn from './Flex/FlexColumn';
import Header2 from './Header2';

const Loading = (props) => {
  const {
    menuHeight, error, pastDelay, timedOut,
  } = props;
  const menuHeightString = `${menuHeight}px`;

  if (error) {
    return (
      <FlexColumn width="100%" height={`calc(100% - ${menuHeightString})`}>
        <Header2>{errorMessages.INTERNAL_ERROR}</Header2>
      </FlexColumn>
    );
  } else if (pastDelay) {
    return (
      <FlexColumn width="100%" height={`calc(100% - ${menuHeightString})`}>
        <BeatLoader color={theme.color.secondary.default} />
      </FlexColumn>
    );
  } else if (timedOut) {
    return (
      <FlexColumn width="100%" height={`calc(100% - ${menuHeightString})`}>
        <Header2>A process on this page has timed out. Please refresh the page.</Header2>
      </FlexColumn>
    );
  }
  return null;
};

Loading.propTypes = {
  menuHeight: PropTypes.number,
  error: PropTypes.oneOf([false, true, null]),
  pastDelay: PropTypes.oneOf([false, true, null]),
  timedOut: PropTypes.oneOf([false, true, null]),
};

Loading.defaultProps = {
  menuHeight: 0,
  error: false,
  pastDelay: false,
  timedOut: false,
};

export default Loading;
