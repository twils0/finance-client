import styled from 'styled-components';
import PropTypes from 'prop-types';

const Header2 = styled.h2`
  position: ${props => props.position};
  display: ${props => props.display || 'block'};

  text-align: ${props => props.textAlign};

  align-self: ${props => props.alignSelf};

  outline: none;
  box-sizing: ${props => props.borderBox || 'border-box'};
  white-space: ${props => props.whiteSpace || 'pre-wrap'};

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width};
  height: ${props => props.height};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    width: ${props => props.responsiveWidth};
    margin: ${props => props.responsiveMargin};
    padding: ${props => props.responsivePadding};
    text-align: ${props => props.responsiveTextAlign};
    justify-content: ${props => props.responsiveJustifyContent};
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

Header2.propTypes = {
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

  position: PropTypes.string,
  display: PropTypes.string,

  textAlign: PropTypes.string,

  alignSelf: PropTypes.string,

  boxSizing: PropTypes.string,
  whiteSpace: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  mediaWidth: PropTypes.string,
  responsiveWidth: PropTypes.string,
  responsiveMargin: PropTypes.string,
  responsivePadding: PropTypes.string,
  responsiveTextAlign: PropTypes.string,
  responsiveJustifyContent: PropTypes.string,

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

Header2.defaultProps = {
  id: null,
  type: 'text',

  themeColor: 'primary',
  colorType: 'default',
  borderColorType: 'border',
  themeSize: 'h2',
  themeFont: 'default',
  themeFontWeight: 'normal',
  themeLineHeight: 'default',
  themeLetterSpacing: 'default',

  position: null,
  display: null,

  textAlign: null,

  alignSelf: null,

  boxSizing: null,
  whiteSpace: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  mediaWidth: null,
  responsiveWidth: null,
  responsiveMargin: null,
  responsivePadding: null,
  responsiveTextAlign: null,
  responsiveJustifyContent: null,

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

export default Header2;
