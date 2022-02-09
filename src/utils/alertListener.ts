import React, { createContext, useState } from "react";
import { State } from "xstate";
import { BreathContext, BreathEvent } from "../machines/breathMachine";

import { Audio } from "expo-av";
import { Asset } from "expo-asset";

import { Alert, AlertSettings } from "./alertTypes";
import { AlertSoundNames } from "../utils/sounds/soundTypes";
import { alertSounds, playSound } from "../utils/sounds/soundLibrary";
import { alertNoAlertSettings } from "../store/defaultSettings";
import { useStore } from "../store/useStore";
import { BreathAlert, SecondsAlert } from "../utils/alertTypes";

let prevElapsed = 0;
let prevState = "idle";
let prevBreathNum = 0;
let soundToPlay: Audio.Sound;

let alertSettings: AlertSettings;

export const configureAlertListener = async (userAlertSettings: AlertSettings) => {
  console.log("Configuring Alert Listener", userAlertSettings);
  alertSettings = userAlertSettings;
  // alertSettings = { ...alertNoAlertSettings, ...userAlertSettings };
};

/**
 * check for the alerts for ConsciousForced Breathing
 * @param currentBreath
 * @param totalBreaths
 * @returns Alert -
 */
function breathAlerts(currentBreath: number, totalBreaths: number): BreathAlert {
  // Pull out alert settings to check for from global alertSettings
  // NOTE: maybe this will be in actual state??
  // const {
  //   ConsciousForcedBreathing: {
  //     alertEveryXBreaths: { value: everyXValue, sound: everyXSound },
  //     alertXBreathsBeforeEnd: { value: breathsBeforeEndValue, sound: breathsBeforeEndSound },
  //   },
  // } = alertSettings;
  const { value: everyXValue, sound: everyXSound } =
    alertSettings?.ConsciousForcedBreathing?.alertEveryXBreaths || {};
  const { value: breathsBeforeEndValue, sound: breathsBeforeEndSound } =
    alertSettings?.ConsciousForcedBreathing?.alertXBreathsBeforeEnd || {};

  //-- alertEveryXBreaths alert check
  if (everyXValue && currentBreath % everyXValue === 0 && currentBreath !== 0) {
    return {
      type: "breathing.everyXBreaths",
      alertSound: everyXSound,
      breath: currentBreath,
    };
  }
  //-- alertXBreathsBeforeEnd alert check
  if (breathsBeforeEndValue && currentBreath + breathsBeforeEndValue === totalBreaths) {
    return {
      type: "breathing.everyXBreaths",
      alertSound: breathsBeforeEndSound,
      breath: currentBreath,
    };
  }
  return undefined;
}

/**
 * checks for holding (Breath Retention Alerts)
 * @param elapsed
 * returns Alert
 */
const BreathRetentionAlerts = (elapsed: number, currRoundHoldTime: number): SecondsAlert => {
  // Pull out alert settings to check for from global alertSettings
  // NOTE: maybe this will be in actual state??
  // const {
  //   BreathRetention: {
  //     alertEveryXSeconds: { value: everyXValue, sound: everyXSound },
  //     alertXSecondsBeforeEnd: {
  //       value: secondsBeforeEndValue,
  //       sound: secondsBeforeEndSound,
  //       countDown,
  //       countDownSound,
  //     },
  //   },
  // } = alertSettings;

  const { value: everyXValue, sound: everyXSound } =
    alertSettings?.BreathRetention?.alertEveryXSeconds || {};
  const {
    value: secondsBeforeEndValue,
    sound: secondsBeforeEndSound,
    countDown,
    countDownSound,
  } = alertSettings?.BreathRetention?.alertXSecondsBeforeEnd || {};

  if (elapsed === 0) return;
  //-- alertXSecondsBeforeEnd
  // This needs to come before alertEveryXSeconds as only one alert will be sent on each
  // check and this one should get priority
  if (secondsBeforeEndValue) {
    //if no value set or zero, then skip
    // convert values to milliseconds
    const millisecondsBeforeEnd = secondsBeforeEndValue * 1000;
    if (countDown) {
      // Want to play a sound every second starting with the secondsBeforeEndValue
      // console.log("X Seconds before", currRoundHoldTime, elapsed, millisecondsBeforeEnd);
      for (let x = 1000; x <= millisecondsBeforeEnd; x = x + 1000) {
        if (currRoundHoldTime - x === elapsed) {
          return {
            type: "retention.secondsBeforeEnd",
            alertSound: countDownSound,
            elapsed,
          };
        }
      }
    } else if (currRoundHoldTime - millisecondsBeforeEnd === elapsed) {
      return {
        type: "retention.secondsBeforeEnd",
        alertSound: secondsBeforeEndSound,
        elapsed,
      };
    }
  }

  //-- alertEveryXSeconds
  if (everyXValue) {
    // convert values to milliseconds
    const everyXMilliseconds = everyXValue * 1000;
    if (elapsed % everyXMilliseconds === 0) {
      return {
        type: "retention.everyXSeconds",
        alertSound: everyXSound,
        elapsed,
      };
    }
  }
  return undefined;
};

