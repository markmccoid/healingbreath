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
  const sessionDateWork = new Date(statInfo.sessionDate);
  const isPM = sessionDateWork.getHours() > 12;
  const sessionStartTime = `${
    isPM ? sessionDateWork.getHours() - 12 : sessionDateWork.getHours()
  }:${sessionDateWork.getMinutes()} ${isPM ? "PM" : "AM"}`;
  const sessionDate = sessionDateWork.toLocaleDateString();

  return (
    <View style={styles.itemContainer}>
      <Text>{`${statInfo.sessionName} at ${sessionStartTime} on ${sessionDate}`}</Text>
      <Text>{`${sessionDate} - ${statInfo.sessionName}`}</Text>
      <Text>{`Start Time - ${sessionStartTime}`}</Text>
      <Text>{`Length - ${statInfo.sessionLengthDisplay}`}</Text>
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
