import styled from 'styled-components';
import PropTypes from 'prop-types';

const List = styled.div`
  position: ${props => props.position};

  overflow-x: ${props => props.overflowX || 'hidden'};
  overflow-y: ${props => props.overflowY || 'auto'};

  align-self: ${props => props.alignSelf};

  outline: none;
  &::-moz-focus-inner {
    border: 0;
  }
  user-select: none;

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width};
  height: ${props => props.height};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    width: ${props => props.responsiveWidth};
    padding: ${props => props.responsivePadding};
  }

  border-radius: ${props => props.borderRadius};
  border-style: ${props => props.borderStyle};
  border-width: ${props => props.borderWidth};

  background: ${props => props.background || 'transparent'};
  border-color: ${props => props.color[props.borderColorType]
    || props.theme.color[props.themeColor][props.borderColorType]};
`;

List.propTypes = {
  themeColor: PropTypes.string,

  position: PropTypes.string,

  overflowX: PropTypes.string,
  overflowY: PropTypes.string,

  alignSelf: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  mediaWidth: PropTypes.string,

  responsiveWidth: PropTypes.string,
  responsivePadding: PropTypes.string,

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

List.defaultProps = {
  themeColor: 'primary',
  borderColorType: 'border',

  position: null,

  overflowX: null,
  overflowY: null,

  alignSelf: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  mediaWidth: null,

  responsiveWidth: null,
  responsivePadding: null,

  borderRadius: null,
  borderStyle: null,
  borderWidth: null,

  background: null,
  color: {},
};

export default List;
