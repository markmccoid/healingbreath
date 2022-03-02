import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackProps } from "../../types/navTypes";
import { BreathMachineProvider } from "../../context/breathMachineContext";
import BreathSession from "../../components/BreathSession/BreathSession";
import { AdjustingInterval } from "../../utils/timerAdjustingInterval";
import { useStore } from "../../store/useStore";
import { useKeepAwake } from "expo-keep-awake";

const Session = ({ navigation, route }: RootStackProps<"Session">) => {
  // Keeps the screen from sleeping during a session
  useKeepAwake();
  // retrieve the active session
  const activeSession = useStore((state) => state.getActiveSessionSettings());
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BreathMachineProvider>
        <BreathSession sessionSettings={activeSession} />
      </BreathMachineProvider>
    </SafeAreaView>
  );
};

export default Session;
