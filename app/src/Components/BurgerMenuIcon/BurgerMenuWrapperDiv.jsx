import styled from 'styled-components';
import PropTypes from 'prop-types';
import { lighten } from 'polished';

const BurgerMenuWrapperDiv = styled.div`
  position: ${props => props.position || 'absolute'};

  display: flex;
  flex: ${props => props.flex};
  flex-direction: ${props => props.flexDirection || 'column'};

  align-self: ${props => props.alignSelf};
  align-items: ${props => props.alignItems || 'center'};
  justify-content: ${props => props.justifyContent || 'center'};

  top: ${props => props.top};
  right: ${props => props.right};

  overflow-x: ${props => props.overflowX || 'hidden'};
  overflow-y: ${props => props.overflowY || 'hidden'};

  outline: none;
  &::-moz-focus-inner {
    border: 0;
  }
  user-select: none;

  box-sizing: border-box;

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width};
  height: ${props => props.height};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    width: ${props => props.responsiveWidth};
  }

  border-radius: ${props => props.borderRadius || '0px'};
  border-style: ${props => props.borderStyle || 'solid'};
  border-width: ${props => props.borderWidth || '0px'};

  background: ${props => props.background || 'transparent'};
  border-color: ${props => props.color[props.colorType]
    || lighten(0.1, props.theme.color[props.themeColor][props.colorType])};
`;

BurgerMenuWrapperDiv.propTypes = {
  themeColor: PropTypes.string,
  colorType: PropTypes.string,

  position: PropTypes.string,

  flex: PropTypes.string,
  flexDirection: PropTypes.string,

  alignSelf: PropTypes.string,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,

  top: PropTypes.string,
  right: PropTypes.string,

  overflowX: PropTypes.string,
  overflowY: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

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

BurgerMenuWrapperDiv.defaultProps = {
  themeColor: 'primary',
  colorType: 'border',

  position: null,

  flex: null,
  flexDirection: null,

  alignSelf: null,
  alignItems: null,
  justifyContent: null,

  top: null,
  right: null,

  overflowX: null,
  overflowY: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  borderRadius: null,
  borderStyle: null,
  borderWidth: null,

  background: null,
  color: {},
};

export default BurgerMenuWrapperDiv;
