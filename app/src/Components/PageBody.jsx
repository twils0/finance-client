import styled from 'styled-components';
import PropTypes from 'prop-types';

const PageBody = styled.div`
  display: flex;

  flex: ${props => props.flex || '0 0 auto'};
  flex-direction: ${props => props.flexDirection || 'row'};
  flex-wrap: wrap;

  align-items: ${props => props.alignItems || 'flex-start'};
  justify-content: ${props => props.justifyContent || 'center'};

  overflow-x: ${props => props.overflowX || 'visible'};
  overflow-y: ${props => props.overflowY || 'visible'};

  background: ${props => props.background || 'transparent'};
  background-size: cover;

  padding: ${props => props.padding};
  margin: ${props => props.margin};

  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100%'};

  min-width: ${props => props.minWidth};
  min-height: ${props => props.minHeight || 'min-content'};

  @media screen and (max-width: ${props => props.mediaWidth}) {
    height: 100%;
  }
`;

PageBody.propTypes = {
  flex: PropTypes.string,
  flexDirection: PropTypes.string,

  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,

  overflowX: PropTypes.string,
  overflowY: PropTypes.string,

  background: PropTypes.string,

  padding: PropTypes.string,
  margin: PropTypes.string,

  width: PropTypes.string,
  height: PropTypes.string,

  minWidth: PropTypes.string,
  minHeight: PropTypes.string,

  mediaWidth: PropTypes.string,
};

PageBody.defaultProps = {
  flex: null,
  flexDirection: null,

  alignItems: null,
  justifyContent: null,

  overflowX: null,
  overflowY: null,

  background: null,

  padding: null,
  margin: null,

  width: null,
  height: null,

  minWidth: null,
  minHeight: null,

  mediaWidth: null,
};

export default PageBody;
