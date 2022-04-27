import { AnimatePresence, MotiText, MotiView, useAnimationState } from "moti";
import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  withRepeat,
  Easing,
  withDelay,
} from "react-native-reanimated";

import { useTheme } from "../../context/themeContext";
import { Theme } from "../../theme";
import Svg, { Circle, G, Path } from "react-native-svg";
import { withPause } from "react-native-redash";

const { width, height } = Dimensions.get("window");

const MARGIN = 20;
const BACKGROUND_COLOR = "#444B6F";
const BACKGROUND_STROKE_COLOR = "green";
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

const AnimatedPath = Animated.createAnimatedComponent(Path);

function ExtendIndicator({
  isExtending,
  isPaused,
  delayMS = 0,
  offsetExtra = 0,
  lengthMS = 5000,
}: {
  isExtending: boolean;
  isPaused: Animated.SharedValue<boolean>;
  delayMS?: number;
  offsetExtra?: number;
  lengthMS?: number;
}) {
  if (!isExtending) {
    return null;
  }
  const { theme } = useTheme();
  const extendedAnimation = useSharedValue(0);

  const styles = React.useMemo(() => createStyles(theme), [theme]);

  //-- Deal with paused state by setting the isPaused shared value

  React.useEffect(() => {
    if (isExtending) {
      extendedAnimation.value = 0;
      extendedAnimation.value = withDelay(
        delayMS,
        withRepeat(
          withPause(withTiming(1, { duration: lengthMS, easing: Easing.linear }), isPaused),
          0
        )
      );

      // constantProgress.value = withPause(
      //   withRepeat(
      //     withTiming(1, { duration: context.recoveryHoldTime / 2, easing: Easing.linear }),
      //     0
      //   ),
      //   isPaused
      // );
    } else if (!isExtending) {
      // Issues with stopping extending and restarting
      // Just stopping timing and setting back to zero
      extendedAnimation.value = withTiming(0, {
        duration: 1500,
        easing: Easing.linear,
      });
    }
  }, [isExtending]);

  //-- Set the animated stroke property for line
  const animatedLineProps = useAnimatedProps(() => ({
    strokeDashoffset: width * (1 - extendedAnimation.value) + offsetExtra,
    // strokeDashoffset: INNER_CIRCUMFERENCE * constantProgress.value,
  }));
  // console.log("constantProgress", constantProgress.value);
  return (
    <>
      <Svg width={width} height={15} viewBox={`0 0 ${width} 15`}>
        <AnimatedPath
          d={`M 0 7.5 H ${width}`}
          fill="red"
          stroke={BACKGROUND_STROKE_COLOR}
          strokeWidth={15}
          strokeDasharray={width / 2}
          // strokeDashoffset={200 * (1 - 0.2)}
          animatedProps={animatedLineProps}
          strokeLinecap="round"
        />
      </Svg>
    </>
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
export default ExtendIndicator;
