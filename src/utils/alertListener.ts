import React, { createContext, useState } from "react";
import { State } from "xstate";
import { BreathContext, BreathEvent } from "../machines/breathMachine";

import { Audio } from "expo-av";
import { Asset } from "expo-asset";

import { AlertSettings, AlertSounds, AssetNames } from "./alertTypes";

let prevState = "idle";
let prevBreathNum = 0;
let soundToPlay: Audio.Sound;

let alertSettings: AlertSettings;
const gong = require("../../assets/sounds/gong01.wav");
const churchBell = require("../../assets/sounds/ChurchBell001.mp3");
const breathInMark = require("../../assets/sounds/BreathInMark.mp3");
const breathOutMark = require("../../assets/sounds/BreathOutMark.mp3");
const airplaneDing = require("../../assets/sounds/AirplaneDing.mp3");
const elevatorDing = require("../../assets/sounds/ElevatorDing.mp3");
const alertSounds: AlertSounds = {
  churchBell,
  gong,
  breathInMark,
  breathOutMark,
  airplaneDing,
  elevatorDing,
};

async function playSound(whichSoundtoPlay: AssetNames) {
  console.log("Loading Sound", whichSoundtoPlay);
  if (soundToPlay) {
    soundToPlay.unloadAsync();
  }
  const { sound } = await Audio.Sound.createAsync(alertSounds[whichSoundtoPlay]);
  // await sound.unloadAsync();
  soundToPlay = sound;

  console.log("Playing Sound");
  await soundToPlay.playAsync();
}

export const configureAlertListener = (userAlertSettings: AlertSettings) => {
  alertSettings = userAlertSettings;
};

type Alert =
  | {
      alertMessage: string;
      alertSound: AssetNames;
    }
  | undefined;

/**
 * check for the alerts for ConsciousForced Breathing
 * @param currentBreath
 * @param totalBreaths
 * @returns Alert -
 */
function breathAlerts(currentBreath: number, totalBreaths: number): Alert {
  // Pull out alert settings to check for from global alertSettings
  // NOTE: maybe this will be in actual state??
  const {
    ConsciousForcedBreathing: {
      alertEveryXBreaths: { value: everyXValue, sound: everyXSound },
      alertXBreathsBeforeEnd: { value: breathsBeforeEndValue, sound: breathsBeforeEndSound },
    },
  } = alertSettings;
  // alertEveryXBreaths alert check
  if (currentBreath % everyXValue === 0 && currentBreath !== 0) {
    return {
      alertMessage: `factor of ${everyXValue} breaths`,
      alertSound: everyXSound,
    };
  }
  // alertXBreathsBeforeEnd alert check
  if (currentBreath + breathsBeforeEndValue === totalBreaths) {
    return {
      alertMessage: `Last breath in ${breathsBeforeEndValue} breaths`,
      alertSound: breathsBeforeEndSound,
    };
  }
  return undefined;
}

/**
 * checks for holding (Breath Retention Alerts)
 * @param elapsed
 * returns Alert
 */
const BreathRetentionAlerts = (elapsed: number, currRoundHoldTime: number): Alert => {
  // Pull out alert settings to check for from global alertSettings
  // NOTE: maybe this will be in actual state??
  const {
    BreathRetention: {
      alertEveryXSeconds: { value: everyXValue, sound: everyXSound },
      alertXSecondsBeforeEnd: {
        value: secondsBeforeEndValue,
        sound: secondsBeforeEndSound,
        // countDown,
        countDownSound,
      },
    },
  } = alertSettings;
  // convert values to milliseconds
  const everyXMilliseconds = everyXValue * 1000;
  const millisecondsBeforeEnd = secondsBeforeEndValue * 1000;
  const countDown = true;
  // console.log("in BreathRetention alerts", countDown, secondsBeforeEndValue);
  if (elapsed === 0) return;
  // alertXSecondsBeforeEnd
  // This needs to come before alertEveryXSeconds as only one alert will be sent and
  // this one should get priority
  if (countDown) {
    //   // Want to play a sound every second starting with the secondsBeforeEndValue
    console.log("X Seconds before", currRoundHoldTime, elapsed, millisecondsBeforeEnd);
    for (let x = 0; x <= millisecondsBeforeEnd; x = x + 1000) {
      if (currRoundHoldTime - x === elapsed) {
        return {
          alertMessage: `Ending in ${secondsBeforeEndValue} or ${x} seconds`,
          alertSound: countDownSound,
        };
      }
    }
  } else if (currRoundHoldTime - millisecondsBeforeEnd === elapsed) {
    console.log("setting ALERT Holding Ending in X Seconds", elapsed);
    return {
      alertMessage: `Ending in ${secondsBeforeEndValue} seconds`,
      alertSound: secondsBeforeEndSound,
    };
  }

  // alertEveryXSeconds
  if (elapsed % everyXMilliseconds === 0) {
    return {
      alertMessage: `factor of ${everyXValue} seconds`,
      alertSound: everyXSound,
    };
  }
  return undefined;
};

