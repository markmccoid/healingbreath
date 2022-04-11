import { AnimatePresence, MotiText, MotiView, useAnimationState } from "moti";
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { useBreathMachineInfo } from "../../hooks/useBreathMachineHooks";
import { useTheme } from "../../context/themeContext";
import { Theme } from "../../theme";
import Svg, { Circle, G } from "react-native-svg";
import { withPause } from "react-native-redash";

import Timer from "./Timer";

const { width, height } = Dimensions.get("window");

const MARGIN = 20;
const BACKGROUND_COLOR = "#444B6F";
const BACKGROUND_STROKE_COLOR = "#303858";
const STROKE_COLOR = "#A6E1FA";
const STROKE_WIDTH = 30;

// Main Circle
const MAIN_RADIUS = width / 2 - MARGIN;
const MAIN_DIAMETER = MAIN_RADIUS * 2;
const MAIN_CIRCUMFERENCE = 2 * Math.PI * MAIN_RADIUS;
//const CIRCLE_LENGTH = 1000; // 2PI * R
//const R = CIRCLE_LENGTH / (2 * Math.PI);

const INNER_RADIUS = MAIN_RADIUS / 1.15;
const INNER_DIAMETER = INNER_RADIUS * 2;
const INNER_CIRCUMFERENCE = 2 * Math.PI * INNER_RADIUS; // 2PI * R

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
function RecoveryAnimation() {
  const { theme } = useTheme();
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
  const constantProgress = useSharedValue(1);
  const isPaused = useSharedValue(false);

  const breathTime = useSharedValue(context.inhaleTime);

  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // console.log("breathstatestring", breathStateString);

  // Animated Styles
  // const rStyle = useAnimatedStyle(() => {
  //   // const backgroundColor = interpolateColor(progress.value, [0, 1], ["purple", "#F8F8"]);
  //   const borderRadius = interpolate(progress.value, [0, 1], [10, 50]);
  //   const height = interpolate(progress.value, [0, 1], [100, 200]);
  //   const width = interpolate(progress.value, [0, 1], [100, 50]);
  //   return {
  //     // backgroundColor,
  //     borderBottomEndRadius: borderRadius,
  //     borderBottomLeftRadius: borderRadius,
  //     height,
  //     width,
  //   };
  // });
  // console.log("breathstate", breathState, breathStateString);

  //-- Setup animation progress value with Pausing functionality
  React.useEffect(() => {
    progress.value = withPause(
      withTiming(1, { duration: context.recoveryHoldTime }),
      isPaused
    );
  }, []);

  //-- Deal with paused state by setting the isPaused shared value
  React.useEffect(() => {
    if (breathState.includes("pause")) {
      isPaused.value = true;
    } else {
      isPaused.value = false;
    }
  }, [breathState]);

  React.useEffect(() => {
    if (context.extend) {
      constantProgress.value = withPause(
        withRepeat(
          withTiming(-1, { duration: context.recoveryHoldTime, easing: Easing.linear }),
          0
        ),
        isPaused
      );
    } else if (!context.extend) {
      console.log("inElse", constantProgress.value);
      constantProgress.value = withTiming(1, {
        duration: 1500,
        easing: Easing.linear,
      });
    }
    console.log("constantPorgre", constantProgress.value);
  }, [context.extend]);

  //-- Set the animated stroke property
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: MAIN_CIRCUMFERENCE * (1 - progress.value),
  }));
  //-- Set the animated Inner stroke property
  const animatedInnerProps = useAnimatedProps(() => ({
    strokeDashoffset: INNER_CIRCUMFERENCE * constantProgress.value,
  }));
  // console.log("constantProgress", constantProgress.value);
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ flexGrow: 1, justifyContent: "center", alignItems: "center", borderWidth: 2 }}
    >
      {/* <Text style={{ position: "absolute", fontSize: 28, fontWeight: "600" }}>100</Text> */}
      <View style={{ position: "absolute" }}>
        <Timer size={35} type="countdown" />
      </View>
      <Svg
        width={MAIN_DIAMETER}
        height={MAIN_DIAMETER}
        viewBox={`0 0 ${MAIN_DIAMETER + STROKE_WIDTH * 2} ${MAIN_DIAMETER + STROKE_WIDTH * 2}`}
        style={{ borderWidth: 1 }}
      >
        <G
          rotation="-90"
          origin={`${MAIN_RADIUS + STROKE_WIDTH}, ${MAIN_RADIUS + STROKE_WIDTH}`}
        >
          <Circle
            cx={"50%"}
            cy={"50%"}
            r={MAIN_RADIUS}
            stroke={BACKGROUND_STROKE_COLOR}
            strokeWidth={STROKE_WIDTH}
          />
          <AnimatedCircle
            cx={"50%"}
            cy={"50%"}
            r={MAIN_RADIUS}
            stroke={STROKE_COLOR}
            strokeWidth={15}
            strokeDasharray={MAIN_CIRCUMFERENCE}
            animatedProps={animatedProps}
            strokeLinecap={"round"}
            // strokeDashoffset={CIRCLE_LENGTH * 0.5}
          />
          {context.extend && (
            <AnimatedCircle
              cx={"50%"}
              cy={"50%"}
              r={INNER_RADIUS}
              stroke="green"
              strokeWidth={20}
              strokeDasharray={INNER_CIRCUMFERENCE}
              animatedProps={animatedInnerProps}
              // strokeDashoffset={-875}
              strokeLinecap={"round"}
              // strokeDashoffset={CIRCLE_LENGTH * 0.5}
            />
          )}
        </G>
      </Svg>
      {/* <Animated.View style={[styles.box, rStyle]} /> */}
      {/* {breathStateString === "Hold" && <HoldAnimation key="hold" />} */}
      {/* <TouchableOpacity onPress={() => (progress.value = withTiming(1, { duration: 15000 }))}>
        <Text>Change</Text>
      </TouchableOpacity> */}
    </MotiView>
  );
}

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    box: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primaryBG,
    },
  });
  return styles;
};
export default RecoveryAnimation;
