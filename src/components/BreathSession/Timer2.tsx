import { useActor } from "@xstate/react";
import React from "react";
import { StyleSheet, Text, View, ViewStyle, Dimensions } from "react-native";
// import { useTimer } from "../../hooks/useBreathMachineHooks";
import { useBreathState } from "../../context/breathMachineContext";
import useComponentSize from "../../hooks/useComponentSize";
type timerProps = {
  type?: "countdown" | "countup";
  size?: number;
  color?: string;
  timerWidthPositioning: {
    timerWidth: number;
    setTimerWidth: React.Dispatch<React.SetStateAction<number>>;
  };
};

const { width, height } = Dimensions.get("window");

const Timer = ({
  type = "countup",
  size = 25,
  color = "black",
  timerWidthPositioning = { timerWidth: 0, setTimerWidth: () => {} },
}: timerProps) => {
  const [timerWidth, setTimerWidth] = React.useState<number>();
  const [timerPosition, setTimerPosition] = React.useState<number>(0);
  const breathStateServices = useBreathState();
  const [state] = useActor(breathStateServices.breathStateService);
  const elapsed = state.context.elapsed;
  const timeLeft = state.context.timeLeft;

  // const [layoutSize, onLayout] = useComponentSize();

  // console.log("Time Left", timeLeft);
  // Need to know which round we are in for getting correct holdTime
  // maybe create a function that gets the correct hold time
  // Probably have the time component have props:
  // direction: "countDown" | "countUp"
  // timerDuration: number // milliseconds how long timer will be, can be used in countdown to give starting point
  // alertTime: number // milliseconds, Time before timer ends to give a heads up
  // alertFunction: // function to call when alert happens.  Not sure if we need these two.
  //
  let timeString = "0:00";
  const timeChanging = type === "countup" || timeLeft < 0 ? elapsed : timeLeft;
  const timeNegative = type === "countup" ? elapsed < 0 : timeLeft < 0;
  // const tensOfSecond = Math.abs(Math.trunc(((timeChanging / 1000) % 1) * 10)).toString();
  const seconds = Math.abs(Math.trunc(timeChanging / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.abs(Math.trunc(timeChanging / 60000))
    .toString()
    .padStart(2, " ");
  // const timeString = `${timeNegative ? "-" : ""}${minutes}:${seconds}.${tensOfSecond}`;
  // const timeString = `${timeNegative ? "-" : ""}${minutes}:${seconds}`;
  timeString = `${minutes} : ${seconds}`;
  // Need to use a callback + conditional call onLayout since
  // we are modifying the underlying view.
  const onLayout = React.useCallback((e) => {
    console.log("in on layout", e.nativeEvent.layout.width);
    setTimerWidth(e.nativeEvent.layout.width + 20);
    timerWidthPositioning?.setTimerWidth(e.nativeEvent.layout.width + 20);
    // setTimerPosition((width - e.nativeEvent.layout.width) / 2);
  }, []);

  return (
    <View>
      {/* <View onLayout={timerWidth ? () => {} : onLayout}> */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          // width: timerWidth,
          // paddingHorizontal: 5,
        }}
      >
        <Text style={{ fontFamily: "FiraSans_500Medium", fontSize: size, color }}>
          {timeString}
        </Text>
      </View>
      {/* </View> */}
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({});