/**
 * Return sound used for Intropause or outropause
 *
 * @param type  - which sound to return
 * @returns AssetNames
 */
function getAlertSound(type: "intropause" | "outropause"): AssetNames {
  // Get info needed from alertSettings
  const {
    RecoveryBreath: {
      alertBreathInPause: { sound: alertBreathInSound },
      alertBreathOutPause: { sound: alertBreathOutSound },
    },
  } = alertSettings;

  return type === "intropause" ? alertBreathInSound : alertBreathOutSound;
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
  // state.value could be a string or an object (if state and sub states)
  // probably a better way to get at this, but
  const currState =
    typeof state.value === "string" ? state.value : Object.keys(state.value)[0];
  // console.log("prevState, currState", prevState, currState, state.value);
  //-==================================
  //-- Conscious Forced Breathing Alerts
  //-==================================
  if (state.matches("breathing")) {
    // If prevBreathNum doesn't match current breath, then we know this is first time on this breath
    // so we will first set the prevBreathNum (so we don't check anything until the next breath)
    // NOTE: this listener is called for every tick, which why we are doing this extra check for breath
    // then we do the alert checks, set the alerts, play the sound if alert criteria is met
    // if not, then clear the alert.
    if (prevBreathNum !== state.context.breathCurrRep) {
      prevBreathNum = state.context.breathCurrRep;
      const myAlert = breathAlerts(state.context.breathCurrRep, state.context.breathReps);
      setAlert(myAlert?.alertMessage); // Will be null if we didn't get a "hit" for an alert
      if (myAlert?.alertSound) {
        await playSound(myAlert.alertSound);
      }
    }
    prevState = currState;
    return;
  }

  //-==================================
  //-- Breath Retention Alerts
  //-==================================
  //console.log("CONteXT elapse % 1000", state.context.elapsed, state.context.elapsed % 1000);
  // For all other checks, we only need to check every seconds.  If not on a second, then exit.
  if (state.context.elapsed % 1000 !== 0) return;
  if (state.matches("holding") && state.context.elapsed % 1000 === 0) {
    // Since hold times can be different for each round, make sure we have correct time for this round
    const currRoundHoldTime =
      state.context.breathRoundsDetail?.[state.context.breathCurrRound]?.holdTime ||
      state.context.defaultHoldTime;

    const holdingAlert = BreathRetentionAlerts(state.context.elapsed, currRoundHoldTime);
    setAlert(holdingAlert?.alertMessage);
    if (holdingAlert?.alertSound) {
      console.log("playing holdingalert", holdingAlert.alertSound);
      await playSound(holdingAlert.alertSound);
    }
    prevState = currState;
    return;
  }

  //-==================================
  //-- IntroPause sound (Breath in and Hold)
  //-==================================
  // the check of prevState makes it so we only call this once
  if (state.matches("intropause") && !prevState.includes("intropause")) {
    console.log("IntroPause Match", state.context.elapsed);
    const alertBreathInSound = getAlertSound("intropause");
    prevState = currState;
    await playSound(alertBreathInSound);
    return;
  }

  //-==================================
  //-- Recovery Breath Alerts
  //-==================================

  //-==================================
  //-- OutroPause sound (Breath out)
  //-==================================
  if (state.matches("outropause") && !prevState.includes("outropause")) {
    const alertBreathOutSound = getAlertSound("outropause");
    prevState = currState;
    await playSound(alertBreathOutSound);
    return;
  }
};
