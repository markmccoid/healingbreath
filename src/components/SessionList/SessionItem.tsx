import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useBreathNavigation from "../../navigation/useBreathNavigation";
import { StoredSession, BreathState } from "../../store/useStore";
import { formattedRetentionTimes } from "../../utils/helpers";
import { EditIcon, DeleteIcon } from "../common/Icons";

type Props = {
  session: StoredSession;
  deleteSession: BreathState["deleteSession"];
  handleEditSession: (sessionId: string) => void;
};

function SessionItem({ session, deleteSession, handleEditSession }: Props) {
  const { navigateToSession } = useBreathNavigation();
  const retentionTimes = formattedRetentionTimes(
    session.breathRounds,
    session.defaultHoldTime,
    session.breathRoundsDetail
  );

  return (
    <View style={styles.container}>
      {/* Edit Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          zIndex: 10,
          left: -6,
          padding: 3,
          borderWidth: 1,
          backgroundColor: "white",
          borderRadius: 10,
          top: -10,
        }}
        onPress={() => handleEditSession(session.id)}
      >
        <EditIcon size={20} />
      </TouchableOpacity>
      {/* Delete Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          zIndex: 10,
          right: -6,
          padding: 3,
          borderWidth: 1,
          backgroundColor: "white",
          borderRadius: 10,
          top: -10,
        }}
        onPress={() => deleteSession(session.id)}
      >
        <DeleteIcon size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.itemPressable}
        onPress={() => {
          navigateToSession(session.id);
          // setActiveSession(session);
          // navigation.navigate("Session");
        }}
      >
        <View style={styles.itemTitleContainer}>
          <Text style={[styles.itemText, styles.itemTitle]}>{`${session.name}`}</Text>
        </View>
        {/* Line 1 of Information */}
        <View style={styles.infoLine1}>
          <View style={styles.infoHighlight}>
            <Text style={[styles.itemText, styles.infoLine1Text]}>
              Rounds: {session.breathRounds}
            </Text>
          </View>

          <View style={styles.infoHighlight}>
            <Text style={[styles.itemText, styles.infoLine1Text]}>
              Breaths/Round: {session.breathReps}
            </Text>
          </View>
        </View>
        {/* Line 2 of Information */}
        <View style={styles.infoLine1}>
          <View style={styles.infoHighlight}>
            <Text style={[styles.itemText, styles.infoLine1Text]}>
              Recovery Breath: {session.recoveryHoldTime}s
            </Text>
          </View>
        </View>
        {/* Line 3 RETENTION Information */}
        <View style={styles.retentionContainer}>
          <View
            style={{
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#777",
              backgroundColor: "#A1CDF4",
              paddingVertical: 4,
              marginBottom: 5,
            }}
          >
            <Text style={[styles.itemText, styles.retentionText]}>Retention Hold Times</Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: 10 }}>
            {retentionTimes?.map((time, idx) => (
              <View key={idx} style={{ marginHorizontal: 5 }}>
                <Text style={[styles.itemText, styles.retentionText]}>{time}</Text>
              </View>
            ))}
          </View>
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
    backgroundColor: "#A1CDF499",
    flex: 1,
  },
  itemPressable: {
    flex: 1,
    flexDirection: "column",
  },
  itemText: {
    fontFamily: "FiraSans_500Medium",
  },
  itemTitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
    paddingVertical: 5,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1, //StyleSheet.hairlineWidth,
    backgroundColor: "#A1CDF4aa",
  },
  itemTitle: { fontSize: 18, color: "black" },
  // Info line 1
  infoLine1: {
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
  },
  infoLine1Text: {
    fontSize: 16,
  },
  infoHighlight: {
    flexGrow: 1,
    marginLeft: 2,
    marginRight: 5,
    backgroundColor: "#ffffff77",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
  },
  // Retention Line
  retentionContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 4,
    marginBottom: 5,
  },
  retentionText: {
    fontSize: 17,
    textAlign: "center",
  },
});
export default SessionItem;
