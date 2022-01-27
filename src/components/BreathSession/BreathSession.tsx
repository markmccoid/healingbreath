import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { SessionSettingsType, useBreathState } from "../../context/breathMachineContext";
import {
  useBreathMachineInfo,
  useBreathEvents,
  useBreathFlags,
  useBreathMethods,
} from "../../hooks/useBreathMachineHooks";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import Timer from "./Timer";
// import BreathAnimation from "./BreathAnimation";
import BreathAnimation from "./MotiAnimation";

import { ActionButton } from "../../components/buttons/Buttons";

const BreathSession = ({ sessionSettings }: { sessionSettings: SessionSettingsType }) => {
  // console.log("Session", sessionSettings);
  // const breathStateServices = useBreathState();
  const [{ context, alert, value: currStateValue, breathState }, send] =
    useBreathMachineInfo();
  const [currState, currStateDesc] = breathState;
  const breathEvents = useBreathEvents();
  const breathFlags = useBreathFlags();
  const navigation = useNavigation();
  //************************ */

  // const breathState = useBreathState();
  // const [bdata, bsend] = useBreathMachineInfo();
  // console.log("CONTEXT", context.breathCurrRep);
  // console.log("BSTATE", currState);

  // console.log("BREATHSESSION BEFORE ", subscribe.toString());
  if (context.sessionComplete) {
    console.log("SESSION", context.sessionStats);
  }
  // console.log("x", x);
  useEffect(() => {
    console.log("alert has been alerted", alert);
  }, [alert]);

  useEffect(() => {
    console.log("in BreathSession useEffect");
    breathEvents.updateSessionSettings(sessionSettings);

    // breathEvents.updateSessionBreathRounds({
    //   1: {
    //     holdTime: 10000,
    //   },
    //   2: {
    //     holdTime: 20000,
    //   },
    // });
    // breathStateServices.breathStateService.send("FINISHED");
    // breathStateServices.breathStateService.stop();
  }, [sessionSettings]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.navigate("SessionList")}>
          <AntDesign name="back" size={25} style={{ marginTop: -5 }} />
          {/* <Text style={{ fontSize: 20 }}>Back</Text> */}
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 10,
            flexDirection: "row",
            justifyContent: "space-evenly",
            flex: 1,
          }}
        >
          <Text>Round - {context.breathCurrRound}</Text>

          {currState.includes("breathing") && <Text>Rep - {context.breathCurrRep}</Text>}
        </View>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
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
            <Text style={{ fontSize: 20, color: "#fff" }}>Extend</Text>
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
        <Text style={{ fontSize: 25, color: "#F1820A" }}> {currStateDesc}</Text>
      </View>

      <BreathAnimation />

      {/* <View>
        <Text>{`${context.breathCurrRound} - ${context.breathCurrRep} - ${breathState[0]}`}</Text>
        <Text>{`${context.sessionStart} - ${context.sessionEnd}`}</Text>
        <Text>{`${JSON.stringify(context.sessionStats)}`}</Text>
      </View> */}
    </View>
  );
};

export default BreathSession;
