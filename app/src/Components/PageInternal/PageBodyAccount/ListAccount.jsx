import React from 'react';
import PropTypes from 'prop-types';

import { buttonNames } from '../../../Constants/uiConstantsAccount';

import List from '../../List/List';
import ListItem from '../../List/ListItem';
import ButtonTextOnly from '../../Buttons/ButtonTextOnly';

const ListAccount = (props) => {
  const {
    width,
    widthBuffer,
    rowWidthIndent,
    mediaWidth,
    heightBuffer,
    rowHeight,
    rowHeightBufferBottom,
    handleClick,
  } = props;
  const widthString = `${width}px`;
  const widthBufferHalfString = `${widthBuffer / 2}px`;
  const rowWidthIndentString = `${rowWidthIndent}px`;
  const mediaWidthString = `${mediaWidth}px`;
  const heightBufferHalfString = `${heightBuffer / 2}px`;

  return (
    <List
      alignSelf="flex-start"
      width={widthString}
      mediaWidth={mediaWidthString}
      padding={`${heightBufferHalfString} ${widthBufferHalfString}`}
    >
      <ListItem
        width={`$calc(100% - ${rowWidthIndentString})`}
        height={`${rowHeight}px`}
        padding={`0 0 0 ${rowWidthIndentString}`}
        margin={`0 0 ${rowHeightBufferBottom}px 0`}
      >
        <ButtonTextOnly
          type="button"
          id={buttonNames.PROFILE}
          fontWeight={400}
          onClick={handleClick}
        >
          Profile
        </ButtonTextOnly>
      </ListItem>
      <ListItem
        width={`$calc(100% - ${rowWidthIndentString})`}
        height={`${rowHeight}px`}
        padding={`0 0 0 ${rowWidthIndentString}`}
        margin={`0 0 ${rowHeightBufferBottom}px 0`}
      >
        <ButtonTextOnly
          type="button"
          id={buttonNames.BILLING}
          fontWeight={400}
          onClick={handleClick}
        >
          Billing
        </ButtonTextOnly>
      </ListItem>
      <ListItem
        width={`$calc(100% - ${rowWidthIndentString})`}
        height={`${rowHeight}px`}
        padding={`0 0 0 ${rowWidthIndentString}`}
        margin={`0 0 ${rowHeightBufferBottom}px 0`}
      >
        <ButtonTextOnly
          type="button"
          id={buttonNames.CHANGE_PASSWORD}
          fontWeight={400}
          onClick={handleClick}
        >
          Change Password
        </ButtonTextOnly>
      </ListItem>
      <ListItem
        width={`$calc(100% - ${rowWidthIndentString})`}
        height={`${rowHeight}px`}
        padding={`0 0 0 ${rowWidthIndentString}`}
      >
        <ButtonTextOnly
          type="button"
          id={buttonNames.DELETE_ACCOUNT}
          fontWeight={400}
          onClick={handleClick}
        >
          Delete Account
        </ButtonTextOnly>
      </ListItem>
    </List>
  );
};

ListAccount.propTypes = {
  width: PropTypes.number.isRequired,
  widthBuffer: PropTypes.number.isRequired,
  rowWidthIndent: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowHeightBufferBottom: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default ListAccount;
