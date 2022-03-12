import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Timer from "../Timer";
import { PauseIcon, UnPauseIcon } from "../../common/Icons";
import {
  BreathEvents,
  BreathFlags,
  BreathStatesDetail,
} from "../../../hooks/useBreathMachineHooks";
import { AnimatePresence, MotiView } from "moti";
import { colors } from "../../../theme";

type Props = {
  breathFlags: BreathFlags;
  breathEvents: BreathEvents;
  breathState: BreathStatesDetail;
};

const { width, height } = Dimensions.get("window");

function BreathInterfaceTimer({ breathFlags, breathEvents, breathState }: Props) {
  const [timerWidth, setTimerWidth] = React.useState(0);
  const showTimer = !(
    breathState.includes("idle") ||
    breathState.includes("outro") ||
    breathState.includes("intro")
  );
  return (
    <AnimatePresence exitBeforeEnter>
      {showTimer && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            alignItems: "center",
            position: "absolute",
            left: (width - timerWidth) / 2 - 20,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderWidth: 1,
            backgroundColor: colors.darkest,
          }}
        >
          <TouchableOpacity
            onPress={
              breathFlags.canPause
                ? breathEvents.pauseSession
                : breathFlags.canUnPause
                ? breathEvents.unpauseSession
                : () => {}
            }
            // style={{ flexDirection: "row" }}
            disabled={!breathFlags.canPause && !breathFlags.canUnPause}
          >
            <View
              style={{
                // paddingHorizontal: 10,
                // alignItems: "center",

                flexDirection: "row",
                paddingVertical: 5,
              }}
            >
              {breathState.includes("breathing") && (
                <Timer
                  type="countdown"
                  color={colors.white}
                  timerWidthPositioning={{ timerWidth, setTimerWidth }}
                />
              )}
              {breathState.includes("holding") && (
                <Timer
                  type="countup"
                  color={colors.white}
                  timerWidthPositioning={{ timerWidth, setTimerWidth }}
                />
              )}
              {breathState.includes("recovery") && (
                <Timer
                  type="countdown"
                  color={colors.white}
                  timerWidthPositioning={{ timerWidth, setTimerWidth }}
                />
              )}
              <View style={{ paddingRight: 10 }}>
                {breathFlags.canPause && <PauseIcon size={30} color={colors.white} />}
                {breathFlags.canUnPause && <UnPauseIcon size={30} color={colors.white} />}
              </View>
            </View>
          </TouchableOpacity>
        </MotiView>
      )}
    </AnimatePresence>
  );
}

export default BreathInterfaceTimer;
