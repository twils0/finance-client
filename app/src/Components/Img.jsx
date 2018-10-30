import styled from 'styled-components';
import PropTypes from 'prop-types';

const ImgStyle = styled.img`
  display: ${props => props.display || 'block'};

  align-self: ${props => props.alignSelf};

  box-sizing: ${props => props.borderBox || 'border-box'};

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};

  border-radius: ${props => props.borderRadius || '0px'};
  border-style: ${props => props.borderStyle || 'solid'};
  border-width: ${props => props.borderWidth || '0px'};

  border-color: ${props => props.color[props.borderColorType]
    || props.theme.color[props.themeColor][props.borderColorType]};
`;

ImgStyle.propTypes = {
  themeColor: PropTypes.string,
  borderColorType: PropTypes.string,

  display: PropTypes.string,
  flex: PropTypes.string,

  alignSelf: PropTypes.string,

  boxSizing: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  mediaWidth: PropTypes.string,
  height: PropTypes.string,
  mediaHeight: PropTypes.string,

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

ImgStyle.defaultProps = {
  themeColor: 'primary',
  borderColorType: 'border',

  display: null,
  flex: null,

  alignSelf: null,

  boxSizing: null,
  whiteSpace: null,

  padding: null,
  margin: null,

  width: null,
  mediaWidth: null,
  height: null,
  mediaHeight: null,

  borderRadius: null,
  borderStyle: null,
  borderWidth: null,

  background: null,
  color: {},
};

export default ImgStyle;
