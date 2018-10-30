import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import axios from 'axios';
// import raven from 'raven-js';
import AsyncSelect from 'react-select/lib/Async';
import { components } from 'react-select';
import { BeatLoader } from 'halogenium';

import theme from '../../../themes';
// import handleErrorCatch from '../../../handleErrorCatch';

import demoSecurities from '../../../../../demo/demoAllSecurities';

import {
  // axiosConfig,
  // URLs,
  pathNames,
  requestStatusTypes,
} from '../../../Constants/universalConstants';
import { statusNames } from '../../../Constants/dataConstantsWatchlist';
import { pageBodyNames } from '../../../Constants/uiConstantsInternal';
import { setCurrentPageBody } from '../../../Actions/uiActionsInternal';
import { setSecurity, setSecuritiesCurrent, setSecuritiesList } from '../../../Actions/dataActionsWatchlist';
import requestSecurityData from '../../../Actions/dataThunkWatchlist/requestSecurityData';
import requestUpdateSecurities from '../../../Actions/dataThunkWatchlist/requestUpdateSecurities';

import Icon from '../../../Components/Icon';

class SearchBarContainer extends React.Component {
  constructor(props) {
    super(props);

    const { width, height, heightBuffer } = props;
    const widthBufferLeft = 10;
    const widthString = `${width}px`;
    const widthBufferLeftString = `${widthBufferLeft}px`;
    const heightString = `${height}px`;
    const heightBufferHalfString = `${heightBuffer / 2}px`;

    this.fontSize = 16;
    const fontSizeDefault = `${this.fontSize}px`;
    const fontSizeGroupHeader = `${this.fontSize - 3}px`;
    const fontSizeText = `${this.fontSize - 1}px`;
    const fontSizeOption = `${this.fontSize + 1}px`;

    this.customStyles = {
      container: base => ({
        ...base,
        position: 'absolute',
        color: theme.color.primary.default,
        fontFamily: theme.font.default,
        fontSize: fontSizeDefault,
        fontWeight: theme.fontWeight.normal,
        letterSpacing: theme.letterSpacing.default,
        lineHeight: theme.lineHeight.default,
      }),
      valueContainer: base => ({
        ...base,
        overflow: 'hidden',
        padding: '0',
        margin: '2px 8px',
      }),
      control: (base, state) => ({
        ...base,
        overflow: 'hidden',
        width: widthString,
        height: heightString,
        borderWidth: '2px',
        borderColor: state.isFocused ? theme.color.secondary.default : theme.color.primary.border,
        borderRadius: '30px',
        boxShadow: 'none',
        ':hover': {
          borderWidth: '2px',
          borderRadius: '30px',
          borderColor: theme.color.secondary.default,
        },
      }),
      indicatorSeparator: () => null,
      dropdownIndicator: base => ({
        ...base,
        color: theme.color.primary.border,
        ':hover': {
          color: theme.color.primary.default,
        },
        ':focus': {
          color: theme.color.primary.default,
        },
      }),
      placeholder: base => ({
        ...base,
        paddingLeft: widthBufferLeftString,
      }),
      input: base => ({
        ...base,
        whiteSpace: 'nowrap',
        paddingLeft: widthBufferLeftString,
        color: theme.color.primary.default,
        fontFamily: theme.font.text,
        fontSize: fontSizeText,
        fontWeight: theme.font.normal,
        letterSpacing: theme.letterSpacing.default,
        lineHeight: theme.lineHeight.default,
      }),
      menuList: base => ({
        ...base,
        padding: '0px',
      }),
      groupHeading: base => ({
        ...base,
        fontFamily: theme.font.button,
        fontSize: fontSizeGroupHeader,
        fontWeight: theme.fontWeight.normal,
        marginBottom: heightBufferHalfString,
      }),
      group: base => ({
        ...base,
        paddingTop: '0px',
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? theme.color.background.green : 'transparent',
        color: theme.color.primary.default,
        fontSize: fontSizeOption,
        fontWeight: theme.fontWeight.light,
      }),
    };

    this.state = {
      inputValue: '',
    };

    this.inputTime = null;
  }

  addGroups = (securities) => {
    const groups = [];

    securities.forEach((security) => {
      const groupLabels = groups.map(group => group.label);
      const groupIndex = groupLabels.indexOf(security.category);

      if (security.category && groupIndex === -1) {
        groups.push({ label: security.category, options: [security] });
      } else if (security.category) {
        groups[groupIndex].options.push(security);
      } else {
        const otherIndex = groupLabels.indexOf('Other');

        if (otherIndex === -1) {
          groups.push({ label: 'Other', options: [security] });
        } else {
          groups[otherIndex].options.push(security);
        }
      }
    });

    return groups;
  };

