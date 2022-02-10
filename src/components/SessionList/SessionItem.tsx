import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useBreathNavigation from "../../navigation/useBreathNavigation";
import { StoredSession } from "../../store/useStore";
import { formattedRetentionTimes } from "../../utils/helpers";

type Props = {
  session: StoredSession;
};

function SessionItem({ session }: Props) {
  const { navigateToSession } = useBreathNavigation();
  const retentionTimes = formattedRetentionTimes(
    session.breathRounds,
    session.defaultHoldTime,
    session.breathRoundsDetail
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.itemPressable}
        onPress={() => {
          navigateToSession(session);
          // setActiveSession(session);
          // navigation.navigate("Session");
        }}
      >
        <View style={styles.itemTitleContainer}>
          <Text style={[styles.itemText, styles.itemTitle]}>{`${session.name}`}</Text>
        </View>
        <View style={styles.infoLine1}>
          <Text style={[styles.itemText, styles.infoLine1Text]}>
            Rounds: {session.breathRounds}
          </Text>
          <Text style={[styles.itemText, styles.infoLine1Text]}>
            Recovery: {session.recoveryHoldTime}s
          </Text>
          <Text style={[styles.itemText, styles.infoLine1Text]}>
            Breaths/Round: {session.breathReps}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "flex-start", marginTop: 4 }}>
          <Text style={[styles.itemText, styles.retentionText]}>Retention:</Text>
          {retentionTimes?.map((time, idx) => (
            <View key={idx} style={{ marginHorizontal: 5 }}>
              <Text style={[styles.itemText, styles.retentionText]}>{time}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 5,
    marginHorizontal: 15,
    backgroundColor: "#8D8ED6",
  },
  itemPressable: { padding: 10, paddingTop: 5 },
  itemText: {
    fontFamily: "FiraSans_500Medium",
  },
  itemTitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  itemTitle: { fontSize: 18 },
  // Info line 1
  infoLine1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLine1Text: {
    fontSize: 16,
  },
  // Retention Line
  retentionText: {
    fontSize: 17,
  },
});
export default SessionItem;
