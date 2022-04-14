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
import { useTheme } from "../context/themeContext";
import { Theme } from "../theme";
import Svg, { Circle, G } from "react-native-svg";
import { withPause } from "react-native-redash";

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
function SVGTest() {
  const { theme } = useTheme();

  const progress = useSharedValue(0);
  const constantProgress = useSharedValue(1);
  const isPaused = useSharedValue(false);

  const [step, setStep] = React.useState(0);
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const moveForward = () => {
    setStep((prev) => prev + 0.2);
  };
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
    progress.value = withPause(withTiming(1, { duration: 15 }), isPaused);
  }, []);

  //-- Deal with paused state by setting the isPaused shared value
  React.useEffect(() => {}, []);

  React.useEffect(() => {
    if (true) {
      constantProgress.value = withPause(
        withRepeat(withTiming(-1, { duration: 15, easing: Easing.linear }), 0),
        isPaused
      );
    } else if (false) {
      console.log("inElse", constantProgress.value);
      constantProgress.value = withTiming(1, {
        duration: 1500,
        easing: Easing.linear,
      });
    }
  }, []);

  //-- Set the animated stroke property
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: MAIN_CIRCUMFERENCE * (1 - progress.value),
  }));
  //-- Set the animated Inner stroke property
  const animatedInnerProps = useAnimatedProps(() => ({
    strokeDashoffset: INNER_CIRCUMFERENCE * constantProgress.value,
  }));
  // console.log("constantProgress", constantProgress.value);
  const CIRCUMFERENCE = 400;
  const R = CIRCUMFERENCE / (Math.PI * 2);
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ flexGrow: 1, justifyContent: "center", alignItems: "center", borderWidth: 2 }}
    >
      {/* <Text style={{ position: "absolute", fontSize: 28, fontWeight: "600" }}>100</Text> */}
      <View style={{ position: "absolute" }}>
        <Text>15</Text>
      </View>
      <Svg
        width={200}
        height={200}
        viewBox={`0 0 ${230} ${230}`}
        style={{ borderWidth: 1 }}
        // viewBox={`-50 -50 ${200} ${200}`}
        // style={{ borderWidth: 1 }}
        // width={MAIN_DIAMETER}
        // height={MAIN_DIAMETER}
        // viewBox={`0 0 ${MAIN_DIAMETER + STROKE_WIDTH * 2} ${MAIN_DIAMETER + STROKE_WIDTH * 2}`}
        // style={{ borderWidth: 1 }}
      >
        {/* <G rotation="-90" origin={`${100 + 10}, ${100 + 10}`}> */}
        <Circle
          cx={"50%"}
          cy={"50%"}
          fill={"red"}
          r={R}
          stroke={"blue"}
          strokeWidth={15}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE - 20} //{CIRCUMFERENCE * (1 - step)}
          rotation="-90"
          origin={`${100 + 15}, ${100 + 15}`}
        />
        {/* </G> */}
        {/* <G
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

          <AnimatedCircle
            cx={"50%"}
            cy={"50%"}
            r={INNER_RADIUS}
            stroke="green"
            strokeWidth={20}
            strokeDasharray={`100 ${INNER_CIRCUMFERENCE - 100}`}
            // strokeDashoffset={}
            // strokeDasharray={INNER_CIRCUMFERENCE}
            // animatedProps={animatedInnerProps}
            strokeDashoffset={50}
            strokeLinecap={"round"}
            // strokeDashoffset={CIRCLE_LENGTH * 0.5}
          />
        </G> */}
      </Svg>
      {/* <Animated.View style={[styles.box, rStyle]} /> */}
      {/* {breathStateString === "Hold" && <HoldAnimation key="hold" />} */}
      {/* <TouchableOpacity onPress={() => (progress.value = withTiming(1, { duration: 15000 }))}>
        <Text>Change</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={{ borderWidth: 1, borderRadius: 5, padding: 5 }}
        onPress={moveForward}
      >
        <Text>Increase</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ borderWidth: 1, borderRadius: 5, padding: 5 }}
        onPress={() => setStep(0)}
      >
        <Text>clear</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20 }}>{1 - step}</Text>
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
export default SVGTest;
