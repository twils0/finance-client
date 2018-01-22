import styled from 'styled-components';
import PropTypes from 'prop-types';

const FlexRow = styled.div`
  position: ${props => props.position || 'relative'};
  display: ${props => props.display || 'flex'};

  flex: ${props => props.flex};
  flex-direction: row;
  flex-wrap: ${props => props.flexWrap || 'wrap'};

  top: ${props => props.top};
  left: ${props => props.left};

  overflow-x: ${props => props.overflowX};
  overflow-y: ${props => props.overflowY};

  align-securities: ${props => props.alignItems || 'center'};
  justify-content: ${props => props.justifyContent || 'center'};

  align-self: ${props => props.alignSelf};

  box-sizing: ${props => props.borderBox || 'border-box'};
  text-align: none;

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width};
  height: ${props => props.height};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    position: ${props => props.responsivePosition || 'relative'};
    align-securities: ${props => props.responsiveAlignSecurities};
    justify-content: ${props => props.responsiveJustifyContent};
    padding: ${props => props.responsivePadding};
    margin: ${props => props.responsiveMargin};
    width: ${props => props.responsiveWidth || '100%'};
  }

  min-width: ${props => props.minWidth};
  min-height: ${props => props.minHeight};

  border-radius: ${props => props.borderRadius || '0px'};
  border-style: ${props => props.borderStyle || 'solid'};
  border-width: ${props => props.borderWidth || '0px'};

  background: transparent;
  border-color: ${props => (props.errorMessage
    ? props.theme.color.invalid[props.borderColorType]
    : props.color[props.borderColorType]
        || props.theme.color[props.themeColor][props.borderColorType])};
`;

FlexRow.propTypes = {
  themeColor: PropTypes.string,
  borderColorType: PropTypes.string,

  position: PropTypes.string,
  display: PropTypes.string,
  flex: PropTypes.string,
  flexWrap: PropTypes.string,

  top: PropTypes.string,
  left: PropTypes.string,

  overflowX: PropTypes.string,
  overflowY: PropTypes.string,

  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,

  alignSelf: PropTypes.string,

  boxSizing: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  minWidth: PropTypes.string,
  minHeight: PropTypes.string,

  mediaWidth: PropTypes.string,
  responsiveAlignSecurities: PropTypes.string,
  responsiveJustifyContent: PropTypes.string,
  responsivePosition: PropTypes.string,
  responsivePadding: PropTypes.string,
  responsiveMargin: PropTypes.string,

  borderRadius: PropTypes.string,
  borderStyle: PropTypes.string,
  borderWidth: PropTypes.string,

  color: PropTypes.shape({
    default: PropTypes.string,
    border: PropTypes.string,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    selected: PropTypes.string,
    disabled: PropTypes.string,
  }),
};

FlexRow.defaultProps = {
  themeColor: 'primary',
  borderColorType: 'border',

  position: null,
  display: null,
  flex: null,
  flexWrap: null,

  top: null,
  left: null,

  overflowX: null,
  overflowY: null,

  alignItems: null,
  justifyContent: null,

  alignSelf: null,

  boxSizing: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  minWidth: null,
  minHeight: null,

  mediaWidth: null,
  responsiveAlignSecurities: null,
  responsiveJustifyContent: null,
  responsivePosition: null,
  responsivePadding: null,
  responsiveMargin: null,

  borderRadius: null,
  borderStyle: null,
  borderWidth: null,

  color: {},
};

export default FlexRow;
