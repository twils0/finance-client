import React from 'react';
import PropTypes from 'prop-types';

import { formNames, inputNames } from '../../../../Constants/uiConstantsAccount';

import Form from '../../../Form';
import FlexRow from '../../../Flex/FlexRow';
import Header2 from '../../../Header2';
import Input from '../../../Inputs/Input';

const FormDeleteAccount = (props) => {
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
  const rowHeightBufferString = `${rowHeightBuffer}px`;
  const rowHeightBufferHalfString = `${rowHeightBuffer / 2}px`;
  const formString = formNames.DELETE_ACCOUNT;

  return (
    <Form innerRef={heightRef} id={formString} width="100%">
      <Header2
        margin={`0 0 ${rowHeightBufferString} 0`}
        width="100%"
        mediaWidth={mediaWidthString}
        responsiveWidth="100%"
        themeFontWeight="light"
      >
        {
          'To delete your account, please click the "Delete" button below, type "delete" into the input field, and then click the "Confirm" button.'
        }
      </Header2>
      {!editForm ? null : (
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
            Please Confirm:
          </Header2>
          <Input
            id={inputNames[formString].CONFIRM}
            tabIndex={currentFormBool ? '0' : '-1'}
            type="text"
            handleInputChange={handleInputChange}
            value={inputs[inputNames[formString].CONFIRM].value}
            errorMessage={inputs[inputNames[formString].CONFIRM].errorMessage}
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
      )}
    </Form>
  );
};

FormDeleteAccount.propTypes = {
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

FormDeleteAccount.defaultProps = {};

export default FormDeleteAccount;
