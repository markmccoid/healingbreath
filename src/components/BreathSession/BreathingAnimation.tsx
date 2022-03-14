import React from "react";
import { View } from "react-native";
import { MotiView, MotiText } from "@motify/components";
import { useBreathMachineInfo } from "../../hooks/useBreathMachineHooks";
import { Easing } from "react-native-reanimated";
import { useAnimationState } from "@motify/core";

const BreathingAnimation = () => {
  const [
    {
      context,
      value: currStateValue,
      tags,
      alert,
      breathState: [_, breathStateString],
    },
    send,
  ] = useBreathMachineInfo();

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

  return (
    <View
      style={{
        backgroundColor: "#777def",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MotiView
        key="breathing"
        state={animationState}
        from={{ opacity: 0, scale: 0.5, translateY: 0, backgroundColor: "purple" }}
        animate={{ opacity: 1, translateY: 0, backgroundColor: "red" }}
        transition={{
          type: "timing",
          duration:
            breathStateString === "Inhale"
              ? context.inhaleTime
              : breathStateString === "Exhale"
              ? context.exhaleTime
              : 1,
          easing: Easing.ease,
        }}
        exit={{ opacity: 0, scale: 0.5, translateY: 500 }}
        exitTransition={{ type: "timing", duration: 1500 }}
        style={{
          justifyContent: "center",
          alignItems: "center",

          width: 200,
          height: 200,
          borderRadius: 100,
        }}
      />
      <MotiText
        state={textAnimState}
        from={{ opacity: 0, scale: 0.5 }}
        transition={{
          type: "timing",
          duration:
            breathStateString === "Inhale"
              ? context.inhaleTime
              : breathStateString === "Exhale"
              ? context.exhaleTime
              : 1,
        }}
        exit={{ opacity: 0, scale: 0.1 }}
        exitTransition={{ type: "timing", duration: 500 }}
        style={{ position: "absolute", fontSize: 28, color: "white" }}
      >
        {context.breathCurrRep}
      </MotiText>
    </View>
  );
};

export default BreathingAnimation;
