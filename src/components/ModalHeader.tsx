import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/themeContext";
import { Theme } from "../theme";

const ModalHeader = ({ headerText }: { headerText: string }) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{headerText}</Text>
    </View>
  );
};

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      borderTopRightRadius: 5,
      borderTopLeftRadius: 5,
      backgroundColor: theme.colors.cardTitleBG,
      paddingVertical: 8,
      paddingHorizontal: 35,
    },
    headerText: {
      textAlign: "center",
      fontSize: 20,
      color: theme.colors.cardTitleFG,
      fontWeight: "600",
    },
  });
  return styles;
};
export default ModalHeader;
