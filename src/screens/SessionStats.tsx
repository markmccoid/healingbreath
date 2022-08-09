import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RootStackProps } from "../types/navTypes";
import _values from "lodash/values";
import _uniq from "lodash/uniq";
import _sortBy from "lodash/sortBy";
import _reverse from "lodash/reverse";

import { useStore } from "../store/useStore";
import { useTheme } from "../context/themeContext";
import { Theme } from "../theme";
import ModalHeader from "../components/ModalHeader";
import SessionStatItem from "./SessionStatItem";
import { ScrollView } from "react-native-gesture-handler";

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
  const sessionYears = React.useMemo(
    () =>
      _reverse(
        _sortBy(_uniq(sessionStats.map((stat) => new Date(stat.sessionDate).getFullYear())))
      ),
    []
  );
  // console.log("Session Stats", sessionYears);

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <ModalHeader headerText="Saved Session Stats" />

      <View style={styles.container}>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>List of Sessions</Text>
        </View>
        <ScrollView>
          {sessionYears.map((year) => {
            return (
              <View key={year} style={styles.yearHeader}>
                <Text style={styles.yearHeaderText}>{year}</Text>
                {sessionStats.map((stat) => {
                  let date = new Date(stat.sessionDate);
                  // If not the year we are working with, then bail
                  if (date.getFullYear() !== year) return;

                  return <SessionStatItem key={stat.statsId} statInfo={stat} />;
                })}
              </View>
            );
          })}
        </ScrollView>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
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
          <View style={{ margin: 10 }} />
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
      flex: 1,
      margin: 15,
      marginBottom: 25,
    },
    yearHeader: {
      borderWidth: StyleSheet.hairlineWidth,
      // borderTopRightRadius: 10,
      // borderTopLeftRadius: 10,
      borderRadius: 10,
      borderColor: theme.colors.border,
      padding: 10,
      paddingVertical: 5,
      marginBottom: 10,
      backgroundColor: `${theme.colors.cardBG}aa`,
    },
    yearHeaderText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.cardFG,
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
