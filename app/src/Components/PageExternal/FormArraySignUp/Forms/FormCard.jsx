import React from 'react';
import PropTypes from 'prop-types';
import { injectStripe } from 'react-stripe-elements';

import { formNames, inputNames } from '../../../../Constants/uiConstantsExternal';

import Form from '../../../Form';
import Header2 from '../../../Header2';
import Input from '../../../Inputs/Input';
import InputCard from '../../../Inputs/InputCard';

const FormCard = (props) => {
  const {
    stripeRef,
    heightRef,
    currentFormBool,
    width,
    mediaWidth,
    formHeightBuffer,
    inputHeightBuffer,
    handleInputChange,
    inputs,
  } = props;
  const widthString = `${width}px`;
  const mediaWidthString = `${mediaWidth}px`;
  const formHeightBufferHalfString = `${formHeightBuffer / 2}px`;
  const inputHeightBufferHalfString = `${inputHeightBuffer / 2}px`;
  const formString = formNames.CARD;

  return (
    <Form
      display="block"
      innerRef={heightRef}
      id={formString}
      width={widthString}
      padding={`${formHeightBufferHalfString} 0`}
    >
      <Header2
        display="block"
        colorType="dark"
        themeFontWeight="light"
        padding={`0 0 ${inputHeightBufferHalfString} 0`}
        margin="0"
        fontSize="17px"
      >
        Please enter your credit card information. Your card will be charged $450 each quarter. Your
        initial charge will be prorated until the start of the next billing cycle.
      </Header2>
      <Input
        id={inputNames[formString].NAME_ON_CARD}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="text"
        label="Name on Credit Card"
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].NAME_ON_CARD].value}
        errorMessage={inputs[inputNames[formString].NAME_ON_CARD].errorMessage}
        WrapperDiv={{ padding: `${inputHeightBufferHalfString} 0` }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
      <Input
        id={inputNames[formString].PROMO_CODE}
        tabIndex={currentFormBool ? '0' : '-1'}
        type="text"
        label="Promo Code"
        handleInputChange={handleInputChange}
        value={inputs[inputNames[formString].PROMO_CODE].value}
        errorMessage={inputs[inputNames[formString].PROMO_CODE].errorMessage}
        WrapperDiv={{ padding: `${inputHeightBufferHalfString} 0` }}
        InputStyle={{
          mediaWidth: mediaWidthString,
        }}
      />
      <InputCard
        onReady={stripeRef}
        id={inputNames[formString].STRIPE}
        label="Credit Card"
        errorMessage={inputs[inputNames[formString].STRIPE].errorMessage}
        WrapperDiv={{
          display: currentFormBool ? 'flex' : 'none',
          padding: `${inputHeightBufferHalfString} 0 0 0`,
        }}
        InputStyle={{
          mediaWidth, // pass prop to InputCard as number not as string with px
        }}
      />
    </Form>
  );
};

FormCard.propTypes = {
  stripeRef: PropTypes.func.isRequired,
  heightRef: PropTypes.func.isRequired,
  currentFormBool: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  formHeightBuffer: PropTypes.number.isRequired,
  inputHeightBuffer: PropTypes.number.isRequired,
  inputs: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

FormCard.defaultProps = {};

export default injectStripe(FormCard);
