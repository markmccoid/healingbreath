import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { SessionSettingsType, useBreathState } from "../../context/breathMachineContext";
import {
  useBreathMachineMain,
  useBreathEvents,
  useBreathFlags,
  useBreathMethods,
} from "../../hooks/useBreathMachineHooks";

import Timer from "./Timer";
import BreathAnimation from "./BreathAnimation";

import { ActionButton } from "../../components/buttons/Buttons";

const BreathSession = ({ sessionSettings }: { sessionSettings: SessionSettingsType }) => {
  // console.log("Session", sessionSettings);
  const [{ context, value: currStateValue, breathState }, send] = useBreathMachineMain();
  const [currState, currStateDesc] = breathState;
  const breathEvents = useBreathEvents();
  const breathMethods = useBreathMethods();
  const navigation = useNavigation();
  // const breathState = useBreathState();
  // const [bdata, bsend] = useBreathMachineMain();
  // console.log("CONTEXT", context.breathCurrRep);
  // console.log("BSTATE", currState);

  if (context.sessionComplete) {
    console.log("SESSION", context.sessionStats);
  }
  useEffect(() => {
    console.log("in BreathSession useEffect");
    breathEvents.updateSessionSettings(sessionSettings);
    // breathEvents.updateSessionBreathRounds({
    //   1: {
    //     holdTime: 10000,
    //   },
    //   2: {
    //     holdTime: 20000,
    //   },
    // });
  }, [sessionSettings]);

  return (
    <View>
      <Text>Round - {context.breathCurrRound}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <ActionButton onPress={() => navigation.navigate("SessionList")}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Back</Text>
        </ActionButton>
        <ActionButton onPress={() => breathEvents.startSession()}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Start</Text>
        </ActionButton>
        <View style={{ width: 10 }} />
        <ActionButton onPress={() => breathEvents.stopSession()}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Stop</Text>
        </ActionButton>
        <View style={{ width: 10 }} />
        <ActionButton onPress={() => breathEvents.pauseSession()}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Pause</Text>
        </ActionButton>
        <ActionButton onPress={() => breathEvents.unpauseSession()}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Unpause</Text>
        </ActionButton>
        <View style={{ width: 10 }} />
        <ActionButton onPress={() => breathEvents.extendSession()}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Extend</Text>
        </ActionButton>
        <ActionButton onPress={() => breathEvents.goToNext()}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Next</Text>
        </ActionButton>
      </View>
      <View style={{ borderWidth: 1, padding: 10 }}>
        <Timer type="countup" />
        <Timer type="countdown" />
      </View>
      <View style={{ padding: 10, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 25, color: "#F1820A" }}> {currStateDesc}</Text>
      </View>
      <BreathAnimation />
      <View>
        <Text>{`${context.breathCurrRound} - ${context.breathCurrRep} - ${breathState[0]}`}</Text>
        <Text>{`${context.sessionStart} - ${context.sessionEnd}`}</Text>
        <Text>{`${JSON.stringify(context.sessionStats)}`}</Text>
      </View>
    </View>
  );
};

export default BreathSession;
