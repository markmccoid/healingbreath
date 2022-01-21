import { AnimatePresence, MotiText, MotiView, useAnimationState } from "moti";
import React from "react";
import { Dimensions, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useBreathMachineInfo } from "../../hooks/useBreathMachineHooks";
import { useLayout } from "../../hooks/useLayout";
import Timer from "./Timer";

const { width, height } = Dimensions.get("window");

function HoldAnimation() {
  const [
    {
      context,
      value: currStateValue,
      tags,
      breathState: [_, breathStateString],
    },
    send,
  ] = useBreathMachineInfo();
  const [{ height: animHeight }, onLayout] = useLayout();

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
  console.log("height", animHeight);
  return (
    <View
      style={{
        flexGrow: 1,
        justifyContent: "flex-end",
        borderColor: "red",
        borderWidth: 1,
      }}
      onLayout={animHeight ? undefined : onLayout}
    >
      <Timer type="countdown" />
      <MotiView
        key="hold"
        from={{ opacity: 0, height: 10, backgroundColor: "purple" }}
        animate={{
          opacity: 1,
          height: animHeight - 25,
        }}
        transition={{
          height: { type: "timing", duration: 5000 },
          type: "timing",
          duration: 500,
        }}
        style={{
          backgroundColor: "#ccc",
          width,
          // height: 100,
        }}
      ></MotiView>
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
