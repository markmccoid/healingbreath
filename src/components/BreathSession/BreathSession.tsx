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

import Timer from "./Timer";
// import BreathAnimation from "./BreathAnimation";
import BreathAnimation from "./MotiAnimation";

import { ActionButton } from "../../components/buttons/Buttons";
import { useTimingAlerts } from "../../hooks/useTimingAlerts";
import { Audio } from "expo-av";

const BreathSession = ({ sessionSettings }: { sessionSettings: SessionSettingsType }) => {
  // console.log("Session", sessionSettings);
  // const breathStateServices = useBreathState();
  const [{ context, alert, value: currStateValue, breathState }, send] =
    useBreathMachineInfo();
  const [currState, currStateDesc] = breathState;
  const breathEvents = useBreathEvents();
  const breathMethods = useBreathMethods();
  const navigation = useNavigation();
  //************************ */
  //* SOUND * */
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [bgSound, setBgSound] = React.useState<Audio.Sound>();

  // async function playSound() {
  //   console.log("Loading Sound");
  //   const { sound } = await Audio.Sound.createAsync(
  //     require("../../../assets/ChurchBell001.mp3")
  //   );
  //   setSound(sound);

  //   console.log("Playing Sound");
  //   await sound.playAsync();
  // }
  // async function loadSounds() {
  //   const { sound: bgSound } = await Audio.Sound.createAsync(
  //     require("../../../assets/chant.wav")
  //   );
  //   //setBgSound(sound);
  //   bgSound.playAsync();
  // }
  // React.useEffect(() => {
  //   loadSounds();
  // }, []);
  // //--- Unload sound
  // React.useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log("Unloading Sound");
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, []);
  // React.useEffect(() => {
  //   if (alert) {
  //     playSound();
  //   }
  // }, [alert]);
  //************************ */
  // const x = useTimingAlerts();

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
      <Text>Round - {context.breathCurrRound}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <ActionButton onPress={() => navigation.navigate("SessionList")}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Back</Text>
        </ActionButton>
        <ActionButton onPress={() => breathEvents.startSession()}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Start</Text>
        </ActionButton>
        <View style={{ width: 10 }} />
        <ActionButton onPress={() => breathEvents.stopSession()}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Stop</Text>
        </ActionButton>
        <View style={{ width: 10 }} />
        <ActionButton onPress={() => breathEvents.pauseSession()}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Pause</Text>
        </ActionButton>
        <ActionButton onPress={() => breathEvents.unpauseSession()}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Unpause</Text>
        </ActionButton>
        <View style={{ width: 10 }} />
        <ActionButton onPress={() => breathEvents.extendSession()}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Extend</Text>
        </ActionButton>
        <ActionButton onPress={() => breathEvents.goToNext()}>
          <Text style={{ fontSize: 20, color: "#fff" }}>Next</Text>
        </ActionButton>
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