  loadOptions = async (inputValue) => {
    const { inputLagTime } = this.props;
    const currentTime = new Date();

    await new Promise(resolve => setTimeout(resolve, inputLagTime));

    if (currentTime - this.inputTime > 0) {
      try {
        // altered for github pages demo
        const search = inputValue.toLowerCase();

        const securities = demoSecurities.filter((security) => {
          const {
            tickerCusip, name, category, exchange,
          } = security;

          if (tickerCusip.toLowerCase().includes(search)
          || name.toLowerCase().includes(search)
          || category.toLowerCase().includes(search)
          || exchange.toLowerCase().includes(search)) {
            return true;
          }

          return false;
        });

        // const response = await axios.get(URLs.SECURITIES_SEARCH, {
        //   params: {
        //     search: inputValue.toLowerCase(),
        //   },
        //   ...axiosConfig.DB,
        // });
        //
        // const { securities } = response.data.body;

        if (
          !securities
          || typeof securities !== 'object'
          || securities.constructor !== Array
          || securities.length === 0
        ) {
          return null;
        }

        return this.addGroups(securities);
      } catch (errorCatch) {
        // const error = handleErrorCatch(errorCatch);
        //
        // raven.captureException(error, {
        //   logger: 'loadOptions',
        // });
      }
    }

    return null;
  };

  handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/(?![-&])\W/g, '');
    this.inputTime = new Date();

    this.setState({ inputValue });
    return inputValue;
  };

  handleValueSelect = (option) => {
    const { statusWatchlist } = this.props;

    if (
      statusWatchlist[statusNames.SECURITIES].status !== requestStatusTypes.LOADING
      && statusWatchlist[statusNames.UPDATE_SECURITIES].status !== requestStatusTypes.LOADING
      && option.id
    ) {
      const { match, pageBodiesCurrent, securities } = this.props;
      const { path } = match;

      if (securities.list.indexOf(option.id) === -1) {
        const {
          handleSecurity,
          handleSecuritiesList,
          handleSecurityData,
          handleUpdateSecurities,
        } = this.props;
        const {
          id,
          name,
          exchange,
          tickerCusip,
          category,
        } = option;
        const security = {
          id,
          name,
          exchange,
          tickerCusip,
          category,
        };

        handleSecurity(security);
        handleSecuritiesList({ list: [...securities.list, option.id] });
        handleSecurityData({ id, tickerCusip });
        handleUpdateSecurities();
      }

      if (path !== pathNames.WATCHLIST_SECURITY_ID || securities.current !== option.id) {
        this.props.history.push(`${pathNames.WATCHLIST}/${option.id}`);
      }
      if (pageBodiesCurrent !== pageBodyNames.WATCHLIST) {
        this.props.handleCurrentPageBody({ current: pageBodyNames.WATCHLIST });
      }
    }
  };

  renderDropdownIndicator = props => (
    <components.DropdownIndicator {...props}>
      <Icon icon="search" />
    </components.DropdownIndicator>
  );

  renderLoadingIndicator = () => (
    <div style={{ margin: '0 0 3px 4px' }}>
      <BeatLoader color={theme.color.secondary.default} size="5px" />
    </div>
  );

  renderOption = (option) => {
    const { name, exchange, tickerCusip } = option.data;
    let exchangeTickerCusip = null;
    if (exchange) {
      exchangeTickerCusip = `(${exchange}: ${tickerCusip})`;
    } else {
      exchangeTickerCusip = `(${tickerCusip})`;
    }

    return (
      <components.Option {...option}>
        <div>
          {name}
        </div>
        <div style={{ fontSize: '0.8em' }}>
          {exchangeTickerCusip}
        </div>
      </components.Option>
    );
  };

  render() {
    const { inputValue } = this.state;

    return (
      <AsyncSelect
        styles={this.customStyles}
        components={{
          Option: this.renderOption,
          LoadingIndicator: this.renderLoadingIndicator,
          DropdownIndicator: this.renderDropdownIndicator,
        }}
        placeholder=""
        escapeClearsValue
        inputValue={inputValue}
        onInputChange={this.handleInputChange}
        loadOptions={this.loadOptions}
        onChange={this.handleValueSelect}
      />
    );
  }
}

SearchBarContainer.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  inputLagTime: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  heightBuffer: PropTypes.number.isRequired,
  statusWatchlist: PropTypes.object.isRequired,
  pageBodiesCurrent: PropTypes.string.isRequired,
  securities: PropTypes.object.isRequired,
  handleCurrentPageBody: PropTypes.func.isRequired,
  handleSecurity: PropTypes.func.isRequired,
  handleSecuritiesCurrent: PropTypes.func.isRequired,
  handleSecuritiesList: PropTypes.func.isRequired,
  handleSecurityData: PropTypes.func.isRequired,
  handleUpdateSecurities: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  match: ownProps.match,
  history: ownProps.history,
  inputLagTime: state.ui.internal.utilities.menuSearchBar.inputLagTime,
  width: state.ui.internal.utilities.menuSearchBar.width,
  height: state.ui.internal.utilities.menuSearchBar.height,
  statusWatchlist: state.data.watchlist.status,
  heightBuffer: state.ui.internal.utilities.menuSearchBar.heightBuffer,
  pageBodiesCurrent: state.ui.internal.pageBodies.current,
  securities: state.data.watchlist.securities,
});

const mapDispatchToProps = dispatch => ({
  handleCurrentPageBody: payload => dispatch(setCurrentPageBody(payload)),
  handleSecurity: payload => dispatch(setSecurity(payload)),
  handleSecuritiesCurrent: payload => dispatch(setSecuritiesCurrent(payload)),
  handleSecuritiesList: payload => dispatch(setSecuritiesList(payload)),
  handleSecurityData: payload => dispatch(requestSecurityData(payload)),
  handleUpdateSecurities: () => dispatch(requestUpdateSecurities()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBarContainer));
