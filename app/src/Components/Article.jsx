import styled from 'styled-components';
import PropTypes from 'prop-types';

const Article = styled.div`
  display: ${props => props.display || 'flex'};

  flex: ${props => props.flex};
  flex-direction: ${props => props.flexDirection || 'row'};
  flex-wrap: ${props => props.flexWrap || 'wrap'};

  align-securities: ${props => props.alignItems || 'flex-start'};
  align-content: ${props => props.alignContent || 'flex-start'};
  justify-content: ${props => props.justifyContent || 'flex-start'};

  overflow-x: ${props => props.overflowX || 'hidden'};
  overflow-y: ${props => props.overflowY || 'auto'};

  box-sizing: border-box;

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100%'};

  min-width: ${props => props.minWidth};
  min-height: ${props => props.minHeight || 'min-content'};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    overflow: visible;
    margin: ${props => props.responsiveMargin};
    padding: ${props => props.responsivePadding};
    width: ${props => props.responsiveWidth};
    height: ${props => props.responsiveHeight};
  }

  background: ${props => props.background || 'transparent'};
  background-size: cover;
`;

Article.propTypes = {
  flex: PropTypes.string,
  flexDirection: PropTypes.string,
  flexWrap: PropTypes.string,

  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,

  overflowX: PropTypes.string,
  overflowY: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  minWidth: PropTypes.string,
  minHeight: PropTypes.string,

  mediaWidth: PropTypes.string,

  responsiveMargin: PropTypes.string,
  responsivePadding: PropTypes.string,
  responsiveWidth: PropTypes.string,
  responsiveHeight: PropTypes.string,

  background: PropTypes.string,
};

Article.defaultProps = {
  flex: null,
  flexDirection: null,
  flexWrap: null,

  alignItems: null,
  justifyContent: null,

  overflowX: null,
  overflowY: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  minWidth: null,
  minHeight: null,

  mediaWidth: null,

  responsiveMargin: null,
  responsivePadding: null,
  responsiveWidth: null,
  responsiveHeight: null,

  background: null,
};

export default Article;
