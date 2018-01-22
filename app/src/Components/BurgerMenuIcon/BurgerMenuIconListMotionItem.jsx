import React from 'react';
import PropTypes from 'prop-types';

import BurgerMenuWrapperDiv from './BurgerMenuWrapperDiv';
import BurgerMenuBar from './BurgerMenuBar';

class BurgerMenuIconListMotionSecurity extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.y !== nextProps.y) {
      return true;
    }
    if (this.props.securityIndex !== nextProps.securityIndex) {
      return true;
    }

    return false;
  }

  render() {
    const {
      securityIndex,
      y,
      flex,
      alignSelf,
      right,
      width,
      height,
      padding,
      margin,
      color,
      handleMouseDown,
      handleTouchStart,
    } = this.props;
    const topString = `calc(50% - ${height / 2}px)`;
    const rightString = `${right}px`;
    const widthString = `${width}px`;
    const heightString = `${height}px`;
    const barHeightString = `${Math.round(height / 5, 2)}px`;
    const barHeightBufferString = `${Math.round(height / 5, 2)}px`;

    return (
      <BurgerMenuWrapperDiv
        data-security-index={securityIndex}
        data-y={y}
        flex={flex}
        alignSelf={alignSelf}
        top={topString}
        right={rightString}
        width={widthString}
        height={heightString}
        padding={padding}
        margin={margin}
        color={color}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <BurgerMenuBar
          data-security-index={securityIndex}
          data-y={y}
          width={widthString}
          height={barHeightString}
          margin={`0 0 ${barHeightBufferString} 0`}
          color={color}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
        <BurgerMenuBar
          data-security-index={securityIndex}
          data-y={y}
          width={widthString}
          height={barHeightString}
          margin={`0 0 ${barHeightBufferString} 0`}
          color={color}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
        <BurgerMenuBar
          data-security-index={securityIndex}
          data-y={y}
          width={widthString}
          height={barHeightString}
          color={color}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
      </BurgerMenuWrapperDiv>
    );
  }
}

BurgerMenuIconListMotionSecurity.propTypes = {
  securityIndex: PropTypes.number.isRequired,
  y: PropTypes.number,
  flex: PropTypes.string,
  alignSelf: PropTypes.string,
  right: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.string,
  margin: PropTypes.string,
  color: PropTypes.shape({
    default: PropTypes.string,
    border: PropTypes.string,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    selected: PropTypes.string,
    disabled: PropTypes.string,
  }),
  handleMouseDown: PropTypes.func.isRequired,
  handleTouchStart: PropTypes.func.isRequired,
};

BurgerMenuIconListMotionSecurity.defaultProps = {
  y: 0,
  flex: null,
  alignSelf: null,
  right: 0,
  width: 30,
  height: 27,
  padding: null,
  margin: null,
  color: {},
};

export default BurgerMenuIconListMotionSecurity;
