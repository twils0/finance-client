import styled from 'styled-components';
import PropTypes from 'prop-types';
import { lighten } from 'polished';

const BurgerMenuBar = styled.div`
  position: ${props => props.position};

  align-self: ${props => props.alignSelf};

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

  background: ${props =>
    props.color[props.colorType] ||
    lighten(0.1, props.theme.color[props.themeColor][props.colorType])};
`;

BurgerMenuBar.propTypes = {
  themeColor: PropTypes.string,
  colorType: PropTypes.string,

  position: PropTypes.string,

  alignSelf: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  color: PropTypes.shape({
    default: PropTypes.string,
    border: PropTypes.string,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    selected: PropTypes.string,
    disabled: PropTypes.string,
  }),
};

BurgerMenuBar.defaultProps = {
  themeColor: 'primary',
  colorType: 'border',

  position: null,

  alignSelf: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  color: {},
};

export default BurgerMenuBar;
