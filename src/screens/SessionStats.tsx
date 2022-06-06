import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RootNavProps, RootRouteProps, RootStackProps } from "../types/navTypes";
import _values from "lodash/values";
import { useStore, StoredSessionStats } from "../store/useStore";
import { convertSecondsToMinutes } from "../utils/helpers";
import { useTheme } from "../context/themeContext";
import { Theme } from "../theme";
import ModalHeader from "../components/ModalHeader";
import uuid from "react-native-uuid";
import SessionStatItem from "./SessionStatItem";

type SessionStatsArray = {
  round: string;
  breaths: number;
  holdTimeSeconds: number; // seconds
  recoveryHoldTimeSeconds: number;
};
const SessionStats = ({ navigation, route }: RootStackProps<"SessionStats">) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  // function to get session stats
  const getSessionStats = useStore((state) => state.getSessionStats);
  const clearSessionStats = useStore((state) => state.clearAllSessionStats);
  const sessionStats = React.useMemo(() => getSessionStats(), []);

  console.log("Session Stats", sessionStats);

  return (
    <View>
      <ModalHeader headerText="Saved Session Stats" />

      <View style={styles.container}>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ paddingLeft: 10, fontSize: 18, fontWeight: "600" }}>
            List of Sessions
          </Text>
        </View>
        <View>
          {sessionStats.map((stat) => {
            return <SessionStatItem key={stat.statsId} statInfo={stat} />;
          })}
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              navigation.goBack();
              // const stats = getSessionStats();
              // console.log("STATS", stats);
            }}
          >
            <Text>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              clearSessionStats();
              // const stats = getSessionStats();
              // console.log("STATS", stats);
            }}
          >
            <Text>Clear all Stats</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      margin: 10,
    },
    roundContainer: {
      // padding: 5,
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 10,
    },
    roundHeader: {
      borderBottomWidth: 1,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      padding: 0,
      backgroundColor: theme.colors.cardBG,
    },
    roundHeaderText: {
      fontSize: 18,
      textAlign: "center",
    },
    roundInfoContainer: {
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    saveButton: {
      borderWidth: 1,
      borderRadius: 5,
      padding: 8,
      backgroundColor: theme.colors.buttonBG,
    },
  });
  return styles;
};
export default SessionStats;
