import React from "react";
import { Button, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  useAnimatedProps,
  useAnimatedReaction,
} from "react-native-reanimated";
import { useBreathMachineMain } from "../../hooks/useBreathMachineHooks";
import { BreathContext } from "../../machines/breathMachine";

function Box() {
  const [
    {
      context,
      value: currStateValue,
      breathState: [_, breathStateString],
    },
    send,
  ] = useBreathMachineMain();
  const offset = useSharedValue(1);
  const inhaleTime = useSharedValue(context.inhaleTime);
  const exhaleTime = useSharedValue(context.exhaleTime);
  const breathTime = useSharedValue(context.inhaleTime);
  const currBreathState = useSharedValue<string>(breathStateString);

  const [state, setState] = React.useState("in");
  const [breath, setBreath] = React.useState(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: withTiming(offset.value, { duration: breathTime.value }),
      transform: [{ scale: 1 }],
    };
  });

  const derived = useAnimatedReaction(
    () => {
      return currBreathState.value;
    },
    (result, previous) => {
      if (result === "Inhale") {
        console.log("Inhale");
        breathTime.value = context.inhaleTime;
        offset.value = 255;
      } else if (result === "Exhale") {
        console.log("Exhale");
        breathTime.value = context.exhaleTime;
        offset.value = 0;
      }
    }
  );

  React.useEffect(() => {
    // offset.value = withTiming(breath, { duration: 1600 });
    currBreathState.value = breathStateString;
  }, [breathStateString]);

  return (
    <>
      <Animated.View style={[styles.box, animatedStyles]} />
      <Button
        onPress={() => {
          // offset.value = withTiming(breath, { duration: 1600 });
          setBreath(0);
        }}
        title="out"
      />
      <Button
        onPress={() => {
          // offset.value = withTiming(breath, { duration: 1600 });
          setBreath(200);
        }}
        title="in"
      />
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "purple",
  },
});
export default Box;
