import { AnimatePresence, MotiText, MotiView, useAnimationState } from "moti";
import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { useBreathMachineInfo, useBreathEvents } from "../../hooks/useBreathMachineHooks";
import { useTheme } from "../../context/themeContext";
import { Theme } from "../../theme";
import Svg, { Circle, G, Path } from "react-native-svg";
import { withPause } from "react-native-redash";

import Timer from "./Timer";
import ExtendIndicator from "./ExtendIndicator";
import { useLayout } from "../../hooks/useLayout";

const { width, height } = Dimensions.get("window");

const MARGIN = 20;
const BACKGROUND_COLOR = "#444B6F";

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
const AnimatedPath = Animated.createAnimatedComponent(Path);
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
  const { extendSession } = useBreathEvents();
  const progress = useSharedValue(0);
  const constantProgress = useSharedValue(0);
  const extendedAnimation = useSharedValue(0);
  // const constantProgress = useSharedValue(1);
  const isPaused = useSharedValue(false);

  const breathTime = useSharedValue(context.inhaleTime);
  const [{ height: containerHeight }, onLayoutContainer] = useLayout();

  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const BACKGROUND_STROKE_COLOR = theme.colors.donutStrokeBG;
  const STROKE_COLOR = theme.colors.donutStrokeFG;
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
      extendedAnimation.value = 0;
      extendedAnimation.value = withRepeat(
        withPause(
          withTiming(1, { duration: context.recoveryHoldTime / 2, easing: Easing.linear }),
          isPaused
        ),
        0
      );

      // constantProgress.value = withPause(
      //   withRepeat(
      //     withTiming(1, { duration: context.recoveryHoldTime / 2, easing: Easing.linear }),
      //     0
      //   ),
      //   isPaused
      // );
    } else if (!context.extend) {
      // Issues with stopping extending and restarting
      // Just stopping timing and setting back to zero
      extendedAnimation.value = withTiming(0, {
        duration: 1500,
        easing: Easing.linear,
      });
    }
  }, [context.extend]);

  //-- Set the animated stroke property
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: MAIN_CIRCUMFERENCE * (1 - progress.value),
  }));
  //-- Set the animated Inner stroke property
  const animatedInnerProps = useAnimatedProps(() => ({
    strokeDashoffset: INNER_CIRCUMFERENCE * (1 - extendedAnimation.value),
    // strokeDashoffset: INNER_CIRCUMFERENCE * constantProgress.value,
  }));
  const animatedLineProps = useAnimatedProps(() => ({
    strokeDashoffset: 400 * (1 - extendedAnimation.value),
    // strokeDashoffset: INNER_CIRCUMFERENCE * constantProgress.value,
  }));
  // console.log("constantProgress", constantProgress.value);
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ flexGrow: 1, justifyContent: "center", alignItems: "center", borderWidth: 0 }}
      onLayout={containerHeight ? undefined : onLayoutContainer}
    >
      {/* <Text style={{ position: "absolute", fontSize: 28, fontWeight: "600" }}>100</Text> */}
      <View style={{ position: "absolute" }}>
        <Timer size={35} type="countdown" />
      </View>

      {/* <ExtendIndicator isExtending={context.extend} isPaused={isPaused} />
       */}
      {/* Top ExtendIndicator */}
      <View
        style={{
          position: "absolute",
          bottom: containerHeight / 2 + MAIN_RADIUS - 12,
        }}
      >
        <ExtendIndicator
          isExtending={context.extend}
          isPaused={isPaused}
          offsetExtra={250}
          lengthMS={3500}
        />
      </View>
      {context.extend && (
        <MotiView
          from={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 2500 }}
          style={{
            position: "absolute",
            bottom: containerHeight / 2 + MAIN_RADIUS,
            width: width,
          }}
        >
          <Text
            // animatedProps={animatedTextProps}
            style={{ textAlign: "center", color: "#00000066", fontSize: 28 }}
          >
            Extending Hold
          </Text>
        </MotiView>
      )}
      {/* Bottom ExtendIndicator */}
      <View style={{ position: "absolute", top: containerHeight / 2 + MAIN_RADIUS - 12 }}>
        <ExtendIndicator isExtending={context.extend} isPaused={isPaused} />
      </View>

      {/* Mimic the Inner Circle for a touchable area that will toggle the extend session */}
      <TouchableOpacity
        onPress={() => extendSession()}
        style={{
          position: "absolute",
          width: INNER_DIAMETER,
          height: INNER_DIAMETER,
          borderRadius: INNER_RADIUS,
          zIndex: 1000,
        }}
      ></TouchableOpacity>

      <Svg
        width={MAIN_DIAMETER}
        height={MAIN_DIAMETER}
        viewBox={`0 0 ${MAIN_DIAMETER + STROKE_WIDTH * 2} ${MAIN_DIAMETER + STROKE_WIDTH * 2}`}
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
          {/* {context.extend && (
            <AnimatedCircle
              cx={"50%"}
              cy={"50%"}
              r={INNER_RADIUS}
              stroke="green"
              strokeWidth={20}
              strokeDasharray={`100 ${INNER_CIRCUMFERENCE - 100}`}
              // strokeDashoffset={}
              // strokeDasharray={INNER_CIRCUMFERENCE}
              animatedProps={animatedInnerProps}
              // strokeDashoffset={INNER_CIRCUMFERENCE * 0.95}
              strokeLinecap={"round"}
              // strokeDashoffset={CIRCLE_LENGTH * 0.5}
            />
          )} */}
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
