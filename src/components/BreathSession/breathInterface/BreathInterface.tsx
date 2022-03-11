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
import { colors } from "../../../theme";
import { StopIcon, PlayIcon, NextIcon, PauseIcon } from "../../common/Icons";
import useComponentSize from "../../../hooks/useComponentSize";
import BreathInterfaceTimer from "./BreathInterfaceTimer";

const { width, height } = Dimensions.get("window");

const BreathInterface = () => {
  // const { soundsLoaded, playSound } = useAlertSounds(undefined);
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

  console.log("run anim", runAnimation);
  if (context.sessionComplete) {
    console.log("SESSION", context.sessionStats);
  }

  const handleExtend = () => {
    breathEvents.extendSession();
    if (runAnimation) {
      lottieRef.current?.reset();
      setRunAnimation(false);
    } else {
      lottieRef.current?.play();
      setRunAnimation(true);
    }
  };

  return (
    <View style={{ zIndex: 1000 }}>
      {/* Start / Stop Buttons */}
      {breathFlags.canStart && (
        <LeftCornerButton
          style={{
            // backgroundColor: colors.dark,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          onPress={() => breathEvents.startSession()}
        >
          {/* <Text style={{ color: colors.white, fontSize: 20 }}>Start</Text> */}
          <View style={{ alignItems: "center" }}>
            <PlayIcon size={35} color="white" />
          </View>
        </LeftCornerButton>
      )}
      {breathFlags.canStop && (
        <LeftCornerButton
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
          onPress={() => breathEvents.stopSession()}
        >
          <View style={{ alignItems: "center" }}>
            <StopIcon size={35} color="white" />
          </View>
        </LeftCornerButton>
      )}

      {/* Next Button */}
      {breathFlags.canGoNext && (
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
      )}

      {/* Timer top center of screen */}
      <BreathInterfaceTimer
        breathFlags={breathFlags}
        breathEvents={breathEvents}
        breathState={breathState}
      />
      {/* <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {breathFlags.canStart && (
          <>
            <ActionButton onPress={() => breathEvents.startSession()}>
              <Text style={{ fontSize: 20, color: "#fff" }}>Start</Text>
            </ActionButton>
            <View style={{ width: 10 }} />
          </>
        )}
        {breathFlags.canStop && (
          <>
            <ActionButton onPress={() => breathEvents.stopSession()}>
              <Text style={{ fontSize: 20, color: "#fff" }}>Stop</Text>
            </ActionButton>
            <View style={{ width: 10 }} />
          </>
        )}
        {breathFlags.canPause && (
          <ActionButton onPress={() => breathEvents.pauseSession()}>
            <Text style={{ fontSize: 20, color: "#fff" }}>Pause</Text>
          </ActionButton>
        )}
        {breathFlags.canUnPause && (
          <ActionButton onPress={() => breathEvents.unpauseSession()}>
            <Text style={{ fontSize: 20, color: "#fff" }}>Unpause</Text>
          </ActionButton>
        )}
        <View style={{ width: 10 }} />
        {breathFlags.canExtend && (
          <ActionButton onPress={() => breathEvents.extendSession()}>
            <Text style={{ fontSize: 20, color: "#fff" }}>
              {`${context.extend ? "Stop " : ""}Extend`}
            </Text>
          </ActionButton>
        )}

        {breathFlags.canStop && (
          <ActionButton onPress={() => breathEvents.goToNext()}>
            <Text style={{ fontSize: 20, color: "#fff" }}>Next</Text>
          </ActionButton>
        )}
      </View>
      <View style={{ borderWidth: 1, padding: 10 }}>
        <Timer type="countup" />
        <Timer type="countdown" />
      </View>
      <View style={{ padding: 10, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 25, color: "#F1820A" }}> {breathStateString}</Text>
      </View> */}

      {/* Extend Button */}
      {breathFlags.canExtend && (
        <View style={{ position: "absolute", top: 200, right: 0, borderWidth: 1 }}>
          <TouchableOpacity
            onPress={handleExtend}
            style={{
              zIndex: 1000,
              position: "absolute",
              // top: (height - 100) / 2,
              right: 0,
              borderWidth: 1,
              width: 80,
              height: 70,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              // backgroundColor: "white",
            }}
          ></TouchableOpacity>
          <View
            style={{
              position: "absolute",
              right: 0,
              width: 80,
              height: 70,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              backgroundColor: "white",
            }}
          />
          <LottieView
            ref={lottieRef}
            source={require("../../../../assets/extendlottie4.json")}
            style={{
              position: "absolute",
              width: 100,
              aspectRatio: 1.4,
              right: -4,
              // top: (height - 100) / 2,
              // right: 0,
              // marginRight: -200,
            }}
            // autoSize
            resizeMode="cover"
            duration={3000}
          />
        </View>
      )}
    </View>
  );
};

export default BreathInterface;
