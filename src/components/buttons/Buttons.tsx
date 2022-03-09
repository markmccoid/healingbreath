import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { colors } from "../../theme";

type Props = {
  onPress: () => void;
};
export const ActionButton: React.FC<Props> = ({ children, onPress }) => {
  return (
    <Pressable style={styles.actuibButton} onPress={onPress}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  actuibButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.darkest,
    borderRadius: 15,
    margin: 5,
  },
});
