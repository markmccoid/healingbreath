import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "@xstate/react";
import { inspect } from "@xstate/inspect";

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

const BreathSession = ({ sessionSettings }) => {
  // console.log("Session", sessionSettings);
  const [{ context, value: currStateValue, breathState }, send] = useBreathMachineMain();
  const [currState, currStateDesc] = breathState;
  const breathEvents = useBreathEvents();
  const breathMethods = useBreathMethods();
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
  }, [sessionSettings]);

  return (
    <View>
      <Text>Breath Session Main</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
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
      </View>
      <View style={{ borderWidth: 1, padding: 10 }}>
        <Timer />
      </View>
      <View style={{ padding: 10, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 25, color: "#F1820A" }}> {currStateDesc}</Text>
      </View>
      <BreathAnimation />
      <View>
        <Text>{`${context.breathCurrRound} - ${context.breathCurrRep}`}</Text>
        <Text>{`${context.sessionStart} - ${context.sessionEnd}`}</Text>
        <Text>{`${JSON.stringify(context.sessionStats)}`}</Text>
      </View>
    </View>
  );
};

export default BreathSession;
