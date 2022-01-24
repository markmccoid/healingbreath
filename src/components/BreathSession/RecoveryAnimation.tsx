import { AnimatePresence, MotiText, MotiView, useAnimationState } from "moti";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
  Extrapolate,
  withRepeat,
  withSpring,
  timing,
  interpolateColor,
} from "react-native-reanimated";
import HoldAnimation from "./HoldAnimation";
import { useBreathMachineInfo } from "../../hooks/useBreathMachineHooks";

function RecoveryAnimation() {
  const [
    {
      context,
      value: currStateValue,
      tags,
      breathState: [breathState, breathStateString],
    },
    send,
  ] = useBreathMachineInfo();
  const forcedBreathAnim = useSharedValue(0);
  const progress = useSharedValue(0);
  const breathTime = useSharedValue(context.inhaleTime);

  // console.log("breathstatestring", breathStateString);
  const derived = useAnimatedReaction(
    () => {
      return breathStateString; // currBreathState.value;
    },
    (result, previous) => {
      if (result === "Inhale") {
        console.log("Inhale");
        breathTime.value = context.inhaleTime;
        forcedBreathAnim.value = withTiming(1, { duration: breathTime.value });
      } else if (result === "Exhale") {
        console.log("Exhale");
        breathTime.value = context.exhaleTime;
        forcedBreathAnim.value = withTiming(0, { duration: breathTime.value });
      } else {
        console.log("Other");
        breathTime.value = 1000;
        forcedBreathAnim.value = withTiming(1, { duration: 1000 });
        // forcedBreathAnim.value = withSpring(0.25, { stiffness: 90, damping: 8 });
      }
    },
    [breathStateString]
  );

  // Animated Styles
  //* Inhale/Exhale
  const animatedStyles = useAnimatedStyle(() => {
    const scaleUp = interpolate(forcedBreathAnim.value, [0, 0.8, 1], [0.5, 1.2, 1.4]);
    const scaleDown = interpolate(forcedBreathAnim.value, [0, 0.2, 1], [0.5, 0.6, 1.4]);
    return {
      // width: withTiming(offset.value, { duration: breathTime.value }),
      transform: [
        {
          // scale: withTiming(viewScale.value, {
          //   duration: breathTime.value,
          // }),
          scale:
            breathStateString === "Exhale"
              ? scaleDown
              : breathStateString === "Inhale"
              ? scaleUp
              : 0.5, //interpolate(forcedBreathAnim.value, [0, 0.9, 1], [0.5, 1.3, 1.4]),
        },
      ],
    };
  });
  //* TEXT
  const textStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      forcedBreathAnim.value,
      [0, 0.1, 1],
      [0, 0.8, 1],
      Extrapolate.CLAMP
    );
    const scale = interpolate(forcedBreathAnim.value, [0, 1], [0.5, 2]);
    return {
      opacity,
      transform: [
        {
          scale,
        },
      ],
    };
  });

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, [0, 1], ["purple", "#F8F8"]);
    const borderRadius = interpolate(progress.value, [0, 1], [10, 50]);
    return { backgroundColor, borderRadius };
  });
  // console.log("breathstate", breathState, breathStateString);
  React.useEffect(() => {
    progress.value = withTiming(1, { duration: 15000 });
  }, []);
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ flexGrow: 1, borderWidth: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Animated.View style={[styles.box, rStyle]} />
      {/* {breathStateString === "Hold" && <HoldAnimation key="hold" />} */}
      {/* <TouchableOpacity onPress={() => (progress.value = withTiming(1, { duration: 15000 }))}>
        <Text>Change</Text>
      </TouchableOpacity> */}
    </MotiView>
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
export default RecoveryAnimation;
