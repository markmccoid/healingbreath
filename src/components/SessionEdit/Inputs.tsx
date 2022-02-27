import React from "react";
import { ViewStyle } from "react-native";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

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

type CustomTextProps = {
  style?: ViewStyle;
  includeDecimal?: boolean;
};
type MyTextProps = TextInputProps & CustomTextProps;
export const MyTextInput = (props: MyTextProps) => {
  const { style, ...spreadProps } = props;
  return <TextInput style={[styles.textInput, style]} {...spreadProps} />;
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
