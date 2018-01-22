import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import theme from '../themes';

const iconPath = {
  search:
    'M412.8 458.24c-42.889 33.57-97.603 53.832-157.048 53.832-141.385 0-256-114.615-256-256s114.615-256 256-256c141.385 0 256 114.615 256 256 0 59.446-20.262 114.159-54.256 157.611l0.424-0.562 171.2 170.56-45.44 45.44-170.56-170.88zM256 448c106.039 0 192-85.961 192-192s-85.961-192-192-192v0c-106.039 0-192 85.961-192 192s85.961 192 192 192v0z',
};

const SvgStyle = styled.svg`
  display: inline-flex;

  justify-content: center;
  box-sizing: border-box;

  margin: ${props => props.margin};
  padding: ${props => props.padding};

  width: ${props => props.iconSize || props.theme.size.icon[props.icon]};
  height: ${props => props.iconSize || props.theme.size.icon[props.icon]};
`;

const PathStyle = styled.path`
  fill: ${props => props.fill || props.theme.color.primary.border};
`;

const Icon = props => (
  <SvgStyle
    icon={props.icon}
    margin={props.margin}
    padding={props.padding}
    iconSize={props.iconSize}
    viewBox={props.viewBox || theme.iconViewbox[props.icon]}
    preserveAspectRatio="xMinYMin"
  >
    <PathStyle key={`${props.icon}`} fill={props.fill} d={iconPath[props.icon]} />
  </SvgStyle>
);

Icon.propTypes = {
  icon: PropTypes.string.isRequired,

  margin: PropTypes.string,
  padding: PropTypes.string,

  iconSize: PropTypes.string,
  viewBox: PropTypes.string,

  fill: PropTypes.string,
};

Icon.defaultProps = {
  margin: null,
  padding: null,

  iconSize: null,
  viewBox: null,

  fill: null,
};

export default Icon;
