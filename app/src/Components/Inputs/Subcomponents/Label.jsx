import styled from 'styled-components';
import PropTypes from 'prop-types';

const LabelStyle = styled.label`
  display: ${props => props.display || (props.label ? 'block' : 'none')};
  flex: ${props => props.flex};

  text-align: ${props => props.textAlign || 'left'};

  align-self: ${props => props.alignSelf};

  outline: none;
  box-sizing: ${props => props.borderBox || 'border-box'};
  white-space: ${props => props.whiteSpace || 'nowrap'};

  padding: ${props => props.padding};
  margin: ${props => props.margin || '0 0 7px 0'};

  width: ${props => props.width || '100%'};
  height: ${props => props.height};

  font-family: ${props => props.fontFamily || props.theme.font[props.themeFont] || 'sans-serif'};
  font-size: ${props => props.fontSize || props.theme.size.font[props.themeSize]};
  line-height: ${props => props.lineHeight || props.theme.lineHeight[props.themeLineHeight]};
  font-weight: ${props => props.fontWeight || props.theme.fontWeight[props.themeFontWeight]};

  background: ${props => props.background || 'transparent'};
  color: ${props =>
    (props.color.default || props.errorMessage
      ? props.theme.color.invalid.default
      : props.theme.color[props.themeColor].default)};
`;

LabelStyle.propTypes = {
  label: PropTypes.string,
  htmlFor: PropTypes.string,
  errorMessage: PropTypes.string,

  themeColor: PropTypes.string,
  themeSize: PropTypes.string,
  themeFont: PropTypes.string,
  themeLineHeight: PropTypes.string,
  themeFontWeight: PropTypes.string,

  display: PropTypes.string,
  flex: PropTypes.string,

  textAlign: PropTypes.string,

  alignSelf: PropTypes.string,

  boxSizing: PropTypes.string,
  whiteSpace: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  fontFamily: PropTypes.string,
  fontSize: PropTypes.string,
  lineHeight: PropTypes.string,
  fontWeight: PropTypes.number,

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

LabelStyle.defaultProps = {
  label: '',
  htmlFor: null,
  errorMessage: '',

  themeColor: 'primary',
  themeSize: 'label',
  themeFont: 'default',
  themeLineHeight: 'default',
  themeFontWeight: 'light',

  display: null,
  flex: null,

  textAlign: null,

  alignSelf: null,

  boxSizing: null,
  whiteSpace: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  fontFamily: null,
  fontSize: null,
  lineHeight: null,
  fontWeight: null,

  background: null,
  color: {},
};

export default LabelStyle;
