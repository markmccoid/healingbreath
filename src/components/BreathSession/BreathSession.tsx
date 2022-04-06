import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { SessionSettingsType, useBreathState } from "../../context/breathMachineContext";
import {
  useBreathMachineInfo,
  useBreathEvents,
  useBreathFlags,
  useBreathMethods,
} from "../../hooks/useBreathMachineHooks";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import Timer from "./Timer";
// import BreathAnimation from "./BreathAnimation";
import SessionAnimations from "./SessionAnimations";

import { ActionButton } from "../../components/buttons/Buttons";
import { AlertSettings } from "../../utils/alertTypes";
import BreathInterface from "./breathInterface/BreathInterface";

type Props = {
  sessionSettings: SessionSettingsType;
  activeAlerts: AlertSettings | undefined;
};

const BreathSession = ({ sessionSettings, activeAlerts }: Props) => {
  // console.log("Session", sessionSettings);
  // const breathStateServices = useBreathState();
  // const [{ context, alert, value: currStateValue, breathState }, send] =
  //   useBreathMachineInfo();
  const [
    {
      context,
      value: currStateValue,
      tags,
      // alert,
      breathState: [breathState, breathStateString],
      currBreathRoundHoldTime,
    },
    send,
  ] = useBreathMachineInfo();
  // const [breathState, breathStateString] = breathState;
  const breathEvents = useBreathEvents();
  const breathFlags = useBreathFlags();
  const navigation = useNavigation();
  //************************ */

  if (context.sessionComplete) {
    console.log("SESSION", context.sessionStats);
  }

  // useEffect(() => {
  //   console.log("alert has been alerted", alert);
  // }, [alert]);

  // useEffect(() => {
  //   console.log("Session Idle", context.sessionStats);
  // }, [breathState.includes("idle")]);

  //* ------------------------------
  //* SETUP SESSION SETTINGS
  //* This useEffect is where we send over the
  //* the sessionSettings that are selected as
  //* "activeSession" in the store.
  //* ------------------------------
  useEffect(() => {
    breathEvents.updateSessionSettings(sessionSettings);
  }, [sessionSettings]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 40,
          backgroundColor: "#B9C2DB",
          borderTopColor: "#4A5568",
          borderBottomColor: "#4A5568",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            //Stop the session before navigating away
            breathEvents.stopSession();
            navigation.navigate("SessionList");
          }}
        >
          <AntDesign name="back" size={25} style={{ marginTop: -5 }} />
          {/* <Text style={{ fontSize: 20 }}>Back</Text> */}
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 10,
            flexDirection: "row",
            justifyContent: "flex-start",
            flex: 1,
          }}
        >
          <Text style={[styles.infoText, { fontWeight: "600" }]}>
            Round - {context.breathCurrRound}
          </Text>
          <View style={styles.spacerSmall} />
          {breathState.includes("breathing") && (
            <Text style={styles.infoText}>Rep - {context.breathCurrRep}</Text>
          )}
          <View style={styles.spacerSmall} />
          {breathState.includes("holding") && (
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.infoText}>Hold Time</Text>
              {/* <Timer type="countdown" size={18} /> */}
              <Text style={[{ marginLeft: 5 }, styles.infoText]}>
                {currBreathRoundHoldTime}
              </Text>
            </View>
          )}
        </View>
      </View>
      {/* Buttons for Start/Stop/Next/Pause and Timer  */}
      <BreathInterface />
      {/* Controls the animations for Breathing,holding and recovery breath */}
      <SessionAnimations />
    </View>
  );
};

const styles = StyleSheet.create({
  spacerSmall: {
    width: 5,
  },
  spacerMed: {
    width: 10,
  },
  infoText: {
    fontSize: 18,
  },
});
export default BreathSession;
