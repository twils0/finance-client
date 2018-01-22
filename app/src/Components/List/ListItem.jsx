import styled from 'styled-components';
import PropTypes from 'prop-types';

const ListItem = styled.div`
  position: ${props => props.position};
  display: flex;

  flex: ${props => props.flex};
  flex-direction: ${props => props.flexDirection || 'row'};

  align-securities: ${props => props.alignItems || 'center'};
  justify-content: ${props => props.justifyContent || 'flex-start'};

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

  width: ${props => props.width || 'calc(100% - 2px)'};
  height: ${props => props.height};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    width: ${props => props.responsiveWidth};
    padding: ${props => props.responsivePadding};
  }

  font-family: ${props => props.fontFamily || props.theme.font[props.themeFont] || 'sans-serif'};
  font-size: ${props => props.fontSize || props.theme.size.font[props.themeSize]};
  line-height: ${props => props.lineHeight || props.theme.lineHeight[props.themeLineHeight]};
  font-weight: ${props => props.fontWeight || props.theme.fontWeight[props.themeFontWeight]};

  letter-spacing: ${props => props.letterSpacing || props.theme.letterSpacing[props.themeLetterSpacing]};

  border-radius: ${props => props.borderRadius || '0px'};
  border-style: ${props => props.borderStyle || 'solid'};
  border-width: ${props => props.borderWidth || '1px'};

  background: ${props => props.background || props.theme.color.background[props.backgroundType]};
  color: ${props => props.color[props.colorType] || props.theme.color[props.themeColor][props.colorType]};
  border-color: ${props => props.color[props.borderColorType]
    || props.theme.color[props.themeColor][props.borderColorType]};
`;

ListItem.propTypes = {
  themeColor: PropTypes.string,
  colorType: PropTypes.string,
  backgroundType: PropTypes.string,
  borderColorType: PropTypes.string,
  themeSize: PropTypes.string,
  themeFont: PropTypes.string,
  themeFontWeight: PropTypes.string,
  themeLineHeight: PropTypes.string,
  themeLetterSpacing: PropTypes.string,

  position: PropTypes.string,

  flex: PropTypes.string,
  flexDirection: PropTypes.string,

  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,

  overflowX: PropTypes.string,
  overflowY: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  mediaWidth: PropTypes.string,
  responsiveWidth: PropTypes.string,
  responsivePadding: PropTypes.string,

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

ListItem.defaultProps = {
  themeColor: 'primary',
  colorType: 'default',
  backgroundType: 'default',
  borderColorType: 'border',
  themeSize: 'default',
  themeFont: 'default',
  themeFontWeight: 'normal',
  themeLineHeight: 'default',
  themeLetterSpacing: 'default',

  position: null,

  flex: null,
  flexDirection: null,

  alignItems: null,
  justifyContent: null,

  overflowX: null,
  overflowY: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  mediaWidth: null,
  responsiveWidth: null,
  responsivePadding: null,

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

export default ListItem;
