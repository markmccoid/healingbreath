import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { MotiView, MotiText } from "@motify/components";
import { AnimatePresence } from "moti";
import { LeftCornerButton } from "../../buttons/Buttons";
import { PlayIcon, StopIcon } from "../../common/Icons";
import { colors } from "../../../theme";
import { BreathFlags, BreathEvents } from "../../../hooks/useBreathMachineHooks";

const { width, height } = Dimensions.get("window");
type StartButtonProps = {
  breathEvents: BreathEvents;
  breathFlags: BreathFlags;
};
export const StartButtonAnimation = ({ breathEvents, breathFlags }: StartButtonProps) => {
  return (
    <MotiView
      key="start"
      from={{
        // width: 80,
        translateX: 80 - width,
        opacity: 0.5,
      }}
      animate={{
        // width: width,
        translateX: 0,
        opacity: 1,
      }}
      exit={{
        // width: 80,
        translateX: 80 - width,
        opacity: 0.5,
      }}
      transition={{
        type: "timing",
        duration: 1000,
      }}
      style={{ position: "absolute", top: 0, left: 0, width: width }}
    >
      <LeftCornerButton
        style={{
          flexGrow: 1,
          // backgroundColor: colors.dark,
        }}
        onPress={() => breathEvents.startSession()}
      >
        {/* <Text style={{ color: colors.white, fontSize: 20 }}>Start</Text> */}
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <MotiText
            from={{
              opacity: 1,
            }}
            animate={{
              opacity: breathFlags.canStop ? 0 : 1,
            }}
            transition={{
              type: "timing",
              duration: 500,
            }}
            style={{
              fontSize: 20,
              fontWeight: "600",
              marginRight: 25,
              color: colors.white,
            }}
          >
            Start Session
          </MotiText>
          <PlayIcon size={35} color="white" />
        </View>
      </LeftCornerButton>
    </MotiView>
  );
};
type StopButtonProps = {
  breathEvents: BreathEvents;
};
export const StopButtonAnimation = ({ breathEvents }: StopButtonProps) => {
  return (
    <MotiView
      key="stop"
      from={{
        opacity: 0,
        width: width,
      }}
      animate={{
        opacity: 1,
        width: 80,
      }}
      exit={{
        width: width,
        opacity: 0,
      }}
      exitTransition={{
        type: "timing",
        duration: 1000,
      }}
      transition={{
        type: "timing",
        duration: 1000,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <LeftCornerButton style={{}} onPress={() => breathEvents.stopSession()}>
        <View style={{ alignItems: "center" }}>
          <StopIcon size={35} color="white" />
        </View>
      </LeftCornerButton>
    </MotiView>
  );
};
