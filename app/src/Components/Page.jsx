import styled from 'styled-components';
import PropTypes from 'prop-types';

const Page = styled.div`
  display: block;

  overflow-x: ${props => props.overflowX || 'hidden'};
  overflow-y: ${props => props.overflowY || 'auto'};

  background: ${props => props.background || props.theme.color.background[props.backgroundType]};

  -webkit-tap-highlight-color: transparent;

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100%'};

  min-width: ${props => props.minWidth};
  min-height: ${props => props.minHeight || 'min-content'};
`;

Page.propTypes = {
  backgroundType: PropTypes.string,

  flex: PropTypes.string,
  flexDirection: PropTypes.string,

  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,

  overflowX: PropTypes.string,
  overflowY: PropTypes.string,

  background: PropTypes.string,
  noBackgroundImage: PropTypes.bool,
  backgroundImage: PropTypes.element,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  minWidth: PropTypes.string,
  minHeight: PropTypes.string,
};

Page.defaultProps = {
  backgroundType: 'default',

  flex: null,
  flexDirection: null,

  alignItems: null,
  justifyContent: null,

  overflowX: null,
  overflowY: null,

  background: null,
  noBackgroundImage: false,
  backgroundImage: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  minWidth: null,
  minHeight: null,
};

export default Page;
