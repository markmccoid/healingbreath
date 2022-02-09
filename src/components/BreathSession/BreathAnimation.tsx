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
} from "react-native-reanimated";
import { useBreathMachineInfo } from "../../hooks/useBreathMachineHooks";
import { BreathContext } from "../../machines/breathMachine";

function BreathAnimation() {
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
        console.log("Other", currStateValue);
        breathTime.value = 1000;
        forcedBreathAnim.value = withTiming(1, { duration: 1000 });
        // forcedBreathAnim.value = withSpring(0.25, { stiffness: 90, damping: 8 });
      }
    },
    [breathStateString]
  );
  React.useEffect(() => {
    console.log("Breath Animation Alert", alert);
  }, [alert]);

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

  //* Hold Test

  return (
    <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
      {(breathStateString === "Inhale" ||
        breathStateString === "Exhale" ||
        breathStateString === "Breathing Paused") && (
        <>
          <Animated.View style={[styles.box, animatedStyles]} />
          <Animated.View style={[textStyle, { position: "absolute" }]}>
            <Text style={{ fontSize: 40, color: "white" }}>{context.breathCurrRep}</Text>
          </Animated.View>
        </>
      )}
      {/* <Animated.View
        style={[scaleStyle, { backgroundColor: "red", width: 100, height: 100 }]}
      />
      <Animated.View
        style={[scaleIntStyle, { backgroundColor: "blue", width: 100, height: 100 }]}
      /> */}

      {breathStateString === "Hold" && (
        <View style={[{ backgroundColor: "purple", width: 100 }]}>
          <Text>HOLDING</Text>
        </View>
      )}
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
