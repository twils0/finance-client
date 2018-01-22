import styled from 'styled-components';
import PropTypes from 'prop-types';

const P = styled.p`
  display: ${props => props.display || 'block'};

  flex: ${props => props.flex};
  flex-direction: ${props => props.flexDirection};
  flex-wrap: ${props => props.flexWrap};

  alignsecurities: ${props => props.alignItems};
  justifycontent: ${props => props.justifyContent};
  text-align: ${props => props.textAlign};

  align-self: ${props => props.alignSelf};

  outline: none;
  box-sizing: ${props => props.borderBox || 'border-box'};
  white-space: ${props => props.whiteSpace || 'pre-wrap'};

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width};
  min-width: ${props => props.minWidth};
  height: ${props => props.height};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    font-size: ${props => props.theme.size.font[props.responsiveThemeFont]
      || props.fontSize
      || props.theme.size.font[props.themeSize]};
    width: ${props => props.responsiveWidth};
  }

  font-family: ${props => props.fontFamily || props.theme.font[props.themeFont] || 'sans-serif'};
  font-size: ${props => props.fontSize || props.theme.size.font[props.themeSize]};
  line-height: ${props => props.lineHeight || props.theme.lineHeight[props.themeLineHeight]};
  font-weight: ${props => props.fontWeight || props.theme.fontWeight[props.themeFontWeight]};

  letter-spacing: ${props => props.letterSpacing || props.theme.letterSpacing[props.themeLetterSpacing]};

  border-radius: ${props => props.borderRadius};
  border-style: ${props => props.borderStyle};
  border-width: ${props => props.borderWidth};

  background: ${props => props.background || 'transparent'};
  color: ${props => props.color[props.colorType] || props.theme.color[props.themeColor][props.colorType]};
  border-color: ${props => props.color[props.borderColorType]
    || props.theme.color[props.themeColor][props.borderColorType]};
`;

P.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,

  themeColor: PropTypes.string,
  colorType: PropTypes.string,
  borderColorType: PropTypes.string,
  themeSize: PropTypes.string,
  themeFont: PropTypes.string,
  themeFontWeight: PropTypes.string,
  themeLineHeight: PropTypes.string,
  themeLetterSpacing: PropTypes.string,

  display: PropTypes.string,

  flex: PropTypes.string,
  flexDirection: PropTypes.string,
  flexWrap: PropTypes.string,

  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
  textAlign: PropTypes.string,

  alignSelf: PropTypes.string,

  boxSizing: PropTypes.string,
  whiteSpace: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  minWidth: PropTypes.string,
  height: PropTypes.string,

  mediaWidth: PropTypes.string,

  responsiveThemeFont: PropTypes.string,
  responsiveWidth: PropTypes.string,

  fontFamily: PropTypes.string,
  fontSize: PropTypes.string,
  lineHeight: PropTypes.string,
  fontWeight: PropTypes.number,

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

P.defaultProps = {
  id: null,
  type: 'text',

  themeColor: 'primary',
  colorType: 'dark',
  borderColorType: 'border',
  themeSize: 'paragraph',
  themeFont: 'default',
  themeFontWeight: 'light',
  themeLineHeight: 'default',
  themeLetterSpacing: 'default',

  display: null,
  flex: null,
  flexDirection: null,
  flexWrap: null,

  alignItems: null,
  justifyContent: null,
  textAlign: null,

  alignSelf: null,

  boxSizing: null,
  whiteSpace: null,

  padding: null,
  margin: null,

  width: null,
  minWidth: null,
  height: null,

  mediaWidth: null,

  responsiveThemeFont: null,
  responsiveWidth: null,

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

export default P;
