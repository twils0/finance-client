import React from 'react';
import PropTypes from 'prop-types';
import { injectStripe } from 'react-stripe-elements';

import { formNames, inputNames } from '../../../../Constants/uiConstantsAccount';

import Form from '../../../Form';
import FlexRow from '../../../Flex/FlexRow';
import Header2 from '../../../Header2';
import Paragraph from '../../../Paragraph';
import Input from '../../../Inputs/Input';
import Error from '../../../Inputs/Subcomponents/Error';
import InputCard from '../../../Inputs/InputCard';

const FormBilling = (props) => {
  const {
    stripeRef,
    heightRef,
    rowWidthIndent,
    headerWidthBufferRight,
    mediaWidth,
    rowHeight,
    rowHeightBuffer,
    editForm,
    currentFormBool,
    inputs,
    handleInputChange,
  } = props;
  const rowWidthIndentString = `${rowWidthIndent}px`;
  const headerWidthBufferRightString = `${headerWidthBufferRight}px`;
  const mediaWidthString = `${mediaWidth}px`;
  const rowHeightString = `${rowHeight}px`;
  const rowHeightBufferHalfString = `${rowHeightBuffer / 2}px`;
  const formString = formNames.BILLING;

  return (
    <Form ref={heightRef} id={formString} width="100%">
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
          responsiveWidth={
            !editForm
              ? `calc(35% - ${headerWidthBufferRightString})`
              : `calc(100% - ${rowWidthIndentString})`
          }
          themeFontWeight="light"
        >
          Name on Credit Card:
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
            {inputs[inputNames[formString].NAME_ON_CARD].value}
          </Paragraph>
        ) : (
          <Input
            id={inputNames[formString].NAME_ON_CARD}
            tabIndex={currentFormBool ? '0' : '-1'}
            type="text"
            handleInputChange={handleInputChange}
            value={inputs[inputNames[formString].NAME_ON_CARD].value}
            errorMessage={inputs[inputNames[formString].NAME_ON_CARD].errorMessage}
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
          Promo Code:
        </Header2>
        {!editForm ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '65%',
              alignItems: 'end',
            }}
          >
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
              {inputs[inputNames[formString].PROMO_CODE].value}
            </Paragraph>
            {!inputs[inputNames[formString].PROMO_CODE].errorMessage ? null : (
              <Error>{inputs[inputNames[formString].PROMO_CODE].errorMessage}</Error>
            )}
          </div>
        ) : (
          <Input
            id={inputNames[formString].PROMO_CODE}
            tabIndex={currentFormBool ? '0' : '-1'}
            type="text"
            handleInputChange={handleInputChange}
            value={
              !inputs[inputNames[formString].PROMO_CODE].value
                ? ''
                : inputs[inputNames[formString].PROMO_CODE].value
            }
            errorMessage={inputs[inputNames[formString].PROMO_CODE].errorMessage}
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
          Credit Card:
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
            We do not display credit card information.
          </Paragraph>
        ) : (
          <InputCard
            onReady={stripeRef}
            id={inputNames[formString].STRIPE}
            errorMessage={inputs[inputNames[formString].STRIPE].errorMessage}
            WrapperDiv={{
              display: currentFormBool ? 'flex' : 'none',
              width: '65%',
              margin: `${rowHeightBufferHalfString} 0`,
              mediaWidth: mediaWidthString,
              responsiveWidth: `calc(100% - ${rowWidthIndentString})`,
              responsiveMargin: `0 0 ${rowHeightBufferHalfString} 0`,
              responsivePadding: `0 0 0 ${rowWidthIndentString}`,
            }}
            InputStyle={{
              mediaWidth, // pass prop to InputCard as number not as string with px
            }}
          />
        )}
      </FlexRow>
    </Form>
  );
};

FormBilling.propTypes = {
  stripeRef: PropTypes.func.isRequired,
  heightRef: PropTypes.func.isRequired,
  rowWidthIndent: PropTypes.number.isRequired,
  headerWidthBufferRight: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowHeightBuffer: PropTypes.number.isRequired,
  editForm: PropTypes.bool.isRequired,
  currentFormBool: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

FormBilling.defaultProps = {};

export default injectStripe(FormBilling);
