import styled from 'styled-components';
import PropTypes from 'prop-types';

const ErrorStyle = styled.small`
  display: ${props => (props.display || props.errorMessage ? 'block' : 'none')};
  flex: ${props => props.flex};

  text-align: ${props => props.textAlign || 'left'};

  align-self: ${props => props.alignSelf};

  outline: none;
  box-sizing: ${props => props.borderBox || 'border-box'};
  white-space: ${props => props.whiteSpace};

  padding: ${props => props.padding};
  margin: ${props => props.margin || '10px 0 0 0'};

  width: ${props => props.width || '100%'};
  height: ${props => props.height};

  font-family: ${props => props.fontFamily || props.theme.font[props.themeFont] || 'sans-serif'};
  font-size: ${props => props.fontSize || props.theme.size.font[props.themeSize]};
  line-height: ${props => props.lineHeight || props.theme.lineHeight[props.themeLineHeight]};
  font-weight: ${props => props.fontWeight || props.theme.fontWeight[props.themeFontWeight]};

  background: ${props => props.background || 'transparent'};
  color: ${props =>
    props.color[props.colorType] || props.theme.color[props.themeColor][props.colorType]};
`;

ErrorStyle.propTypes = {
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

ErrorStyle.defaultProps = {
  errorMessage: '',

  themeColor: 'invalid',
  colorType: 'default',
  themeSize: 'errorMessage',
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

export default ErrorStyle;
