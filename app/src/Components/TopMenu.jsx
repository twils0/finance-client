import styled from 'styled-components';
import PropTypes from 'prop-types';

const Menu = styled.div`
  display: flex;

  flex: ${props => props.flex || '0 0 auto'};
  flex-direction: ${props => props.flexDirection || 'row'};
  flex-wrap: no-wrap;

  align-securities: ${props => props.alignItems};
  justify-content: ${props => props.justifyContent};

  overflow-x: hidden;
  overflow-y: hidden;

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width || '100%'};
  height: ${props => props.height};

  min-width: ${props => props.minWidth};
  min-height: ${props => props.minHeight || 'min-content'};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    flex-direction: ${props => props.flexDirection || 'column'};
    overflow: visible;
    height: auto;
  }

  border-radius: ${props => props.borderRadius || '0px'};
  border-style: ${props => props.borderStyle || 'solid'};
  border-width: ${props => props.borderWidth || '0px'};

  background: ${props => props.background || 'transparent'};
  background-size: cover;
  border-color: ${props => props.color[props.borderColorType]
    || props.theme.color[props.themeColor][props.borderColorType]};
`;

Menu.propTypes = {
  themeColor: PropTypes.string,
  borderColorType: PropTypes.string,

  flex: PropTypes.string,
  flexDirection: PropTypes.string,

  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  minWidth: PropTypes.string,
  minHeight: PropTypes.string,

  mediaWidth: PropTypes.string,

  borderRadius: PropTypes.string,
  borderStyle: PropTypes.string,
  borderWidth: PropTypes.string,

  background: PropTypes.string,
  color: PropTypes.shape({
    default: PropTypes.string,
    border: PropTypes.string,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    selected: PropTypes.string,
    disabled: PropTypes.string,
  }),
};

Menu.defaultProps = {
  themeColor: 'primary',
  borderColorType: 'border',

  flex: null,
  flexDirection: null,

  alignItems: null,
  justifyContent: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  minWidth: null,
  minHeight: null,

  mediaWidth: null,

  borderRadius: null,
  borderStyle: null,
  borderWidth: null,

  background: null,
  color: {},
};

export default Menu;
