import styled from 'styled-components';
import PropTypes from 'prop-types';

const FormStyle = styled.form`
  position: ${props => props.position || 'relative'};
  display: ${props => props.display || 'flex'};

  flex: ${props => props.flex};
  flex-direction: ${props => props.flexDirection || 'column'};

  align-securities: ${props => props.alignItems};
  justify-content: ${props => props.justifyContent};

  align-self: ${props => props.alignSelf};

  box-sizing: ${props => props.borderBox || 'border-box'};

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width};
  height: ${props => props.height};

  minwidth: ${props => props.minWidth};
  min-height: ${props => props.minHeight || 'min-content'};

  @media screen and (max-width: ${props => props.width}) {
    width: 100%;
  }

  border-radius: ${props => props.borderRadius || '0px'};
  border-style: ${props => props.borderStyle || 'solid'};
  border-width: ${props => props.borderWidth || '0px'};

  background: ${props => props.background || 'transparent'};
  border-color: ${props => props.color[props.borderColorType]
    || props.theme.color[props.themeColor][props.borderColorType]};
`;

FormStyle.propTypes = {
  themeColor: PropTypes.string,
  borderColorType: PropTypes.string,

  position: PropTypes.string,
  display: PropTypes.string,
  flex: PropTypes.string,
  flexDirection: PropTypes.string,

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

FormStyle.defaultProps = {
  themeColor: 'primary',
  borderColorType: 'border',

  position: null,
  display: null,
  flex: null,
  flexDirection: null,

  alignItems: null,
  justifyContent: null,

  alignSelf: null,

  boxSizing: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  mediaWidth: null,

  borderRadius: null,
  borderStyle: null,
  borderWidth: null,

  background: null,
  color: {},
};

export default FormStyle;
