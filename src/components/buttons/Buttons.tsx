import React from "react";
import { StyleSheet, Text, View, Pressable, ViewStyle } from "react-native";
import { colors, styleHelpers } from "../../theme";

type Props = {
  onPress: () => void;
  style?: ViewStyle;
};
export const ActionButton: React.FC<Props> = ({ children, onPress, style = {} }) => {
  return (
    <Pressable style={[styles.actionButton, style]} onPress={onPress}>
      {children}
    </Pressable>
  );
};

//**************************** */
export const LeftCornerButton: React.FC<Props> = ({ children, onPress, style }) => {
  return (
    <Pressable style={[styles.leftCornerButton, styleHelpers.shadow, style]} onPress={onPress}>
      {children}
    </Pressable>
  );
};
//**************************** */
export const RightCornerButton: React.FC<Props> = ({ children, onPress, style }) => {
  return (
    <Pressable
      style={[styles.rightCornerButton, styleHelpers.shadow, style]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.darkest,
    borderRadius: 15,
  },
  leftCornerButton: {
    padding: 10,
    // borderTopRightRadius: 40,
    backgroundColor: colors.darkest,
    borderBottomRightRadius: 30,
    // width: 80,
    // height: 60,
  },
  rightCornerButton: {
    padding: 10,
    backgroundColor: colors.darkest,
    // borderTopRightRadius: 40,
    borderBottomLeftRadius: 30,
    width: 80,
    height: 60,
  },
});
