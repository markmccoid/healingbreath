import React, { useContext, useEffect, useRef, useState } from "react";

import {
  useBreathState,
  objCompare,
  SessionSettingsType,
} from "../context/breathMachineContext";
import { useTimer } from "./useBreathMachineHooks";

// import { useCallback } from "react";
import { useActor, useSelector } from "@xstate/react";
import { Sender, State, StateValue } from "xstate";
import { BreathContext, BreathEvent, BreathRoundsDetail } from "../machines/breathMachine";

function checkBreathingRep(currentBreath: number, breathRef: React.MutableRefObject<number>) {
  if (currentBreath % 2 === 0 && breathRef.current !== currentBreath) {
    breathRef.current = currentBreath;
    return true;
  }
}
export function useTimingAlerts() {
  // const {} = config;
  // const [publishSubscribe, setPubSub] = useState({ subscribe: () => {}, publish: () => {} });
  const breathStateServices = useBreathState();
  const [state] = useActor(breathStateServices.breathStateService);
  const elapsed = state.context.elapsed;
  // const timeLeft = state.context.timeLeft;
  const currentBreath = state.context.breathCurrRep;

  const [alert, setAlert] = useState();
  // const currState = state.value;
  // const breathRef = useRef(0);

  useEffect(() => {
    if (currentBreath === 2) {
      setAlert({ message: "CB 2" });
    }
  }, [currentBreath]);
  useEffect(() => {
    // console.log("elapsed", elapsed);
    if (elapsed > 2000) {
      setAlert({ message: "EL 2" });
    }
  }, [elapsed]);

  // useEffect(() => {
  //   if (alert) {
  //     setAlert(undefined);
  //   }
  // });
  return alert;
  // console.log("inusetimingalerts0", publishSubscribe.subscribe.toString());

  // useEffect(() => {
  //   console.log("in UseEffect Timing");
  //   breathRef.current = 0;
  //   return () => console.log("unmounting useeffect timing");
  // }, [state.matches("idle")]);

  // let currentState = "idle";
  // if (state.matches("breathing")) {
  //   currentState = "breathing";
  // } else if (state.matches("holding")) {
  //   currentState = "holding";
  // } else if (state.matches("recoveryhold")) {
  //   currentState = "recoveryhold";
  // }

  // switch (currentState) {
  //   case "breathing":
  //     return checkBreathingRep(currentBreath, breathRef);
  //     break;
  //   case "holding":
  //     break;
  //   case "recoveryhold":
  //     break;
  //   default:
  //     break;
  // }

  // if (state.matches("holding") && timeLeft < 10000) {
  //   console.log("holding timeleft < 10");
  // }
}
