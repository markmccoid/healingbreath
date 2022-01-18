import { useActor } from "@xstate/react";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// import { useTimer } from "../../hooks/useBreathMachineHooks";
import { useBreathState } from "../../context/breathMachineContext";

const Timer = ({ type = "countup" }: { type: "countdown" | "countup" }) => {
  const [timerWidth, setTimerWidth] = React.useState<number>();
  const breathStateServices = useBreathState();
  const [state] = useActor(breathStateServices.breathStateService);
  const elapsed = state.context.elapsed;
  const timeLeft = state.context.timeLeft;
  // console.log("Time Left", timeLeft);
  // Need to know which round we are in for getting correct holdTime
  // maybe create a function that gets the correct hold time
  // Probably have the time component have props:
  // direction: "countDown" | "countUp"
  // timerDuration: number // milliseconds how long timer will be, can be used in countdown to give starting point
  // alertTime: number // milliseconds, Time before timer ends to give a heads up
  // alertFunction: // function to call when alert happens.  Not sure if we need these two.
  //

  const timeChanging = type === "countup" ? elapsed : timeLeft;
  const timeNegative = type === "countup" ? elapsed < 0 : timeLeft < 0;
  const tensOfSecond = Math.abs(Math.trunc(((timeChanging / 1000) % 1) * 10)).toString();
  const seconds = Math.abs(Math.trunc(timeChanging / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.abs(Math.trunc(timeChanging / 60000))
    .toString()
    .padStart(2, "0");
  const timeString = `${timeNegative ? "-" : ""}${minutes}:${seconds}.${tensOfSecond}`;

  // Need to use a callback + conditional call onLayout since
  // we are modifying the underlying view.
  const onLayout = React.useCallback((e) => {
    setTimerWidth(e.nativeEvent.layout.width + 20);
    // console.log("containerWidth", e.nativeEvent.layout.width + 10);
  }, []);

  return (
    <View style={{ alignItems: "center" }}>
      <View onLayout={timerWidth ? () => {} : onLayout}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            width: timerWidth,
            paddingLeft: 5,
          }}
        >
          <Text style={{ fontSize: 20, color: "#8B4B07" }}>{timeString}</Text>
        </View>
      </View>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({});
