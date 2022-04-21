import { AnimatePresence, MotiText, MotiView, useAnimationState } from "moti";
import React from "react";
import { Dimensions, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useBreathState } from "../../context/breathMachineContext";
import { useBreathMachineInfo, useBreathEvents } from "../../hooks/useBreathMachineHooks";
import { useLayout } from "../../hooks/useLayout";
import { getCurrentRoundHoldTime } from "../../utils/machineHelpers";
import Timer from "./Timer";
import LottieView, { AnimatedLottieViewProps } from "lottie-react-native";
import ExtendIndicator from "./ExtendIndicator";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  interpolate,
  withRepeat,
  withDelay,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const AnimatedText = Animated.createAnimatedComponent(Text);

function HoldAnimation() {
  const isPaused = useSharedValue(false);
  const textAnim = useSharedValue(0);
  const lottieRefTop = React.useRef<AnimatedLottieViewProps>();
  const lottieRefBottom = React.useRef<AnimatedLottieViewProps>();
  const [
    {
      context,
      value: currStateValue,
      tags,
      alert,
      breathState: [breathState, breathStateString],
    },
    send,
  ] = useBreathMachineInfo();
  const { extendSession } = useBreathEvents();
  const [{ height: animHeight }, onLayout] = useLayout();
  const [{ height: containerHeight }, onLayoutContainer] = useLayout();

  const currHoldTime = getCurrentRoundHoldTime(context);
  //* Hold Test
  const animationState = useAnimationState({
    inhale: {
      scale: 1.4,
    },
    exhale: {
      scale: 0.5,
    },
    other: {
      scale: 0.5,
    },
  });

  React.useEffect(() => {
    // console.log("Hold Animation Alert", alert);
  }, [alert]);

  //-- Deal with paused state by setting the isPaused shared value
  React.useEffect(() => {
    if (breathState.includes("pause")) {
      isPaused.value = true;
      lottieRefTop.current?.pause();
      lottieRefBottom.current?.pause();
    } else {
      isPaused.value = false;
      lottieRefTop.current?.resume();
      lottieRefBottom.current?.resume();
    }
  }, [breathState]);

  React.useEffect(() => {
    if (context.extend) {
      textAnim.value = withDelay(1750, withRepeat(withTiming(1, { duration: 1750 }), 0, true));
    } else {
      textAnim.value = withTiming(0, { duration: 300 });
    }
  }, [context.extend]);

  const animatedTextProps = useAnimatedProps(() => ({
    fontSize: interpolate(textAnim.value, [0, 1], [14, 28]),
  }));
  // console.
  return (
    <View
      // style={{
      //   flexGrow: 1,
      //   justifyContent: "flex-end",
      // }}
      style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      onLayout={containerHeight ? undefined : onLayoutContainer}
    >
      <TouchableOpacity
        onPress={() => extendSession()}
        style={{
          position: "absolute",
          width: width,
          height: animHeight + 30,
          zIndex: 1000,
        }}
      ></TouchableOpacity>

      <MotiView
        key="hold"
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onLayout={animHeight ? undefined : onLayout}
        style={{
          width,
          justifyContent: "center",
        }}
      >
        {/* Top ExtendIndicator */}
        <View style={{ position: "absolute", bottom: animHeight }}>
          <ExtendIndicator
            isExtending={context.extend}
            isPaused={isPaused}
            offsetExtra={250}
            lengthMS={3500}
          />
        </View>
        {context.extend && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 3500 }}
            style={{ position: "absolute", bottom: animHeight, width: width }}
          >
            <AnimatedText animatedProps={animatedTextProps} style={{ textAlign: "center" }}>
              Extending Hold
            </AnimatedText>
          </MotiView>
        )}
        {/* Bottom ExtendIndicator */}
        <View style={{ position: "absolute", top: animHeight }}>
          <ExtendIndicator isExtending={context.extend} isPaused={isPaused} />
        </View>
        <LottieView
          ref={lottieRefTop}
          source={require("../../../assets/lottie_waves.json")}
          style={{
            // position: "absolute",
            width,
            // aspectRatio: 1.4,
            // right: -4,
            // top: (height - 100) / 2,
            // right: 0,
            // marginRight: -200,
          }}
          autoSize
          autoPlay
          resizeMode="cover"
          // duration={3000}
        />
        <View style={{ alignItems: "center" }}>
          <Timer type="countdown" size={50} color="#4A5568" />
        </View>
        <LottieView
          ref={lottieRefBottom}
          source={require("../../../assets/lottie_waves.json")}
          style={{
            // position: "absolute",
            width,
            // aspectRatio: 1.4,
            // right: -4,
            // top: (height - 100) / 2,
            // right: 0,
            // marginRight: -200,
          }}
          autoSize
          autoPlay
          resizeMode="cover"
          // duration={3000}
        />
      </MotiView>
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
export default HoldAnimation;
