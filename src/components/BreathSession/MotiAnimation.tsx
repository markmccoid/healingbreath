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
} from "react-native-reanimated";
import HoldAnimation from "./HoldAnimation";
import { useBreathMachineInfo } from "../../hooks/useBreathMachineHooks";

function BreathAnimation() {
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

  React.useEffect(() => {
    switch (breathStateString) {
      case "Idle":
        animationState.transitionTo("other");
        textAnimState.transitionTo("other");
        break;
      case "Inhale":
        animationState.transitionTo("inhale");
        textAnimState.transitionTo("inhale");
        break;
      case "Exhale":
        animationState.transitionTo("exhale");
        textAnimState.transitionTo("exhale");
        break;
      case "Breathing Paused":
        animationState.transitionTo("paused");
        textAnimState.transitionTo("paused");
        break;
      default:
        animationState.transitionTo("other");
        textAnimState.transitionTo("other");
        break;
    }
    // if (breathStateString === "Inhale") {
    //   animationState.transitionTo("inhale");
    //   textAnimState.transitionTo("inhale");
    // } else if (breathStateString === "Exhale") {
    //   animationState.transitionTo("exhale");
    //   textAnimState.transitionTo("exhale");
    // }
  }, [breathStateString]);
  //* Hold Test
  const animationState = useAnimationState({
    from: { opacity: 0, scale: 0.5 },
    // to: { opacity: 1 },
    inhale: {
      scale: 1.4,
    },
    exhale: {
      scale: 0.5,
    },
    paused: {
      scale: 2.5,
    },
    other: {
      scale: 0.5,
    },
  });
  const textAnimState = useAnimationState({
    inhale: {
      scale: 3,
      opacity: 1,
    },
    exhale: {
      scale: 1,
      opacity: 0,
    },
    paused: {
      // scale: 1,
      // opacity: 0,
    },
    other: {
      scale: 1,
      opacity: 0,
    },
  });
  // console.log("breathstate", breathState, breathStateString);

  return (
    <View style={{ flexGrow: 1, borderWidth: 1 }}>
      <AnimatePresence exitBeforeEnter>
        {breathState.includes("breathing") ? (
          <View style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
            <MotiView
              key="breathing"
              state={animationState}
              from={{ opacity: 0, scale: 0.5, translateY: 0 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: "timing",
                duration: context.inhaleTime,
              }}
              exit={{ opacity: 0, scale: 0.5, translateY: 500 }}
              exitTransition={{ type: "timing", duration: 1500 }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "purple",
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
            />
            <MotiText
              state={textAnimState}
              from={{ opacity: 0, scale: 0.5 }}
              transition={{
                type: "timing",
                duration: context.inhaleTime,
              }}
              exit={{ opacity: 0, scale: 0.1 }}
              exitTransition={{ type: "timing", duration: 500 }}
              style={{ position: "absolute", fontSize: 28, color: "white" }}
            >
              {context.breathCurrRep}
            </MotiText>
          </View>
        ) : null}
      </AnimatePresence>
      {breathStateString === "Hold" && <HoldAnimation key="hold" />}
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
export default BreathAnimation;
