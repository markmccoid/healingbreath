import { AnimatePresence, MotiText, MotiView, useAnimationState } from "moti";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedRef,
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
  Easing,
} from "react-native-reanimated";
import HoldAnimation from "./HoldAnimation";
import { useBreathAlert, useBreathMachineInfo } from "../../hooks/useBreathMachineHooks";
import RecoveryAnimation from "./RecoveryAnimation";
import TextAnimation from "./TextAnimation";
import BreathingAnimation from "./BreathingAnimation";
import { LinearGradient } from "expo-linear-gradient";

function SessionAnimations() {
  const [
    {
      context,
      value: currStateValue,
      tags,
      // alert,
      breathState: [breathState, breathStateString],
    },
    send,
  ] = useBreathMachineInfo();
  const forcedBreathAnim = useSharedValue(0);
  const breathTime = useSharedValue(context.inhaleTime);
  const progress = useSharedValue(0);
  const bgColorProgress = useSharedValue(0);
  const myAlert = useBreathAlert();

  React.useEffect(() => {
    if (myAlert) {
      progress.value = withRepeat(
        withTiming(1, { duration: context.inhaleTime, easing: Easing.circle }),
        2,
        true
      );
    }
    // console.log("Breath Animation Alert", myAlert);
  }, [myAlert]);

  // console.log("breathstatestring", breathStateString);
  const derived = useAnimatedReaction(
    () => {
      return breathStateString; // currBreathState.value;
    },
    (result, previous) => {
      if (result === "Inhale") {
        // console.log("Inhale");
        breathTime.value = context.inhaleTime;
        forcedBreathAnim.value = withTiming(1, {
          duration: breathTime.value,
          easing: Easing.bounce,
        });
      } else if (result === "Exhale") {
        // console.log("Exhale");
        breathTime.value = context.exhaleTime;
        forcedBreathAnim.value = withTiming(0, {
          duration: breathTime.value,
          easing: Easing.bounce,
        });
      } else {
        // console.log("Other", currStateValue);
        breathTime.value = 1000;
        forcedBreathAnim.value = withTiming(1, { duration: 1000 });
        // forcedBreathAnim.value = withSpring(0.25, { stiffness: 90, damping: 8 });
      }
    },
    [breathStateString]
  );

  // Animated Styles

  // Need to move the breath state into separate component --> move to breath animation??
  // -- Try to have a hierarchy - BreathSession -> SessionAnimations -> BreathAnimation / HoldAnimation / etc
  // console.log("breathstate", breathState, breathStateString);

  //* Background Animation (color interpolate)
  //* Can be used to animate the background NOTE: needs a useEffect to set the progress value
  // const backgroundAnimated = useAnimatedStyle(() => {
  //   const bgColor = interpolateColor(bgColorProgress.value, [0, 1], ["#7E91B2", "#E1F5FF"]);
  //   return {
  //     // width: withTiming(offset.value, { duration: breathTime.value }),
  //     backgroundColor: bgColor,
  //   };
  // });
  // console.log("breathStateString", breathStateString);
  return (
    <Animated.View
      style={[
        {
          flexGrow: 1,
          // borderWidth: 1,
        },
      ]}
    >
      <LinearGradient
        // Background Linear Gradient
        colors={["#B9C2DB", "#7E91B2dd"]}
        style={StyleSheet.absoluteFill}
      />
      <AnimatePresence exitBeforeEnter>
        {breathState.includes("breathing") && <BreathingAnimation key="breathing" />}
        {breathStateString === "Hold" && <HoldAnimation key="hold" />}
        {breathStateString === "Recovery Hold" && <RecoveryAnimation key="recovery" />}
        {breathStateString === "Intro Pause" && (
          <TextAnimation key="intro" text="Breath In and Hold" type="in" />
        )}
        {breathStateString === "Outro Pause" && (
          <TextAnimation key="outro" text="Breath Out" type="out" />
        )}
      </AnimatePresence>
      {/* {breathStateString === "Hold" && <HoldAnimation key="hold" />} */}
    </Animated.View>
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
export default SessionAnimations;
