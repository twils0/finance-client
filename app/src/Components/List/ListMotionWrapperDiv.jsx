import styled from 'styled-components';
import PropTypes from 'prop-types';

const ListMotionWrapperDiv = styled.div`
  position: ${props => props.position || 'relative'};
  display: block;

  align-self: ${props => props.alignSelf};

  box-sizing: ${props => props.borderBox || 'border-box'};

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width};
  height: ${props => props.height};

  min-width: ${props => props.minWidth};
  min-height: ${props => props.minHeight || 'min-content'};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    width: ${props => props.responsiveWidth || '300px'};
    height: ${props => props.responsiveHeight};
    margin: ${props => props.responsiveMargin};
  }

  border-radius: ${props => props.borderRadius || '0px'};
  border-style: ${props => props.borderStyle || 'solid'};
  border-width: ${props => props.borderWidth};

  border-color: ${props => props.color[props.borderColorType]
    || props.theme.color[props.themeColor][props.borderColorType]};
`;

ListMotionWrapperDiv.propTypes = {
  themeColor: PropTypes.string,
  borderColorType: PropTypes.string,

  position: PropTypes.string,

  alignSelf: PropTypes.string,

  boxSizing: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  mediaWidth: PropTypes.string,

  responsiveWidth: PropTypes.string,
  responsiveHeight: PropTypes.string,
  responsiveMargin: PropTypes.string,

  minWidth: PropTypes.string,
  minHeight: PropTypes.string,

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

ListMotionWrapperDiv.defaultProps = {
  themeColor: 'primary',
  borderColorType: 'border',

  position: null,

  alignSelf: null,

  boxSizing: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  mediaWidth: null,

  responsiveWidth: null,
  responsiveHeight: null,
  responsiveMargin: null,

  minWidth: null,
  minHeight: null,

  borderRadius: null,
  borderStyle: null,
  borderWidth: null,

  color: {},
};

export default ListMotionWrapperDiv;
