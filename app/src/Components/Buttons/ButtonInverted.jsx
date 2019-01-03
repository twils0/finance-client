import styled from 'styled-components';
import PropTypes from 'prop-types';

const ButtonInvertedStyle = styled.button`
  display: ${props => props.display || 'block'};

  transition: 0.1s color linear, 0.1s background linear, 0.1s border-color linear;

  text-align: ${props => props.textAlign};

  align-self: ${props => props.alignSelf};

  outline: none;
  &::-moz-focus-inner {
    border: 0;
  }

  box-sizing: ${props => props.borderBox || 'border-box'};
  white-space: ${props => props.whiteSpace || 'nowrap'};

  overflow: ${props => props.overflow || 'hidden'};
  text-overflow: ${props => props.textOverflow};

  padding: ${props => props.padding || 'calc(1em - 2px) 2.5em'};
  margin: ${props => props.margin};

  width: ${props => props.width};
  height: ${props => props.height};

  font-family: ${props => props.fontFamily || props.theme.font[props.themeFont] || 'sans-serif'};
  font-size: ${props => props.fontSize || props.theme.size.font[props.themeSize]};
  line-height: ${props => props.lineHeight || props.theme.lineHeight[props.themeLineHeight]};
  font-weight: ${props => props.fontWeight};

  text-transform: uppercase;
  letter-spacing: ${props => props.letterSpacing || props.theme.letterSpacing[props.themeLetterSpacing]};

  border-radius: ${props => props.borderRadius || '0px'};
  border-style: ${props => props.borderStyle || 'solid'};
  border-width: ${props => props.borderWidth || '2px'};

  background: ${props => props.background || props.theme.color.background[props.backgroundType]};
  color: ${props => props.color.default || props.theme.color[props.themeColor].default};
  border-color: ${props => props.color.default || props.theme.color[props.themeColor].default};

  &:hover {
    cursor: pointer;

    background: ${props => props.color.default || props.theme.color[props.themeColor].default};
    color: ${props => props.background || props.theme.color.background[props.backgroundType]};
    border-color: ${props => props.color.default || props.theme.color[props.themeColor].default};
  }

  &:disabled {
    background: ${props => props.color.disabled || props.theme.color[props.themeColor].disabled};
    color: ${props => props.background || props.theme.color.background[props.backgroundType]};
    border-color: ${props => props.color.disabled || props.theme.color[props.themeColor].disabled};
  }
`;

ButtonInvertedStyle.propTypes = {
  themeColor: PropTypes.string,
  backgroundType: PropTypes.string,
  themeSize: PropTypes.string,
  themeFont: PropTypes.string,
  themeLineHeight: PropTypes.string,
  themeLetterSpacing: PropTypes.string,

  display: PropTypes.string,
  flex: PropTypes.string,

  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,

  textAlign: PropTypes.string,

  alignSelf: PropTypes.string,

  boxSizing: PropTypes.string,
  whiteSpace: PropTypes.string,

  overflow: PropTypes.string,
  textOverflow: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  fontFamily: PropTypes.string,
  fontSize: PropTypes.string,
  lineHeight: PropTypes.string,
  fontWeight: PropTypes.string,

  letterSpacing: PropTypes.string,

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

ButtonInvertedStyle.defaultProps = {
  themeColor: 'primary',
  backgroundType: 'default',
  themeSize: 'button',
  themeFont: 'button',
  themeLineHeight: 'default',
  themeLetterSpacing: 'button',

  display: null,
  flex: null,

  alignItems: null,
  justifyContent: null,

  textAlign: null,

  alignSelf: null,

  boxSizing: null,
  whiteSpace: null,

  overflow: null,
  textOverflow: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  fontFamily: null,
  fontSize: null,
  lineHeight: null,
  fontWeight: null,

  letterSpacing: null,

  borderRadius: null,
  borderStyle: null,
  borderWidth: null,

  background: null,
  color: {},
};

export default ButtonInvertedStyle;
