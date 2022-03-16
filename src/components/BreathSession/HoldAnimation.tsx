import { AnimatePresence, MotiText, MotiView, useAnimationState } from "moti";
import React from "react";
import { Dimensions, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useBreathState } from "../../context/breathMachineContext";
import { useBreathMachineInfo } from "../../hooks/useBreathMachineHooks";
import { useLayout } from "../../hooks/useLayout";
import { getCurrentRoundHoldTime } from "../../utils/machineHelpers";
import Timer from "./Timer";

const { width, height } = Dimensions.get("window");

function HoldAnimation() {
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
        from={{ opacity: 0, height: 50, backgroundColor: "purple" }}
        animate={{
          opacity: 1,
          height: animHeight,
        }}
        transition={{
          height: { type: "timing", duration: currHoldTime },
          type: "timing",
          duration: 500,
        }}
        style={{
          // backgroundColor: "#ccc",
          width,
          justifyContent: "flex-start",

          // height: 100,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Timer type="countup" size={50} color="white" />
        </View>
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
