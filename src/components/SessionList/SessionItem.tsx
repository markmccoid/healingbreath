import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useBreathNavigation from "../../navigation/useBreathNavigation";
import { StoredSession, BreathState } from "../../store/useStore";
import { formattedRetentionTimes } from "../../utils/helpers";
import { EditIcon, DeleteIcon } from "../common/Icons";
// import { colors } from "../../theme";
import { useTheme } from "../../context/themeContext";
import { Theme } from "../../theme";

type Props = {
  session: StoredSession;
  deleteSession: BreathState["deleteSession"];
  handleEditSession: (sessionId: string) => void;
};

function SessionItem({ session, deleteSession, handleEditSession }: Props) {
  const { theme } = useTheme();
  const { navigateToSession } = useBreathNavigation();
  const retentionTimes = formattedRetentionTimes(
    session.breathRounds,
    session.defaultHoldTime,
    session.breathRoundsDetail
  );

  // generate styles object by passing in theme to function
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Edit Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          zIndex: 10,
          left: -6,
          paddingVertical: 5,
          paddingHorizontal: 8,
          borderWidth: 1,
          borderColor: theme.colors.iconBorder,
          backgroundColor: theme.colors.iconBG,
          borderRadius: 10,
          top: -10,
        }}
        onPress={() => handleEditSession(session.id)}
      >
        <EditIcon size={20} color={theme.colors.iconFG} />
      </TouchableOpacity>
      {/* Delete Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          zIndex: 10,
          right: -6,
          paddingVertical: 5,
          paddingHorizontal: 8,
          borderWidth: 1,
          borderColor: theme.colors.iconBorder,
          backgroundColor: theme.colors.iconBG,
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
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.displayBG,
              paddingVertical: 4,
              marginBottom: 5,
            }}
          >
            <Text style={[styles.itemText, styles.retentionText]}>Retention Hold Times</Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              {retentionTimes?.map((time, idx) => (
                <View key={idx} style={{ marginHorizontal: 5 }}>
                  <Text style={[styles.itemText, styles.retentionText]}>{time}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      marginBottom: 5,
      marginHorizontal: 15,
      backgroundColor: theme.colors.cardBG,
      flex: 1,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
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
      borderBottomWidth: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.cardTitleBG,
    },
    itemTitle: { fontSize: 18, color: theme.colors.cardTitleFG },
    // Info line 1
    infoLine1: {
      paddingHorizontal: 5,
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 5,
    },
    infoLine1Text: {
      fontSize: 16,
      color: theme.colors.displayFG,
    },
    infoHighlight: {
      flexGrow: 1,
      marginLeft: 2,
      marginRight: 5,
      backgroundColor: theme.colors.displayBG,
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
      color: theme.colors.displayFG,
    },
  });
};

// const styles = StyleSheet.create({
//   container: {
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     borderRadius: 10,
//     marginBottom: 5,
//     marginHorizontal: 15,
//     backgroundColor: colors.dark,
//     flex: 1,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,

//     elevation: 5,
//   },
//   itemPressable: {
//     flex: 1,
//     flexDirection: "column",
//   },
//   itemText: {
//     fontFamily: "FiraSans_500Medium",
//   },
//   itemTitleContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 5,
//     paddingVertical: 5,
//     borderRadius: 10,
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     backgroundColor: colors.darkest,
//   },
//   itemTitle: { fontSize: 18, color: colors.white },
//   // Info line 1
//   infoLine1: {
//     paddingHorizontal: 5,
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     marginBottom: 5,
//   },
//   infoLine1Text: {
//     fontSize: 16,
//   },
//   infoHighlight: {
//     flexGrow: 1,
//     marginLeft: 2,
//     marginRight: 5,
//     backgroundColor: colors.gray,
//     paddingVertical: 3,
//     paddingHorizontal: 10,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderRadius: 6,
//   },
//   // Retention Line
//   retentionContainer: {
//     flexDirection: "column",
//     justifyContent: "flex-start",
//     marginTop: 4,
//     marginBottom: 5,
//   },
//   retentionText: {
//     fontSize: 17,
//     textAlign: "center",
//   },
// });

export default SessionItem;
