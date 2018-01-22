import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';

import List from './List';
import ListItemMotion from './ListItemMotion';
import getDataset from '../../getDataset';

class ListMotion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPressed: false,
      topDeltaY: 0,
      mouseY: 0,
      pressedIndex: 0,
    };
  }

  componentDidMount() {
    const pageInternal = document.getElementById('pageInternal');

    pageInternal.addEventListener('mousemove', this.handleMouseMove);
    pageInternal.addEventListener('touchmove', this.handleTouchMove, false);
    pageInternal.addEventListener('mouseup', this.handleMouseUp);
    pageInternal.addEventListener('touchend', this.handleTouchEnd, false);
  }

  componentWillUnmount() {
    const pageInternal = document.getElementById('pageInternal');

    pageInternal.removeEventListener('mousemove', this.handleMouseMove);
    pageInternal.removeEventListener('touchmove', this.handleTouchMove);
    pageInternal.removeEventListener('mouseup', this.handleMouseUp);
    pageInternal.removeEventListener('touchend', this.handleTouchEnd);
  }

  updateOrder = (order, fromIndex, toIndex) => {
    const newOrder = [...order];
    const value = newOrder[fromIndex];

    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, value);

    return newOrder;
  };

  clamp = (n, min, max) => Math.max(Math.min(Math.round(n), max), min);

  handleMouseDown = (event) => {
    const { pageY, target } = event;
    let { dataset } = target;

    if (!dataset) {
      dataset = getDataset(target);
    }

    const { y, securityIndex } = dataset;
    const yFloat = parseFloat(y);
    const securityIndexInt = parseInt(securityIndex, 10);

    this.setState({
      isPressed: true,
      topDeltaY: pageY - yFloat,
      mouseY: yFloat,
      pressedIndex: securityIndexInt,
    });
  };

  handleTouchStart = (event) => {
    event.preventDefault();

    this.handleMouseDown(event.changedTouches[0]);

    return false;
  };

  handleMouseMove = (event) => {
    if (this.state.isPressed) {
      const { pageY } = event;
      const { order, rowHeight, rowHeightBufferBottom } = this.props;
      const { topDeltaY, pressedIndex } = this.state;

      const mouseY = pageY - topDeltaY;
      const currentIndex = this.clamp(
        mouseY / (rowHeight + rowHeightBufferBottom),
        0,
        order.length - 1,
      );
      const orderIndex = order.indexOf(pressedIndex);

      if (orderIndex !== currentIndex) {
        const newOrder = this.updateOrder(order, orderIndex, currentIndex);
        this.props.updateLocalStateOrder(newOrder);
      }

      this.setState({ mouseY });
    }
  };

  handleTouchMove = (event) => {
    if (this.state.isPressed) {
      event.preventDefault();

      this.handleMouseMove(event.changedTouches[0]);

      return false;
    }

    return true;
  };

  handleMouseUp = () => {
    if (this.state.isPressed) {
      this.setState({ isPressed: false, topDeltaY: 0 });
      this.props.updateSecurities();
    }
  };

  handleTouchEnd = (event) => {
    if (this.state.isPressed) {
      event.preventDefault();

      this.setState({ isPressed: false, topDeltaY: 0 });
      this.props.updateSecurities();

      return false;
    }

    return true;
  };

  generateStyles = () => {
    const { isPressed, pressedIndex, mouseY } = this.state;
    const {
      securities, order, rowHeight, rowHeightBufferBottom, rowHeightIndent,
    } = this.props;
    const totalHeight = rowHeight + rowHeightBufferBottom;

    return securities.list.map((id, index) => ({
      key: id,
      data: { security: securities[id], index },
      style: {
        height: spring(rowHeight, this.listSpringConfig),
        marginBottom: spring(rowHeightBufferBottom, this.listSpringConfig),
        paddingTop: spring(rowHeightIndent, this.listSpringConfig),
        paddingBottom: spring(rowHeightIndent, this.listSpringConfig),
        opacity: spring(1, this.listSpringConfig),
        ...(isPressed && pressedIndex === index
          ? {
            shadow: spring(16, this.listSpringConfig),
            y: mouseY,
            zIndex: 999,
          }
          : {
            shadow: 0,
            y:
                order.indexOf(index) === -1
                  ? 0
                  : spring(order.indexOf(index) * totalHeight, this.listSpringConfig),
            zIndex: 0,
          }),
      },
    }));
  };

  willEnter = (security) => {
    let y = 0;
    let zIndex = 0;

    if (typeof security.style.y === 'object') {
      y = security.style.y.val;
    }
    if (security.style.zIndex) {
      ({ zIndex } = security.style);
    }

    return {
      height: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      opacity: 0,
      shadow: 0,
      y,
      zIndex,
    };
  };

  willLeave = security => ({
    height: spring(0, this.listSpringConfig),
    marginBottom: spring(0, this.listSpringConfig),
    paddingTop: spring(0, this.listSpringConfig),
    paddingBottom: spring(0, this.listSpringConfig),
    opacity: spring(0, this.listSpringConfig),
    y: security.style.y,
  });

  renderRow = ({ key, data, style }) => {
    const { ListItem, BurgerMenuIcon, renderListItemChildren } = this.props;

    return (
      <ListItemMotion
        key={`list-security-motion-${key}`}
        style={style}
        data={data}
        ListItem={ListItem}
        BurgerMenuIcon={BurgerMenuIcon}
        handleMouseDown={this.handleMouseDown}
        handleTouchStart={this.handleTouchStart}
        renderListItemChildren={renderListItemChildren}
      />
    );
  };

  renderListMotion = styles => (
    <List width="100%" height="100%" {...this.props.List} position="absolute">
      {this.props.securities.list.length > 0 && styles.map(this.renderRow)}
    </List>
  );

  render() {
    return (
      <TransitionMotion
        styles={this.generateStyles()}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {this.renderListMotion}
      </TransitionMotion>
    );
  }
}

ListMotion.propTypes = {
  List: PropTypes.object,
  ListItem: PropTypes.object,
  BurgerMenuIcon: PropTypes.object,
  securities: PropTypes.object.isRequired,
  order: PropTypes.array.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowHeightIndent: PropTypes.number.isRequired,
  rowHeightBufferBottom: PropTypes.number.isRequired,
  updateLocalStateOrder: PropTypes.func.isRequired,
  updateSecurities: PropTypes.func.isRequired,
  renderListItemChildren: PropTypes.func.isRequired,
};

ListMotion.defaultProps = {
  List: {},
  ListItem: {},
  BurgerMenuIcon: {},
};

export default ListMotion;
