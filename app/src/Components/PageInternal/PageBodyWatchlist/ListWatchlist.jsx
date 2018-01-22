import React from 'react';
import PropTypes from 'prop-types';

import ButtonTextOnly from '../../Buttons/ButtonTextOnly';
import ListMotionWrapperDiv from '../../List/ListMotionWrapperDiv';
import ListMotion from '../../List/ListMotion';

class ListWatchlist extends React.Component {
  renderListItemChildren = (security) => {
    const { handleClick, burgerMenuIconWidth, burgerMenuIconWidthIndent } = this.props;
    const marginRightString = `${burgerMenuIconWidth + burgerMenuIconWidthIndent * 2}px`;
    const widthString = `calc(100% - ${marginRightString})`;
    const { name, exchange, tickerCusip } = security;
    let exchangeTickerCusip = null;
    let nameCutoff = name;

    if (exchange) {
      exchangeTickerCusip = ` (${exchange}: ${tickerCusip})`;
    } else {
      exchangeTickerCusip = ` (${tickerCusip})`;
    }

    let cutoff = 107 - exchangeTickerCusip.length; // character cutoff manually determined to be 107

    if (name.length > cutoff) {
      cutoff -= 3; // subtract 3 characters to allow space for the ellipses
      nameCutoff = `${name.slice(0, cutoff)}...`;
    }

    return (
      <ButtonTextOnly
        type="button"
        colorType="dark"
        alignItems="center"
        width={widthString}
        height="100%"
        whiteSpace="normal"
        textOverflow="ellipsis"
        textAlign="left"
        id={security.id}
        fontSize="13px"
        fontWeight={400}
        onClick={handleClick}
      >
        {nameCutoff}
        {exchangeTickerCusip}
      </ButtonTextOnly>
    );
  };

  render() {
    const {
      securities,
      order,
      width,
      widthBufferLeft,
      widthBufferScrollBar,
      widthBufferRight,
      heightBuffer,
      responsiveHeight,
      rowWidthIndent,
      rowHeight,
      rowHeightIndent,
      rowHeightBufferBottom,
      burgerMenuIconWidth,
      burgerMenuIconWidthIndent,
      burgerMenuIconHeight,
      updateLocalStateOrder,
      updateSecurities,
    } = this.props;
    const widthString = `${width}px`;
    const widthBufferLeftString = `${widthBufferLeft}px`;
    const widthBufferScrollBarString = `${widthBufferScrollBar}px`;
    const widthBufferRightString = `${widthBufferScrollBar + widthBufferRight}px`;
    const mediaWidthString = `${widthBufferLeft
      + width
      + widthBufferRight
      + widthBufferScrollBar}px`;
    const responsiveWidthString = `calc(100% - ${widthBufferScrollBar}px)`;
    const heightString = `calc(100% - ${heightBuffer}px)`;
    const responsiveHeightString = `${responsiveHeight}px`;
    const heightBufferHalfString = `${heightBuffer / 2}px`;
    const rowWidthIndentString = `${rowWidthIndent}px`;
    const rowHeightString = `${rowHeight}px`;
    const rowHeightBufferBottomString = `${rowHeightBufferBottom}px`;

    return (
      <ListMotionWrapperDiv
        alignSelf="flex-start"
        borderWidth="1px 0"
        width={widthString}
        mediaWidth={mediaWidthString}
        responsiveWidth={responsiveWidthString}
        height={heightString}
        margin={`${heightBufferHalfString}
        ${widthBufferRightString}
        ${heightBufferHalfString}
        ${widthBufferLeftString}`}
        responsiveMargin={`${heightBufferHalfString} ${widthBufferLeftString}`}
        responsiveHeight={responsiveHeightString}
      >
        <ListMotion
          securities={securities}
          order={order}
          List={{
            padding: `0 ${widthBufferScrollBarString} 0 0`,
            mediaWidth: mediaWidthString,
            responsiveWidth: '100%',
          }}
          ListItem={{
            width: widthString,
            mediaWidth: mediaWidthString,
            responsiveWidth: responsiveWidthString,
            height: rowHeightString,
            padding: `0 0 0 ${rowWidthIndentString}`,
            margin: `0 0 ${rowHeightBufferBottomString} 0`,
          }}
          BurgerMenuIcon={{
            // burger menu icon props must be provided as numbers, not strings with px
            right: burgerMenuIconWidthIndent,
            width: burgerMenuIconWidth,
            height: burgerMenuIconHeight,
          }}
          rowHeight={rowHeight}
          rowHeightIndent={rowHeightIndent}
          rowHeightBufferBottom={rowHeightBufferBottom}
          renderListItemChildren={this.renderListItemChildren}
          updateLocalStateOrder={updateLocalStateOrder}
          updateSecurities={updateSecurities}
        />
      </ListMotionWrapperDiv>
    );
  }
}

ListWatchlist.propTypes = {
  securities: PropTypes.object.isRequired,
  order: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  widthBufferLeft: PropTypes.number.isRequired,
  widthBufferScrollBar: PropTypes.number.isRequired,
  widthBufferRight: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  responsiveHeight: PropTypes.number.isRequired,
  rowWidthIndent: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowHeightIndent: PropTypes.number.isRequired,
  rowHeightBufferBottom: PropTypes.number.isRequired,
  burgerMenuIconWidth: PropTypes.number.isRequired,
  burgerMenuIconWidthIndent: PropTypes.number.isRequired,
  burgerMenuIconHeight: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  updateLocalStateOrder: PropTypes.func.isRequired,
  updateSecurities: PropTypes.func.isRequired,
};

export default ListWatchlist;
