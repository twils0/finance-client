import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Page from '../../Components/Page';
import Header2 from '../../Components/Header2';
import Paragraph from '../../Components/Paragraph';

/* eslint-disable react/no-unescaped-entities */

const PageBodyContainerTerms = (props) => {
  const { bufferPage, bufferHeightParagraphTop, bufferHeightParagraphBottom } = props;
  const bufferPageString = `${bufferPage}px`;
  const bufferHeightParagraphTopString = `${bufferHeightParagraphTop}px`;
  const bufferHeightParagraphBottomString = `${bufferHeightParagraphBottom}px`;

  return (
    <Page>
      <div style={{ margin: bufferPageString }}>
        <Header2 margin="0" justifyContent="center" width="100%">
          <b>Terms and Conditions</b>
        </Header2>
        <Paragraph
          display="flex"
          flexDirection="column"
          margin={`${bufferHeightParagraphTopString} 0 ${bufferHeightParagraphBottomString} 0`}
          alignItems="flex-start"
          themeSize="text"
        >
          <b> Example Terms and Conditions </b>
        </Paragraph>
      </div>
    </Page>
  );
};

PageBodyContainerTerms.propTypes = {
  bufferPage: PropTypes.number.isRequired,
  bufferHeightParagraphTop: PropTypes.number.isRequired,
  bufferHeightParagraphBottom: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  bufferPage: state.ui.external.utilities.terms.bufferPage,
  bufferHeightParagraphTop: state.ui.external.utilities.terms.bufferHeightParagraphTop,
  bufferHeightParagraphBottom: state.ui.external.utilities.terms.bufferHeightParagraphBottom,
  bufferHeight: state.ui.external.utilities.terms.bufferHeight,
});

export default connect(mapStateToProps)(PageBodyContainerTerms);
