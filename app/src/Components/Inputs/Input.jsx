import React from 'react';
import PropTypes from 'prop-types';

import WrapperDiv from './Subcomponents/WrapperDiv';
import Label from './Subcomponents/Label';
import InputStyle from './Subcomponents/InputStyle';
import Error from './Subcomponents/Error';

const Input = props => (
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
    <InputStyle
      {...props.dataSet}
      id={props.id}
      tabIndex={props.tabIndex}
      type={props.type}
      onChange={props.handleInputChange}
      value={props.value}
      errorMessage={props.errorMessage}
      themeColor={props.InputStyle.themeColor}
      themeSize={props.InputStyle.themeSize}
      themeFont={props.InputStyle.themeFont}
      display={props.InputStyle.display}
      flex={props.InputStyle.flex}
      alignItems={props.InputStyle.alignItems}
      justifyContent={props.InputStyle.justifyContent}
      alignSelf={props.InputStyle.alignSelf}
      boxSizing={props.InputStyle.boxSizing}
      whiteSpace={props.InputStyle.whiteSpace}
      padding={props.InputStyle.padding}
      margin={props.InputStyle.margin}
      width={props.InputStyle.width}
      height={props.InputStyle.height}
      mediaWidth={props.InputStyle.mediaWidth}
      responsiveFontSize={props.InputStyle.responsiveFontSize}
      fontFamily={props.InputStyle.fontFamily}
      fontSize={props.InputStyle.fontSize}
      lineHeight={props.InputStyle.lineHeight}
      fontWeight={props.InputStyle.fontWeight}
      borderRadius={props.InputStyle.borderRadius}
      borderStyle={props.InputStyle.borderStyle}
      borderWidth={props.InputStyle.borderWidth}
      background={props.InputStyle.background}
      color={props.InputStyle.color}
    />
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

Input.propTypes = {
  WrapperDiv: PropTypes.object,
  Label: PropTypes.object,
  InputStyle: PropTypes.object,
  Error: PropTypes.object,
  id: PropTypes.string,
  dataSet: PropTypes.object,
  tabIndex: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  handleInputChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  errorMessage: PropTypes.string,
};

Input.defaultProps = {
  WrapperDiv: {},
  Label: {},
  InputStyle: {},
  Error: {},
  id: null,
  dataSet: {},
  tabIndex: null,
  label: null,
  type: 'text',
  value: '',
  errorMessage: '',
};

export default Input;
