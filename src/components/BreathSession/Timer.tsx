import { useActor } from "@xstate/react";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// import { useTimer } from "../../hooks/useBreathMachineHooks";
import { useBreathState } from "../../context/breathMachineContext";

const Timer = () => {
  const breathStateServices = useBreathState();
  const [state] = useActor(breathStateServices.breathStateService);
  const elapsed = state.context.elapsed;
  // const tensOfSecond = (((elapsed / 1000) % 1) * 10) >> 0;
  const tensOfSecond = Math.trunc(((elapsed / 1000) % 1) * 10);
  const seconds = Math.trunc(elapsed / 1000) % 60;
  const minutes = Math.trunc(elapsed / 60000 / 60);

  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 20, color: "#8B4B07" }}>{elapsed}</Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 20, color: "#8B4B07" }}>{minutes}.</Text>
        <Text style={{ fontSize: 20, color: "#8B4B07", width: 30 }}>
          {`${seconds < 10 ? `0${seconds}` : `${seconds}`}`}.
        </Text>
        <Text style={{ fontSize: 20, color: "#8B4B07", width: 15 }}>{`${tensOfSecond}`}</Text>
      </View>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({});
