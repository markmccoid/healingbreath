import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

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
    borderColor: "#4840D6",
    backgroundColor: "#4840D6",
    borderRadius: 15,
    margin: 5,
  },
});
