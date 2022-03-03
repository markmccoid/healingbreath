import React from "react";
import { ViewStyle } from "react-native";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import ErrorInputWrapper, { Props as EIWProps } from "./ErrorInputWrapper";

type CustomNumberProps = {
  style?: ViewStyle;
  includeDecimal?: boolean;
};
type NumberProps = TextInputProps & CustomNumberProps;

export const NumberInput = (props: NumberProps) => {
  const { style, includeDecimal, ...spreadProps } = props;
  return (
    <TextInput
      style={[styles.numberInput, style]}
      keyboardType={includeDecimal ? "decimal-pad" : "number-pad"}
      {...spreadProps}
    />
  );
};

//*==============================
//* Number Input with the error wrapper built in
//*==============================
export const NumberInputWError = (props: NumberProps & EIWProps) => {
  const { style, includeDecimal, errorText, showErrorText, isTouched, ...spreadProps } = props;
  return (
    <ErrorInputWrapper
      errorText={errorText}
      showErrorText={showErrorText}
      isTouched={isTouched}
    >
      <TextInput
        style={[styles.numberInput, style]}
        keyboardType={includeDecimal ? "decimal-pad" : "number-pad"}
        {...spreadProps}
      />
    </ErrorInputWrapper>
  );
};

//*==============================
//* Text Input with the error wrapper built in
//*==============================
type CustomTextProps = {
  style?: ViewStyle;
};
type MyTextProps = TextInputProps & CustomTextProps;
export const TextInputWError = (props: MyTextProps & EIWProps) => {
  const { style, errorText, showErrorText, isTouched, ...spreadProps } = props;
  return (
    <ErrorInputWrapper
      errorText={errorText}
      showErrorText={showErrorText}
      isTouched={isTouched}
    >
      <TextInput style={[styles.textInput, style]} {...spreadProps} />
    </ErrorInputWrapper>
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
    marginBottom: 2,
  },
  numberInput: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 18,
    backgroundColor: "#fff",
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 18,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "crimson",
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "700",
  },
});
