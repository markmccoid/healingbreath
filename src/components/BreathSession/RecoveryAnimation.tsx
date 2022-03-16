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

  // Animated Styles
  const rStyle = useAnimatedStyle(() => {
    // const backgroundColor = interpolateColor(progress.value, [0, 1], ["purple", "#F8F8"]);
    const borderRadius = interpolate(progress.value, [0, 1], [10, 50]);
    return {
      // backgroundColor,
      borderRadius,
    };
  });
  // console.log("breathstate", breathState, breathStateString);
  React.useEffect(() => {
    progress.value = withTiming(1, { duration: context.recoveryHoldTime });
  }, []);
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
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
