import React, { useEffect, useState, useReducer, Dispatch } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/core";
import { RootNavProps, RootRouteProps } from "../../types/navTypes";
import { CloseIcon } from "../common/Icons";
import { useStore, StoredSession } from "../../store/useStore";
import uuid from "react-native-uuid";
import { SessionInputProvider, useSessionInputs } from "../../context/SessionInputContext";

const SessionEdit = () => {
  const route = useRoute<RootRouteProps<"SessionEdit">>();
  const navigation = useNavigation<RootNavProps<"SessionEdit">>();
  const { displayValues, setters, errorMessages } = useSessionInputs();

  const createNewSession = useStore((state) => state.createNewSession);
  const [title, setTitle] = useState("Create Session");
  const [showRetentionBreaths, setShowRetentionBreaths] = useState(false);
  // Set the title of the modal
  useEffect(() => {
    if (route.params?.sessionId) {
      setTitle("Edit Session");
    }
    navigation.setOptions({});
  }, []);
  console.log("error messages", displayValues, errorMessages);
  // Display the retention hold time entry inputs
  // useEffect(() => {
  //   // console.log("breathRounds", state.breathRounds);
  //   if (displayValues?.breathRounds) {
  //     setShowRetentionBreaths(true);
  //   } else {
  //     setShowRetentionBreaths(false);
  //   }
  // }, [displayValues?.breathRounds]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <TouchableOpacity
          style={{ position: "absolute", right: 10, top: 5 }}
          onPress={() => navigation.goBack()}
        >
          <CloseIcon color={"black"} size={25} />
        </TouchableOpacity>
      </View>
      <View style={styles.editorContainer}>
        {/* <View style={styles.editorRow}>
          <Text style={styles.editorLabelText}>Session Name:</Text>
          <TextInput
            placeholder=""
            onChangeText={(e) => dispatch({ type: "name", payload: e })}
            value={state.name}
            style={[styles.editorInputText, { borderBottomWidth: 1, width: 100 }]}
            // style={styles.filterName}
          />
        </View> */}
        <View style={styles.divider} />
        <View style={styles.editorRow}>
          <Text style={styles.editorLabelText}>Rounds:</Text>
          <TextInput
            placeholder=""
            keyboardType="numeric"
            onChangeText={(e) => setters.setBreathRounds(e)} //dispatch({ type: "breathRounds", payload: e })}
            value={displayValues?.breathRounds}
            style={[
              styles.editorInputText,
              {
                borderBottomWidth: 1,
                width: 25,
                backgroundColor: errorMessages?.breathRounds ? "red" : "white",
              },
            ]}
            maxLength={2}
            textAlign="center"
            // style={styles.filterName}
          />
        </View>
        {/* <View style={styles.divider} />
        <View style={styles.editorRow}>
          <Text style={styles.editorLabelText}>Breaths/Round:</Text>
          <TextInput
            placeholder=""
            keyboardType="numeric"
            onChangeText={(e) =>
              dispatch({ type: "breathReps", payload: parseInt(e.replace(/[^0-9]/g, "")) })
            }
            value={state.breathReps + ""}
            style={[styles.editorInputText, { borderBottomWidth: 1, width: 35 }]}
            maxLength={2}
            textAlign="center"
            // style={styles.filterName}
          />
        </View>

        <View style={styles.divider} />
        <View style={styles.editorRow}>
          <Text style={styles.editorLabelText}>Recovery Breath Length (seconds):</Text>
          <TextInput
            placeholder=""
            keyboardType="numeric"
            onChangeText={(e) =>
              dispatch({
                type: "recoveryHoldTime",
                payload: parseInt(e.replace(/[^0-9]/g, "")),
              })
            }
            value={state.recoveryHoldTime + ""}
            style={[styles.editorInputText, { borderBottomWidth: 1, width: 35 }]}
            maxLength={3}
            textAlign="center"
            // style={styles.filterName}
          />
        </View>

        <View style={styles.divider} />
        {showRetentionBreaths &&
          Array.from<number>({ length: state.breathRounds || 0 }).map((_, index) => (
            <View style={styles.editorRow} key={index}>
              <Text style={styles.editorLabelText}>
                {`Retention Breath Round ${index + 1}`}:
              </Text>
              <TextInput
                placeholder=""
                keyboardType="numeric"
                onChangeText={(e) => {
                  const breathLength = parseInt(e.replace(/[^0-9]/g, ""));
                  dispatch({
                    type: "retentionHoldTimes",
                    payload: { index: index + 1, holdTime: breathLength },
                  });
                }}
                value={state?.breathRoundsDetail?.[index + 1].holdTime || "60"}
                style={[styles.editorInputText, { borderBottomWidth: 1, width: 50 }]}
                maxLength={4}
                textAlign="center"
                // style={styles.filterName}
              />
            </View>
          ))} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "purple",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
  },
  editorContainer: {
    paddingHorizontal: 8,
  },
  editorRow: {
    flexDirection: "row",
  },
  editorLabelText: {
    fontSize: 16,
    fontWeight: "600",
  },
  editorInputText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
  divider: {
    marginTop: 10,
  },
});
export default SessionEdit;
