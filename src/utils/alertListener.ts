import React, { createContext, useState } from "react";
import { State } from "xstate";
import { BreathContext, BreathEvent } from "../machines/breathMachine";

import { Audio } from "expo-av";

let soundPlayed = false;
let prevBreathNum = 0;
let churchBell: Audio.Sound;

async function playSound() {
  console.log("Loading Sound");
  const { sound } = await Audio.Sound.createAsync(require("../../assets/ChurchBell001.mp3"));

  console.log("Playing Sound");
  await sound.playAsync();
}
export async function configureSounds() {
  const { sound } = await Audio.Sound.createAsync(require("../../assets/ChurchBell001.mp3"));
  churchBell = sound;
}

type Alert =
  | {
      alertMessage: string;
      alertSound: Audio.Sound;
    }
  | undefined;

function breathAlerts(currentBreath: number, totalBreaths: number): Alert {
  if (currentBreath % 2 === 0 && currentBreath !== 0) {
    return {
      alertMessage: "factor of 2 breaths",
      alertSound: churchBell,
    };
  }
  return undefined;
}

export const myListener = async (
  state: State<
    BreathContext,
    BreathEvent,
    any,
    {
      value: any;
      context: BreathContext;
    }
  >,
  setAlert: (val: string | undefined) => void
) => {
  if (state.matches("breathing")) {
    // If prevBreathNum doesn't match current breath, then we know this is first time on this breath
    // so we will first set the prevBreathNum (so we don't check anything until the next breath)
    // then we do the alert checks, set the alerts, play the sound if alert criteria is met
    // if not, then clear the alert.
    if (prevBreathNum !== state.context.breathCurrRep) {
      prevBreathNum = state.context.breathCurrRep;
      const myAlert = breathAlerts(state.context.breathCurrRep, state.context.breathCurrRep);
      setAlert(myAlert?.alertMessage); // Will be null if we didn't get a "hit" for an alert
      if (myAlert?.alertSound) {
        console.log("playing sound");
        // await myAlert.alertSound.playAsync();
        await playSound();
      }
    }
    return;
  }

  if (state.matches("holding")) {
    if (state.context.elapsed % 5000 === 0 && state.context.elapsed !== 0) {
      setAlert("Elapsed 5 sec alert");
    } else {
      setAlert(undefined);
    }
  }
};
