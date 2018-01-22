import styled from 'styled-components';
import PropTypes from 'prop-types';

const InputStyle = styled.input`
  display: ${props => props.display || 'block'};

  align-self: ${props => props.alignSelf};

  outline: none;
  box-sizing: ${props => props.borderBox || 'border-box'};
  white-space: ${props => props.whiteSpace};
  -webkit-transform: translateZ(0px);

  padding: ${props => props.padding || 'calc(1em - 1px)'};
  margin: ${props => props.margin};

  width: ${props => props.width || '100%'};
  height: ${props => props.height};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    font-size: ${props => props.responsiveFontSize || props.theme.size.font.mobileText};
  }

  font-family: ${props => props.fontFamily || props.theme.font[props.themeFont] || 'sans-serif'};
  font-size: ${props => props.fontSize || props.theme.size.font[props.themeSize]};
  line-height: ${props => props.lineHeight || props.theme.lineHeight[props.themeLineHeight]};
  font-weight: ${props => props.fontWeight || props.theme.fontWeight[props.themeFontWeight]};

  border-radius: ${props => props.borderRadius || '2px'};
  border-style: ${props => props.borderStyle || 'solid'};
  border-width: ${props => props.borderWidth || '1px'};

  background: ${props => props.background || props.theme.color.background[props.backgroundType]};
  color: ${props => props.color[props.colorType] || props.theme.color[props.themeColor][props.colorType]};
  border-color: ${props => (props.errorMessage
    ? props.theme.color.invalid[props.borderColorType]
    : props.color[props.borderColorType]
        || props.theme.color[props.themeColor][props.borderColorType])};

  &:placeholder {
    color: ${props => props.color.placeholder || props.theme.color[props.themeColor].placeholder};
  }

  &:disabled {
    color: ${props => props.color.disabled || props.theme.color[props.themeColor].disabled};
  }

  &:invalid {
    box-shadow: none;
  }
`;

InputStyle.propTypes = {
  id: PropTypes.string,
  tabIndex: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  errorMessage: PropTypes.string,

  themeColor: PropTypes.string,
  colorType: PropTypes.string,
  backgroundType: PropTypes.string,
  borderColorType: PropTypes.string,
  themeSize: PropTypes.string,
  themeFont: PropTypes.string,
  themeLineHeight: PropTypes.string,
  themeFontWeight: PropTypes.string,

  display: PropTypes.string,

  alignSelf: PropTypes.string,

  boxSizing: PropTypes.string,
  whiteSpace: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  mediaWidth: PropTypes.string,

  responsiveFontSize: PropTypes.string,

  fontFamily: PropTypes.string,
  fontSize: PropTypes.string,
  lineHeight: PropTypes.string,
  fontWeight: PropTypes.number,

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

InputStyle.defaultProps = {
  id: null,
  tabIndex: null,
  type: 'text',
  value: '',
  errorMessage: '',

  themeColor: 'primary',
  colorType: 'text',
  backgroundType: 'default',
  borderColorType: 'border',
  themeSize: 'text',
  themeFont: 'text',
  themeLineHeight: 'input',
  themeFontWeight: 'normal',

  display: null,

  alignSelf: null,

  boxSizing: null,
  whiteSpace: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  mediaWidth: null,

  responsiveFontSize: null,

  fontFamily: null,
  fontSize: null,
  lineHeight: null,
  fontWeight: null,

  borderRadius: null,
  borderStyle: null,
  borderWidth: null,

  background: null,
  color: {},
};

export default InputStyle;
