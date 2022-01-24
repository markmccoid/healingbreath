import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackProps } from "../../types/navTypes";
import { BreathMachineProvider } from "../../context/breathMachineContext";
import BreathSession from "../../components/BreathSession/BreathSession";
import { AdjustingInterval } from "../../utils/timerAdjustingInterval";
import { usePubSub, DefaultPubSubContext } from "usepubsub";

const sampleMachineSettings = {
  interval: 100,
  inhaleTime: 1.6 * 1000,
  exhaleTime: 1.6 * 1000,
  pauseTime: 0,
  breathReps: 4,
  breathRounds: 3,
  defaultHoldTime: 5 * 1000,
  recoveryHoldTime: 15 * 1000,
  actionPauseTimeIn: 3 * 1000,
  actionPauseTimeOut: 3 * 1000,
  breathRoundsDetail: {
    1: {
      holdTime: 12000,
    },
    2: {
      holdTime: 8000,
    },
  },
};
const Session = ({ navigation, route }: RootStackProps<"Session">) => {
  let { PubSubContext, publish, subscribe, unsubscribe } = usePubSub();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BreathMachineProvider>
        <PubSubContext.Provider value={{ publish, subscribe, unsubscribe }}>
          <BreathSession sessionSettings={sampleMachineSettings} />
        </PubSubContext.Provider>
      </BreathMachineProvider>
    </SafeAreaView>
  );
};

export default Session;
