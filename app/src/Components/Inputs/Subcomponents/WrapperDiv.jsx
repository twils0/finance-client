import styled from 'styled-components';
import PropTypes from 'prop-types';

const WrapperDiv = styled.div`
  display: ${props => props.display || 'flex'};
  flex: ${props => props.flex};
  flex-direction: column;

  align-securities: ${props => props.alignItems || 'flex-start'};
  justify-content: ${props => props.justifyContent || 'center'};

  align-self: ${props => props.alignSelf};

  box-sizing: ${props => props.boxSizing || 'border-box'};

  margin: ${props => props.margin};
  padding: ${props => props.padding};

  width: ${props => props.width};
  height: ${props => props.height};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    width: ${props => props.responsiveWidth};
    margin: ${props => props.responsiveMargin};
    padding: ${props => props.responsivePadding};
  }
`;

WrapperDiv.propTypes = {
  themeColor: PropTypes.string,
  themeSize: PropTypes.string,
  themeFont: PropTypes.string,

  display: PropTypes.string,
  flex: PropTypes.string,

  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,

  alignSelf: PropTypes.string,

  boxSizing: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  mediaWidth: PropTypes.string,
  responsiveWidth: PropTypes.string,
  responsiveMargin: PropTypes.string,
  responsivePadding: PropTypes.string,
};

WrapperDiv.defaultProps = {
  display: null,
  flex: null,

  alignItems: null,
  justifyContent: null,

  alignSelf: null,

  boxSizing: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  mediaWidth: null,
  responsiveWidth: null,
  responsiveMargin: null,
  responsivePadding: null,
};

export default WrapperDiv;
