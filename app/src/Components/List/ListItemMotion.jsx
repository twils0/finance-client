import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';
import BurgerMenuIconListMotionItem from '../BurgerMenuIcon/BurgerMenuIconListMotionItem';

class ListItemMotion extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.style.height !== nextProps.style.height) {
      return true;
    }
    if (this.props.style.opacity !== nextProps.style.opacity) {
      return true;
    }
    if (this.props.style.shadow !== nextProps.style.shadow) {
      return true;
    }
    if (this.props.style.y !== nextProps.style.y) {
      return true;
    }
    if (this.props.style.zIndex !== nextProps.style.zIndex) {
      return true;
    }
    if (this.props.data.index !== nextProps.data.index) {
      return true;
    }

    return false;
  }

  render() {
    const {
      style,
      data,
      BurgerMenuIcon,
      handleMouseDown,
      handleTouchStart,
      renderListItemChildren,
    } = this.props;

    const {
      height, marginBottom, paddingTop, paddingBottom, opacity, shadow, y, zIndex,
    } = style;

    const heightString = `${height}px`;
    const marginBottomString = `${marginBottom}px`;
    const paddingTopString = `${paddingTop}px`;
    const paddingBottomString = `${paddingBottom}px`;
    const boxShadowString = `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${1.2 * shadow}px 0px`;
    const transformString = `translate3d(0, ${y}px, 0)`;

    return (
      <ListItem
        {...this.props.ListItem}
        key={`list-security-${data.security.id}`}
        style={{
          height: heightString,
          marginBottom: marginBottomString,
          paddingTop: paddingTopString,
          paddingBottom: paddingBottomString,
          opacity,
          boxShadow: boxShadowString,
          transform: transformString,
          zIndex,
        }}
        position="absolute"
      >
        {renderListItemChildren(data.security)}
        <BurgerMenuIconListMotionItem
          {...BurgerMenuIcon}
          securityIndex={data.index}
          y={y}
          handleMouseDown={handleMouseDown}
          handleTouchStart={handleTouchStart}
        />
      </ListItem>
    );
  }
}

ListItemMotion.propTypes = {
  ListItem: PropTypes.object.isRequired,
  BurgerMenuIcon: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  handleMouseDown: PropTypes.func.isRequired,
  handleTouchStart: PropTypes.func.isRequired,
  renderListItemChildren: PropTypes.func.isRequired,
};

export default ListItemMotion;
