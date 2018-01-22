import React from 'react';
import PropTypes from 'prop-types';

import { formNames, inputNames } from '../../../../Constants/uiConstantsAccount';

import Form from '../../../Form';
import FlexRow from '../../../Flex/FlexRow';
import Header2 from '../../../Header2';
import Input from '../../../Inputs/Input';

const FormChangePassword = (props) => {
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
  const rowHeightBufferHalfString = `${rowHeightBuffer / 2}px`;
  const formString = formNames.CHANGE_PASSWORD;

  return (
    <Form innerRef={heightRef} id={formString} width="100%">
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
          Old Password:
        </Header2>
        <Input
          id={inputNames[formString].OLD_PASSWORD}
          tabIndex={currentFormBool ? '0' : '-1'}
          type="password"
          handleInputChange={handleInputChange}
          value={inputs[inputNames[formString].OLD_PASSWORD].value}
          errorMessage={inputs[inputNames[formString].OLD_PASSWORD].errorMessage}
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
      <FlexRow
        justifyContent="flex-start"
        width="100%"
        minHeight={rowHeightString}
        borderWidth="0 0 1px 0"
      >
        <Header2
          padding={`0 0 0 ${rowWidthIndentString}`}
          width={`calc(35% - ${headerWidthBufferRightString})`}
          mediaWidth={mediaWidthString}
          responsiveWidth={`calc(100% - ${rowWidthIndentString})`}
          themeFontWeight="light"
        >
          New Password:
        </Header2>
        <Input
          id={inputNames[formString].NEW_PASSWORD}
          tabIndex={currentFormBool ? '0' : '-1'}
          type="password"
          handleInputChange={handleInputChange}
          value={inputs[inputNames[formString].NEW_PASSWORD].value}
          errorMessage={inputs[inputNames[formString].NEW_PASSWORD].errorMessage}
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
      <FlexRow
        justifyContent="flex-start"
        width="100%"
        minHeight={rowHeightString}
        borderWidth="0 0 1px 0"
      >
        <Header2
          padding={`0 0 0 ${rowWidthIndentString}`}
          width={`calc(35% - ${headerWidthBufferRightString})`}
          mediaWidth={mediaWidthString}
          responsiveWidth={`calc(100% - ${rowWidthIndentString})`}
          themeFontWeight="light"
        >
          Verify New Password:
        </Header2>
        <Input
          id={inputNames[formString].NEW_PASSWORD2}
          tabIndex={currentFormBool ? '0' : '-1'}
          type="password"
          handleInputChange={handleInputChange}
          value={inputs[inputNames[formString].NEW_PASSWORD2].value}
          errorMessage={inputs[inputNames[formString].NEW_PASSWORD2].errorMessage}
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

FormChangePassword.propTypes = {
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

FormChangePassword.defaultProps = {};

export default FormChangePassword;
