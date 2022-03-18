import { AnimatePresence, MotiText, MotiView, useAnimationState } from "moti";
import React from "react";
import { Dimensions, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useBreathState } from "../../context/breathMachineContext";
import { useBreathMachineInfo } from "../../hooks/useBreathMachineHooks";
import { useLayout } from "../../hooks/useLayout";
import { getCurrentRoundHoldTime } from "../../utils/machineHelpers";
import Timer from "./Timer";
import LottieView, { AnimatedLottieViewProps } from "lottie-react-native";

const { width, height } = Dimensions.get("window");

function HoldAnimation() {
  const lottieRef = React.useRef<AnimatedLottieViewProps>();
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
  const [{ height: animHeight }, onLayout] = useLayout();

  // const { alert } = useBreathState();

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
  return (
    <View
      style={{
        flexGrow: 1,
        justifyContent: "flex-end",
      }}
      onLayout={animHeight ? undefined : onLayout}
    >
      <MotiView
        key="hold"
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        // from={{ opacity: 0, height: 50, backgroundColor: "purple" }}
        // animate={{
        //   opacity: 1,
        //   height: animHeight,
        // }}
        // transition={{
        //   height: { type: "timing", duration: currHoldTime },
        //   type: "timing",
        //   duration: 500,
        // }}
        style={{
          // backgroundColor: "#ccc",
          flexGrow: 1,
          width,
          justifyContent: "center",
          // justifyContent: "flex-start",
          // borderWidth: 1,
          // height: 100,
        }}
      >
        <LottieView
          ref={lottieRef}
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
          ref={lottieRef}
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
