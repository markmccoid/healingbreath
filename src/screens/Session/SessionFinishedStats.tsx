import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RootNavProps, RootRouteProps, RootStackProps } from "../../types/navTypes";
import _values from "lodash/values";
import { useStore, StoredSessionStats } from "../../store/useStore";
import { convertSecondsToMinutes } from "../../utils/helpers";
import { useTheme } from "../../context/themeContext";
import { Theme } from "../../theme";
import ModalHeader from "../../components/ModalHeader";
import uuid from "react-native-uuid";

// type Props = {
//   navigation: RootNavProps<"SessionFinished">;
//   route: RootRouteProps<"SessionFinished">;
// };

type SessionStatsArray = {
  round: string;
  breaths: number;
  holdTimeSeconds: number; // seconds
  recoveryHoldTimeSeconds: number;
};
const SessionFinishedStats = ({ navigation, route }: RootStackProps<"SessionFinished">) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  // Get save session function
  const saveSessionStats = useStore((state) => state.addSessionStats);
  const getSessionStats = useStore((state) => state.getSessionStats);
  const activeSessionName = useStore((state) => state.activeSession?.name) || "Empty";
  const statsId = uuid.v4() as string;
  const { sessionStats = {}, sessionStart = 0, sessionEnd = 0 } = route.params;
  const sessionStatsArray: SessionStatsArray[] = Object.keys(sessionStats).map((key) => ({
    round: key,
    ...sessionStats[key],
  }));

  const sessionStartDate = new Date(sessionStart);
  const sessionEndDate = new Date(sessionEnd);
  const seconds = (sessionEndDate.getTime() - sessionStartDate.getTime()) / 1000;
  const formattedSessionTime = convertSecondsToMinutes(seconds);
  const storedSessionStats: StoredSessionStats = {
    statsId,
    sessionName: activeSessionName,
    sessionDate: sessionStartDate,
    numberOfRounds: sessionStatsArray.length,
    sessionLengthDisplay: formattedSessionTime,
    sessionLengthSeconds: seconds,
    SessionStats: sessionStats,
  };
  // console.log("Session Stats", storedSessionStats);

  return (
    <View>
      <ModalHeader headerText="Session Finished Stats" />

      <View style={styles.container}>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ paddingLeft: 10, fontSize: 18, fontWeight: "600" }}>
            Session Length: {formattedSessionTime}
          </Text>
        </View>
        {sessionStatsArray.map((round) => {
          return (
            <View key={round.round} style={styles.roundContainer}>
              <View style={styles.roundHeader}>
                <Text style={styles.roundHeaderText}>Round {round.round}</Text>
              </View>
              <View style={styles.roundInfoContainer}>
                <Text>Breaths: {round.breaths}</Text>
                <Text>Hold Time: {convertSecondsToMinutes(round.holdTimeSeconds)}</Text>
                <Text>
                  Recovery Time: {convertSecondsToMinutes(round.recoveryHoldTimeSeconds)}
                </Text>
              </View>
            </View>
          );
        })}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              saveSessionStats(storedSessionStats);
              navigation.goBack();
            }}
          >
            <Text>Save Session</Text>
          </TouchableOpacity>

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
export default SessionFinishedStats;
