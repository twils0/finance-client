import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { deepEqual } from 'fast-equals';

import { pathNames } from '../../../Constants/universalConstants';
import { setSecuritiesList } from '../../../Actions/dataActionsWatchlist';
import requestUpdateSecurities from '../../../Actions/dataThunkWatchlist/requestUpdateSecurities';

import ListWatchlist from '../../../Components/PageInternal/PageBodyWatchlist/ListWatchlist';

class ListContainerWatchlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: props.securities.list.map((security, index) => index),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setOrder(nextProps.securities.list);
  }

  setOrder = (list) => {
    if (list.length !== this.state.order.length) {
      this.resetOrder(list);
    }
  };

  resetOrder = (list) => {
    const order = list.map((security, index) => index);
    this.setState({ order });
  };

  updateLocalStateOrder = (order) => {
    this.setState({ order });
  };

  updateSecurities = () => {
    const { securities, handleSecuritiesList, handleUpdateSecurities } = this.props;
    const { order } = this.state;
    const list = [];

    order.forEach((index) => {
      list.push(securities.list[index]);
    });

    if (!deepEqual(list, securities.list)) {
      this.resetOrder(list);
      handleSecuritiesList({ list });
      handleUpdateSecurities();
    }
  };

  handleItemClick = (clickEvent) => {
    const { securities } = this.props;
    const securityId = clickEvent.target.id;

    if (securities.current !== securityId && Object.keys(securities).indexOf(securityId) > -1) {
      this.props.history.push(`${pathNames.WATCHLIST}/${securityId}`);
    }
  };

  render() {
    const {
      springSettings,
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
      securities,
    } = this.props;
    const { order } = this.state;

    return (
      <ListWatchlist
        springSettings={springSettings}
        width={width}
        widthBufferLeft={widthBufferLeft}
        widthBufferScrollBar={widthBufferScrollBar}
        widthBufferRight={widthBufferRight}
        heightBuffer={heightBuffer}
        responsiveHeight={responsiveHeight}
        rowWidthIndent={rowWidthIndent}
        rowHeight={rowHeight}
        rowHeightIndent={rowHeightIndent}
        rowHeightBufferBottom={rowHeightBufferBottom}
        burgerMenuIconWidth={burgerMenuIconWidth}
        burgerMenuIconWidthIndent={burgerMenuIconWidthIndent}
        burgerMenuIconHeight={burgerMenuIconHeight}
        securities={securities}
        order={order}
        updateLocalStateOrder={this.updateLocalStateOrder}
        updateSecurities={this.updateSecurities}
        handleClick={this.handleItemClick}
      />
    );
  }
}

ListContainerWatchlist.propTypes = {
  history: PropTypes.object.isRequired,
  springSettings: PropTypes.shape({ stiffness: PropTypes.number, damping: PropTypes.number })
    .isRequired,
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
  securities: PropTypes.object.isRequired,
  handleSecuritiesList: PropTypes.func.isRequired,
  handleUpdateSecurities: PropTypes.func.isRequired,
};

ListContainerWatchlist.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  history: ownProps.history,
  springSettings: state.ui.internal.watchlist.utilities.list.springSettings,
  width: state.ui.internal.watchlist.utilities.list.width,
  widthBufferLeft: state.ui.internal.watchlist.utilities.list.widthBufferLeft,
  widthBufferScrollBar: state.ui.internal.watchlist.utilities.list.widthBufferScrollBar,
  widthBufferRight: state.ui.internal.watchlist.utilities.list.widthBufferRight,
  heightBuffer: state.ui.internal.watchlist.utilities.list.heightBuffer,
  responsiveHeight: state.ui.internal.watchlist.utilities.list.responsiveHeight,
  rowWidthIndent: state.ui.internal.watchlist.utilities.list.rowWidthIndent,
  rowHeight: state.ui.internal.watchlist.utilities.list.rowHeight,
  rowHeightIndent: state.ui.internal.watchlist.utilities.list.rowHeightIndent,
  rowHeightBufferBottom: state.ui.internal.watchlist.utilities.list.rowHeightBufferBottom,
  burgerMenuIconWidth: state.ui.internal.watchlist.utilities.list.burgerMenuIconWidth,
  burgerMenuIconWidthIndent: state.ui.internal.watchlist.utilities.list.burgerMenuIconWidthIndent,
  burgerMenuIconHeight: state.ui.internal.watchlist.utilities.list.burgerMenuIconHeight,
  securities: state.data.watchlist.securities,
});

const mapDispatchToProps = dispatch => ({
  handleSecuritiesList: payload => dispatch(setSecuritiesList(payload)),
  handleUpdateSecurities: payload => dispatch(requestUpdateSecurities(payload)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ListContainerWatchlist),
);
