import React from 'react';
import PropTypes from 'prop-types';

import { formNames, inputNames } from '../../../../Constants/uiConstantsAccount';

import Form from '../../../Form';
import FlexRow from '../../../Flex/FlexRow';
import Header2 from '../../../Header2';
import Paragraph from '../../../Paragraph';
import Input from '../../../Inputs/Input';

const FormProfile = (props) => {
  const {
    heightRef,
    rowWidthIndent,
    headerWidthBufferRight,
    mediaWidth,
    rowHeight,
    rowHeightBuffer,
    currentFormBool,
    editForm,
    inputs,
    handleInputChange,
  } = props;
  const rowWidthIndentString = `${rowWidthIndent}px`;
  const headerWidthBufferRightString = `${headerWidthBufferRight}px`;
  const mediaWidthString = `${mediaWidth}px`;
  const rowHeightString = `${rowHeight}px`;
  const rowHeightBufferHalfString = `${rowHeightBuffer / 2}px`;
  const formString = formNames.PROFILE;

  return (
    <Form innerRef={heightRef} id={formString} width="100%">
      <FlexRow
        justifyContent="flex-start"
        width="100%"
        minHeight={rowHeightString}
        borderWidth="1px 0"
      >
        <Header2
          padding={`0 ${headerWidthBufferRightString} 0 ${rowWidthIndentString}`}
          width={`calc(35% - ${headerWidthBufferRightString})`}
          mediaWidth={mediaWidthString}
          responsiveWidth={
            !editForm
              ? `calc(30% - ${headerWidthBufferRightString})`
              : `calc(100% - ${rowWidthIndentString})`
          }
          themeFontWeight="light"
        >
          Name:
        </Header2>
        {!editForm ? (
          <Paragraph
            width="65%"
            textAlign="right"
            colorType="text"
            themeFont="text"
            themeFontWeight="normal"
            themeSize="text"
            mediaWidth={mediaWidthString}
            responsiveThemeFont="mobileText"
            responsiveWidth="70%"
          >
            {inputs[inputNames[formString].NAME].value}
          </Paragraph>
        ) : (
          <Input
            id={inputNames[formString].NAME}
            tabIndex={currentFormBool ? '0' : '-1'}
            type="text"
            handleInputChange={handleInputChange}
            value={inputs[inputNames[formString].NAME].value}
            errorMessage={inputs[inputNames[formString].NAME].errorMessage}
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
        )}
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
          responsiveWidth={
            !editForm
              ? `calc(30% - ${headerWidthBufferRightString})`
              : `calc(100% - ${rowWidthIndentString})`
          }
          themeFontWeight="light"
        >
          Login Email:
        </Header2>
        {!editForm ? (
          <Paragraph
            width="65%"
            textAlign="right"
            colorType="text"
            themeFont="text"
            themeFontWeight="normal"
            themeSize="text"
            mediaWidth={mediaWidthString}
            responsiveThemeFont="mobileText"
            responsiveWidth="70%"
          >
            {inputs[inputNames[formString].EMAIL].value}
          </Paragraph>
        ) : (
          <Input
            id={inputNames[formString].EMAIL}
            tabIndex={currentFormBool ? '0' : '-1'}
            type="email"
            handleInputChange={handleInputChange}
            value={inputs[inputNames[formString].EMAIL].value}
            errorMessage={inputs[inputNames[formString].EMAIL].errorMessage}
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
        )}
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
          responsiveWidth={
            !editForm
              ? `calc(30% - ${headerWidthBufferRightString})`
              : `calc(100% - ${rowWidthIndentString})`
          }
          themeFontWeight="light"
        >
          Additional Email:
        </Header2>
        {!editForm ? (
          <Paragraph
            width="65%"
            textAlign="right"
            colorType="text"
            themeFont="text"
            themeFontWeight="normal"
            themeSize="text"
            mediaWidth={mediaWidthString}
            responsiveThemeFont="mobileText"
            responsiveWidth="70%"
          >
            {inputs[inputNames[formString].EMAIL_ADDITIONAL].value}
          </Paragraph>
        ) : (
          <Input
            id={inputNames[formString].EMAIL_ADDITIONAL}
            tabIndex={currentFormBool ? '0' : '-1'}
            type="email"
            handleInputChange={handleInputChange}
            value={inputs[inputNames[formString].EMAIL_ADDITIONAL].value}
            errorMessage={inputs[inputNames[formString].EMAIL_ADDITIONAL].errorMessage}
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
        )}
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
          responsiveWidth={
            !editForm
              ? `calc(35% - ${headerWidthBufferRightString})`
              : `calc(100% - ${rowWidthIndentString})`
          }
          themeFontWeight="light"
        >
          Mobile Phone:
        </Header2>
        {!editForm ? (
          <Paragraph
            width="65%"
            textAlign="right"
            colorType="text"
            themeFont="text"
            themeFontWeight="normal"
            themeSize="text"
            mediaWidth={mediaWidthString}
            responsiveThemeFont="mobileText"
          >
            {inputs[inputNames[formString].PHONE].value}
          </Paragraph>
        ) : (
          <Input
            id={inputNames[formString].PHONE}
            tabIndex={currentFormBool ? '0' : '-1'}
            type="tel"
            handleInputChange={handleInputChange}
            value={inputs[inputNames[formString].PHONE].value}
            errorMessage={inputs[inputNames[formString].PHONE].errorMessage}
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
        )}
      </FlexRow>
    </Form>
  );
};

FormProfile.propTypes = {
  heightRef: PropTypes.func.isRequired,
  rowWidthIndent: PropTypes.number.isRequired,
  headerWidthBufferRight: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowHeightBuffer: PropTypes.number.isRequired,
  currentFormBool: PropTypes.bool.isRequired,
  editForm: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

FormProfile.defaultProps = {};

export default FormProfile;
