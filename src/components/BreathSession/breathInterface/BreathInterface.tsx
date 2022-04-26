import React, { useEffect } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import {
  useBreathMachineInfo,
  useBreathEvents,
  useBreathFlags,
  useBreathMethods,
} from "../../../hooks/useBreathMachineHooks";
import LottieView, { AnimatedLottieViewProps } from "lottie-react-native";
import Timer from "../Timer";

import { ActionButton, LeftCornerButton, RightCornerButton } from "../../buttons/Buttons";
import { StopIcon, PlayIcon, NextIcon, PauseIcon } from "../../common/Icons";
import useComponentSize from "../../../hooks/useComponentSize";
import BreathInterfaceTimer from "./BreathInterfaceTimer";
import { AnimatePresence, MotiText, MotiView } from "moti";
import { times } from "lodash";
import { StartButtonAnimation, StopButtonAnimation } from "./BreathInterfaceAnimations";
import ExtendAnimation from "./ExtendAnimation";

const { width, height } = Dimensions.get("window");

const BreathInterface = () => {
  // const breathStateServices = useBreathState();
  // const [{ context, alert, value: currStateValue, breathState }, send] =
  //   useBreathMachineInfo();
  const [size, onLayout] = useComponentSize();
  const [runAnimation, setRunAnimation] = React.useState(false);
  const lottieRef = React.useRef<AnimatedLottieViewProps>();
  const [
    {
      context,
      value: currStateValue,
      tags,
      // alert,
      breathState: [breathState, breathStateString],
    },
    send,
  ] = useBreathMachineInfo();
  // const [breathState, breathStateString] = breathState;
  const breathEvents = useBreathEvents();
  const breathFlags = useBreathFlags();
  const navigation = useNavigation();
  //************************ */

  // if (context.sessionComplete) {
  //   console.log("SESSION", context.sessionComplete, context.sessionStats);
  // }

  return (
    <View style={{ zIndex: 1000 }}>
      {/* START Button */}
      <AnimatePresence>
        {breathFlags.canStart && (
          <StartButtonAnimation
            key="start"
            breathEvents={breathEvents}
            breathFlags={breathFlags}
          />
        )}

        {/* STOP Button */}
        {breathFlags.canStop && <StopButtonAnimation key="stop" breathEvents={breathEvents} />}
      </AnimatePresence>
      {/* Next Button */}
      <AnimatePresence exitBeforeEnter>
        {breathFlags.canGoNext && (
          <MotiView
            key="next"
            from={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            exitTransition={{
              type: "timing",
              duration: 800,
            }}
            transition={{
              type: "timing",
              duration: 1000,
            }}
          >
            <RightCornerButton
              style={{
                position: "absolute",
                top: 0,
                right: 0,
              }}
              onPress={() => breathEvents.goToNext()}
            >
              <View style={{ alignItems: "center" }}>
                <NextIcon size={35} color="white" />
              </View>
            </RightCornerButton>
          </MotiView>
        )}
      </AnimatePresence>

      {/* Timer top center of screen */}
      <BreathInterfaceTimer
        breathFlags={breathFlags}
        breathEvents={breathEvents}
        breathState={breathState}
      />

      {/* Extend Button */}
      {/* {breathFlags.canExtend && (
        <ExtendAnimation
          toggleExtendSession={breathEvents.extendSession}
          isExtending={context.extend}
          isPaused={breathState.includes(".paused")}
        />
      )} */}
    </View>
  );
};

export default BreathInterface;
