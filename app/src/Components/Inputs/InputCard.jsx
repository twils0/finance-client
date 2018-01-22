import React from 'react';
import PropTypes from 'prop-types';
import { CardElement } from 'react-stripe-elements';

import theme from '../../themes';
import WrapperDiv from './Subcomponents/WrapperDiv';
import Label from './Subcomponents/Label';
import Error from './Subcomponents/Error';

const InputCard = props => (
  <WrapperDiv
    themeColor={props.WrapperDiv.themeColor}
    themeSize={props.WrapperDiv.themeSize}
    themeFont={props.WrapperDiv.themeFont}
    display={props.WrapperDiv.display}
    flex={props.WrapperDiv.flex}
    alignItems={props.WrapperDiv.alignItems}
    justifyContent={props.WrapperDiv.justifyContent}
    alignSelf={props.WrapperDiv.alignSelf}
    boxSizing={props.WrapperDiv.boxSizing}
    padding={props.WrapperDiv.padding}
    margin={props.WrapperDiv.margin}
    width={props.WrapperDiv.width}
    height={props.WrapperDiv.height}
    mediaWidth={props.WrapperDiv.mediaWidth}
    responsiveWidth={props.WrapperDiv.responsiveWidth}
    responsiveMargin={props.WrapperDiv.responsiveMargin}
    responsivePadding={props.WrapperDiv.responsivePadding}
  >
    <Label
      label={props.label}
      htmlFor={props.id}
      errorMessage={props.errorMessage}
      themeColor={props.Label.themeColor}
      themeSize={props.Label.themeSize}
      themeFont={props.Label.themeFont}
      display={props.Label.display}
      flex={props.Label.flex}
      textAlign={props.Label.textAlign}
      alignSelf={props.Label.alignSelf}
      boxSizing={props.Label.boxSizing}
      whiteSpace={props.Label.whiteSpace}
      padding={props.Label.padding}
      margin={props.Label.margin}
      width={props.Label.width}
      height={props.Label.height}
      fontFamily={props.Label.fontFamily}
      fontSize={props.Label.fontSize}
      lineHeight={props.Label.lineHeight}
      fontWeight={props.Label.fontWeight}
      background={props.Label.background}
      color={props.Label.color}
    >
      {props.label}
    </Label>
    <div
      style={{
        outline: 'none',
        boxSizing: 'border-box',

        padding: 'calc(0.84em - 1px)',

        borderRadius: '2px',
        borderStyle: 'solid',
        borderWidth: '1px',

        width: '100%',

        background: theme.color.background.default,
        borderColor: props.errorMessage
          ? theme.color.invalid[props.borderColorType]
          : (props.InputStyle
              && props.InputStyle.color
              && props.InputStyle.color[props.borderColorType])
            || theme.color[props.themeColor][props.borderColorType],
      }}
    >
      <CardElement
        onReady={props.onReady}
        style={{
          base: {
            fontFamily: theme.font[props.themeFont] || 'sans-serif',
            fontSize:
              window.innerWidth < props.InputStyle.mediaWidth
                ? props.InputStyle.responsiveFontSize || theme.size.font.mobileText
                : theme.size.font[props.themeSize],
            color:
              (props.InputStyle
                && props.InputStyle.color
                && props.InputStyle.color[props.borderColorType])
              || theme.color[props.themeColor][props.colorType],
            '::placeholder': {
              color: theme.color[props.themeColor].placeholder,
            },
          },
          invalid: {
            color: theme.color.invalid.primary,
          },
        }}
      />
    </div>
    <Error
      errorMessage={props.errorMessage}
      themeColor={props.Error.themeColor}
      themeSize={props.Error.themeSize}
      themeFont={props.Error.themeFont}
      display={props.Error.display}
      flex={props.Error.flex}
      textAlign={props.Error.textAlign}
      alignSelf={props.Error.alignSelf}
      boxSizing={props.Error.boxSizing}
      whiteSpace={props.Error.whiteSpace}
      padding={props.Error.padding}
      margin={props.Error.margin}
      width={props.Error.width}
      height={props.Error.height}
      fontFamily={props.Error.fontFamily}
      fontSize={props.Error.fontSize}
      lineHeight={props.Error.lineHeight}
      fontWeight={props.Error.fontWeight}
      background={props.Error.background}
      color={props.Error.color}
    >
      {props.errorMessage}
    </Error>
  </WrapperDiv>
);

InputCard.propTypes = {
  WrapperDiv: PropTypes.object,
  Label: PropTypes.object,
  InputStyle: PropTypes.object,
  Error: PropTypes.object,
  onReady: PropTypes.func,
  id: PropTypes.string,
  label: PropTypes.string,
  errorMessage: PropTypes.string,
  themeColor: PropTypes.string,
  colorType: PropTypes.string,
  borderColorType: PropTypes.string,
  themeSize: PropTypes.string,
  themeFont: PropTypes.string,
};

InputCard.defaultProps = {
  WrapperDiv: {},
  Label: {},
  InputStyle: {},
  Error: {},
  onReady: null,
  id: null,
  label: null,
  errorMessage: '',
  themeColor: 'primary',
  colorType: 'text',
  borderColorType: 'border',
  themeSize: 'text',
  themeFont: 'text',
};

export default InputCard;
