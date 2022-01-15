import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  useAnimatedProps,
  useAnimatedReaction,
  abs,
  interpolate,
  withDecay,
  withDelay,
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
  const offset = useSharedValue(100);
  const breathRoundText = useSharedValue(0.5);
  // const inhaleTime = useSharedValue(context.inhaleTime);
  // const exhaleTime = useSharedValue(context.exhaleTime);
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
      return breathStateString; // currBreathState.value;
    },
    (result, previous) => {
      if (result === "Inhale") {
        console.log("Inhale");
        breathTime.value = context.inhaleTime;
        offset.value = 255;
        breathRoundText.value = 1;
      } else if (result === "Exhale") {
        console.log("Exhale");
        breathTime.value = context.exhaleTime;
        offset.value = 100;
        breathRoundText.value = 0.5;
      }
    },
    [breathStateString]
  );

  // React.useEffect(() => {
  //   // offset.value = withTiming(breath, { duration: 1600 });
  //   currBreathState.value = breathStateString;
  // }, [breathStateString]);
  const textStyle = useAnimatedStyle(() => {
    const opacityVal = interpolate(breathRoundText.value, [0, 0.8, 1], [0, 0, 1]);
    const scaleVal = interpolate(breathRoundText.value, [0, 1], [0.1, 2]);
    return {
      opacity: withTiming(opacityVal, { duration: breathTime.value }),
      transform: [
        { scale: withDelay(300, withTiming(scaleVal, { duration: breathTime.value - 300 })) },
      ],
    };
  });
  return (
    <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
      <Animated.View style={[styles.box, animatedStyles]} />
      <Animated.View style={[textStyle, { position: "absolute" }]}>
        <Text style={{ fontSize: 40, color: "white" }}>{context.breathCurrRep}</Text>
      </Animated.View>
      {/* <Button
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
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "purple",
  },
});
export default Box;
