import React from 'react';
import PropTypes from 'prop-types';

import { formNames, inputNames } from '../../../../Constants/uiConstantsAccount';

import Form from '../../../Form';
import FlexRow from '../../../Flex/FlexRow';
import Header2 from '../../../Header2';
import Input from '../../../Inputs/Input';

const FormCode = (props) => {
  const {
    heightRef,
    rowWidthIndent,
    headerWidthBufferRight,
    mediaWidth,
    rowHeight,
    rowHeightBuffer,
    currentFormBool,
    inputs,
    handleInputChange,
  } = props;
  const rowWidthIndentString = `${rowWidthIndent}px`;
  const headerWidthBufferRightString = `${headerWidthBufferRight}px`;
  const mediaWidthString = `${mediaWidth}px`;
  const rowHeightString = `${rowHeight}px`;
  const rowHeightBufferString = `${rowHeightBuffer}px`;
  const rowHeightBufferHalfString = `${rowHeightBuffer / 2}px`;
  const formString = formNames.CODE;

  return (
    <Form ref={heightRef} id={formString} width="100%">
      <Header2
        margin={`0 0 ${rowHeightBufferString} 0`}
        width="100%"
        mediaWidth={mediaWidthString}
        responsiveWidth="100%"
        themeFontWeight="light"
      >
        We need to verify your new phone number. Please enter the verification codes sent to your
        mobile phone or click resend.
      </Header2>
      <FlexRow
        justifyContent="flex-start"
        width="100%"
        minHeight={rowHeightString}
        borderWidth="1px 0"
      >
        <Header2
          padding={`0 0 0 ${rowWidthIndentString}`}
          width={`calc(35% - ${headerWidthBufferRightString})`}
          mediaWidth={mediaWidthString}
          responsiveWidth={`calc(100% - ${rowWidthIndentString})`}
          themeFontWeight="light"
        >
          Phone Code:
        </Header2>
        <Input
          id={inputNames[formString].CODE_PHONE}
          tabIndex={currentFormBool ? '0' : '-1'}
          type="text"
          handleInputChange={handleInputChange}
          value={inputs[inputNames[formString].CODE_PHONE].value}
          errorMessage={inputs[inputNames[formString].CODE_PHONE].errorMessage}
          WrapperDiv={{
            width: '65%',
            margin: `${rowHeightBufferHalfString} 0`,
            mediaWidth: mediaWidthString,
            responsiveWidth: `calc(100% - ${rowWidthIndentString})`,
            responsiveMargin: `0 0 ${rowHeightBufferHalfString} 0`,
            responsivePadding: `0 0 0 ${rowWidthIndentString}`,
          }}
          InputStyle={{
            mediaWidth: mediaWidthString,
          }}
        />
      </FlexRow>
    </Form>
  );
};

FormCode.propTypes = {
  heightRef: PropTypes.func.isRequired,
  rowWidthIndent: PropTypes.number.isRequired,
  headerWidthBufferRight: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowHeightBuffer: PropTypes.number.isRequired,
  currentFormBool: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default FormCode;
