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
import { useBreathMachineInfo } from "../../hooks/useBreathMachineHooks";

type Props = {
  text: string;
  type: "in" | "out"; // whether animation should expand out or contract in
};
function TextAnimation({ text, type }: Props) {
  const [
    {
      context,
      value: currStateValue,
      tags,
      breathState: [breathState, breathStateString],
    },
    send,
  ] = useBreathMachineInfo();
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = type === "out" ? 1 : 0;
    progress.value = withTiming(type === "out" ? 0 : 1, {
      duration: type === "in" ? context.actionPauseTimeIn : context.actionPauseTimeOut,
    });
  }, []);
  //* TEXT
  const textStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.75, 1], [1, 0.8, 0], Extrapolate.CLAMP);
    const scale = interpolate(progress.value, [0, 0.1, 0.75, 1], [0, 1, 2, 3.5]);
    return {
      opacity,
      transform: [{ scaleX: scale }, { scaleY: scale }],
    };
  });

  // Bug in reanimated 2.3.1 can cause an issue.  I have patched file, but any update to package.json undoes it
  // https://github.com/software-mansion/react-native-reanimated/issues/2739
  const rStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(progress.value, [0, 1], ["purple", "#F8F"]);
    const opacity = interpolate(progress.value, [0, 1], [1, 0]);

    const scale = interpolate(progress.value, [0, 0.1, 1], [0, 1, 8]);
    const scaleOut = interpolate(progress.value, [0, 0.1, 1], [0, 1, 8]);
    return {
      opacity,
      backgroundColor: bgColor,
      transform: [
        {
          scaleX: type === "in" ? scale : scaleOut,
        },
        {
          scaleY: type === "in" ? scale : scaleOut,
        },
      ],
    };
  });
  // console.log("breathstate textanim", breathState, breathStateString);

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={[
        {
          flexGrow: 1,
          // borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Animated.View
        style={[rStyle, { width: 100, height: 100, borderRadius: 50, position: "absolute" }]}
      />
      <Animated.View style={[textStyle]}>
        <Text style={{ fontFamily: "FiraSans_500Medium" }}>{text}</Text>
      </Animated.View>
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
export default TextAnimation;
