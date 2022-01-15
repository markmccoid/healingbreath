import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RootStackProps } from "../../types/navTypes";
import { BreathMachineProvider } from "../../context/breathMachineContext";
import BreathSession from "../../components/BreathSession/BreathSession";
import { AdjustingInterval } from "../../utils/timerAdjustingInterval";

const sampleMachineSettings = {
  interval: 100,
  inhaleTime: 2 * 1000,
  exhaleTime: 2 * 1000,
  pauseTime: 0,
  breathReps: 2,
  breathRounds: 3,
  holdTime: 6 * 1000,
  recoveryHoldTime: 5 * 1000,
  actionPauseTimeIn: 1 * 1000,
  actionPauseTimeOut: 1 * 1000,
};
const Session = ({ navigation, route }: RootStackProps<"Session">) => {
  return (
    <View>
      <Text>Session Screen</Text>
      <BreathMachineProvider>
        <BreathSession sessionSettings={sampleMachineSettings} />
      </BreathMachineProvider>
      <TouchableOpacity onPress={() => navigation.navigate("Main Modal")}>
        <Text>Show Modal</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Session;
