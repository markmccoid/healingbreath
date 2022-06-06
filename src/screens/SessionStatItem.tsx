import * as React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/themeContext";
import { StoredSessionStats } from "../store/useStore";
import { Theme } from "../theme";

type Props = {
  statInfo: StoredSessionStats;
};
const SessionStatItem = ({ statInfo }: Props) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  // When the StoredSessionStats are persists to storage they
  // are serialized, this means that the Date comes back in as
  // a string.  Which means we need to convert the date in here.
  return (
    <View style={styles.itemContainer}>
      <Text>{`${statInfo.sessionDate.toLocaleDateString()} - ${statInfo.sessionName}`}</Text>
      <Text>{new Date(statInfo.sessionDate).toTimeString()}</Text>
      <Text>{statInfo.sessionLengthDisplay}</Text>
    </View>
  );
};

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    itemContainer: {
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 5,
      padding: 8,
      paddingTop: 5,
      marginBottom: 5,
    },
  });
  return styles;
};

export default SessionStatItem;