const BreathRecoveryAlerts = (elapsed: number, currRecoveryTime: number): SecondsAlert => {
  // Pull out alert settings to check for from global alertSettings
  // NOTE: maybe this will be in actual state??
  // const {
  //   RecoveryBreath: {
  //     alertEveryXSeconds: { value: everyXValue, sound: everyXSound },
  //     alertXSecondsBeforeEnd: {
  //       value: secondsBeforeEndValue,
  //       sound: secondsBeforeEndSound,
  //       countDown,
  //       countDownSound,
  //     },
  //   },
  // } = alertSettings;

  const { value: everyXValue, sound: everyXSound } =
    alertSettings?.RecoveryBreath?.alertEveryXSeconds || {};
  const {
    value: secondsBeforeEndValue,
    sound: secondsBeforeEndSound,
    countDown,
    countDownSound,
  } = alertSettings?.RecoveryBreath?.alertXSecondsBeforeEnd || {};

  // convert values to milliseconds
  const everyXMilliseconds = everyXValue * 1000;
  const millisecondsBeforeEnd = secondsBeforeEndValue * 1000;
  // console.log("in BreathRetention alerts", countDown, secondsBeforeEndValue);
  if (elapsed === 0) return;
  //-- alertXSecondsBeforeEnd
  // This needs to come before alertEveryXSeconds as only one alert will be sent on each
  // check and this one should get priority
  if (countDown) {
    // Want to play a sound every second starting with the secondsBeforeEndValue
    // console.log("X Seconds before", currRecoveryTime, elapsed, millisecondsBeforeEnd);
    for (let x = 1000; x <= millisecondsBeforeEnd; x = x + 1000) {
      if (currRecoveryTime - x === elapsed) {
        return {
          type: "recovery.secondsBeforeEnd",
          alertSound: countDownSound,
          elapsed,
        };
      }
    }
  } else if (currRecoveryTime - millisecondsBeforeEnd === elapsed) {
    return {
      type: "recovery.secondsBeforeEnd",
      alertSound: secondsBeforeEndSound,
      elapsed,
    };
  }

  //-- alertEveryXSeconds
  if (everyXMilliseconds && elapsed % everyXMilliseconds === 0) {
    return {
      type: "recovery.everyXSeconds",
      alertSound: everyXSound,
      elapsed,
    };
  }
  return undefined;
};

/**
 * Return sound used for Intropause or outropause
 *
 * @param type  - which sound to return
 * @returns AlertSoundNames
 */
function getAlertSound(type: "intropause" | "outropause"): AlertSoundNames {
  // Get info needed from alertSettings
  // const {
  //   RecoveryBreath: {
  //     alertBreathInPause: { sound: alertBreathInSound },
  //     alertBreathOutPause: { sound: alertBreathOutSound },
  //   },
  // } = alertSettings;
  const { sound: alertBreathInSound } =
    alertSettings?.RecoveryBreath?.alertBreathInPause || {};
  const { sound: alertBreathOutSound } =
    alertSettings?.RecoveryBreath?.alertBreathInPause || {};

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
  setAlert: (val: Alert | undefined) => void
) => {
  // const test = useStore.getState().activeSessionSettings;
  // Needed to make sure we don't execute twice for same elapsed time
  // Not sure why it was calling function multiple times for certain elapsed times, but this fixed.
  if (prevElapsed === state.context.elapsed) return;
  prevElapsed = state.context.elapsed;

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
      setAlert(myAlert); // Will be null if we didn't get a "hit" for an alert
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
    setAlert(holdingAlert?.type);
    prevState = currState;
    if (holdingAlert?.alertSound) {
      console.log("playing holdingalert", holdingAlert.alertSound);
      await playSound(holdingAlert.alertSound);
    }
    return;
  }

  //-==================================
  //-- IntroPause sound (Breath in and Hold)
  //-==================================
  // the check of prevState makes it so we only call this once
  if (state.matches("intropause") && !prevState.includes("intropause")) {
    const alertBreathInSound = getAlertSound("intropause");
    prevState = currState; // Important that this comes before async call since being used in if
    if (alertBreathInSound) {
      await playSound(alertBreathInSound);
    }
    return;
  }

  //-==================================
  //-- Recovery Breath Alerts
  //-==================================
  if (state.matches("recoveryhold") && state.context.elapsed % 1000 === 0) {
    const currRoundHoldTime = state.context.recoveryHoldTime;

    const recoveryAlert = BreathRecoveryAlerts(state.context.elapsed, currRoundHoldTime);
    setAlert(recoveryAlert?.type);
    prevState = currState;
    if (recoveryAlert?.alertSound) {
      await playSound(recoveryAlert.alertSound);
    }
    return;
  }

  //-==================================
  //-- OutroPause sound (Breath out)
  //-==================================
  if (state.matches("outropause") && !prevState.includes("outropause")) {
    const alertBreathOutSound = getAlertSound("outropause");
    prevState = currState;
    if (alertBreathOutSound) {
      await playSound(alertBreathOutSound);
    }
    return;
  }
};
