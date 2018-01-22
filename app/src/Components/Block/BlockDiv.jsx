import styled from 'styled-components';
import PropTypes from 'prop-types';

const FlexColumn = styled.div`
  position: ${props => props.position || 'relative'};
  display: ${props => props.display || 'block'};

  overflow-x: ${props => props.overflowX};
  overflow-y: ${props => props.overflowY};

  align-self: ${props => props.alignSelf};

  box-sizing: ${props => props.borderBox || 'border-box'};

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width};
  height: ${props => props.height};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    position: ${props => props.responsivePosition || 'relative'};
    margin: ${props => props.responsiveMargin};
    padding: ${props => props.responsivePadding};
    width: ${props => props.responsiveWidth};
    height: ${props => props.responsiveHeight};
  }

  min-width: ${props => props.minWidth};
  min-height: ${props => props.minHeight};

  border-radius: ${props => props.borderRadius || '0px'};
  border-style: ${props => props.borderStyle || 'solid'};
  border-width: ${props => props.borderWidth || '0px'};

  background: transparent;
  border-color: ${props =>
    (props.errorMessage
      ? props.theme.color.invalid[props.borderColorType]
      : props.color[props.borderColorType] ||
        props.theme.color[props.themeColor][props.borderColorType])};
`;

FlexColumn.propTypes = {
  themeColor: PropTypes.string,
  borderColorType: PropTypes.string,

  position: PropTypes.string,
  display: PropTypes.string,

  overflowX: PropTypes.string,
  overflowY: PropTypes.string,

  alignSelf: PropTypes.string,

  boxSizing: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  minWidth: PropTypes.string,
  minHeight: PropTypes.string,

  mediaWidth: PropTypes.string,
  responsivePosition: PropTypes.string,
  responsiveMargin: PropTypes.string,
  responsivePadding: PropTypes.string,
  responsiveWidth: PropTypes.string,
  responsiveHeight: PropTypes.string,

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

FlexColumn.defaultProps = {
  themeColor: 'primary',
  borderColorType: 'border',

  position: null,
  display: null,

  overflowX: null,
  overflowY: null,

  alignSelf: null,

  boxSizing: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  minWidth: null,
  minHeight: null,

  mediaWidth: null,
  responsivePosition: null,
  responsiveMargin: null,
  responsivePadding: null,
  responsiveWidth: null,
  responsiveHeight: null,

  borderRadius: null,
  borderStyle: null,
  borderWidth: null,

  color: {},
};

export default FlexColumn;
