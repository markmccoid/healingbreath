import {
  useBreathState,
  objCompare,
  SessionSettingsType,
} from "../context/breathMachineContext";
import { useCallback } from "react";
import { useSelector } from "@xstate/react";
import { Sender, State, StateValue } from "xstate";
import { BreathContext, BreathEvent } from "../machines/breathMachine";

type BreathContextWOElapsed = Omit<BreathContext, "elapsed">;

function getBreathState(state) {
  const output = {
    idle: "Idle",
    "breathing.inhale": "Inhale",
    "breathing.exhale": "Exhale",
    "breathing.hold": "Breathing Hold",
    "breathing.paused": "Breathing Paused",
    "holding.breathhold": "Hold",
    "holding.pause": "Hold Paused",
    intropause: "Intro Pause",
    "recoveryhold.breathhold": "Recovery Hold",
    "recoveryhold.paused": "Recovery Paused",
    outropause: "Outro Pause",
  };
  for (const [key, value] of Object.entries(output)) {
    if (state.matches(key)) {
      return [key, value];
    }
  }
  return "not Found";
  // state.matches("breathing.inhale")
}

type BreathData = {
  // Context values with elapsed removed.  Helps with unnecessary rerenders
  context: BreathContextWOElapsed;
  // current state value of machine
  value: StateValue;
  // string version of current state value using
  breathState: [string, string];
};
// Selector that excludes elapsed from the context
const getContextSansElapsed = (
  state: State<
    BreathContext,
    BreathEvent,
    any,
    {
      value: any;
      context: BreathContext;
    }
  >
) => {
  const context: BreathContextWOElapsed = { ...state.context };
  delete context.elapsedInt;
  delete context.elapsed;
  const newData = {
    context,
    value: state.value,
    breathState: getBreathState(state),
  } as BreathData;
  return newData;
};

//------------------------------------
// Main hook that returns all context except elapsed
// AND returns the send function to send events
// -- opt for useBreathEvents instead of send --
//------------------------------------
export const useBreathMachineMain = (): [BreathData, Sender<BreathEvent>] => {
  const breathStateServices = useBreathState();
  const send = breathStateServices.breathStateService.send;
  const breathData = useSelector(
    breathStateServices.breathStateService,
    getContextSansElapsed,
    objCompare
  );

  return [breathData, send];
};

export const useBreathMethods = () => {
  const breathStateServices = useBreathState();
  const nextEvents = useSelector(
    breathStateServices.breathStateService,
    (state) => [...state.nextEvents].filter((e) => e !== "TICK"),
    // matches: state.matches
    objCompare
  );
  // const matches = useSelector(
  //   breathStateServices.breathStateService,
  //   (state) => state.matches,
  //   objCompare
  // );
  return { nextEvents };
};

//------------------------------------
// just returns the elapsed number
//------------------------------------
export const useTimer = (): number => {
  const breathStateServices = useBreathState();
  // const [state] = useActor(breathStateServices.breathStateService);
  const elapsed = useSelector(
    breathStateServices.breathStateService,
    (state) => state.context.elapsed
  );
  //return Math.round(elapsed * 100) / 100;
  return Math.round(elapsed);
};
//------------------------------------
// Useful flags helpful in indicating
// state and thus events possible
//------------------------------------
export const useBreathFlags = () => {
  const breathStateServices = useBreathState();
  // - - - - - - - - - - - - - -
  const canPause = useSelector(
    breathStateServices.breathStateService,
    (state) => state.can("PAUSE") && !state.can("UNPAUSE")
  );
  // - - - - - - - - - - - - - -
  const canUnPause = useSelector(breathStateServices.breathStateService, (state) =>
    state.can("UNPAUSE")
  );
  // - - - - - - - - - - - - - -
  const canExtend = useSelector(breathStateServices.breathStateService, (state) =>
    state.can("EXTEND_TOGGLE")
  );
  // - - - - - - - - - - - - - -
  const canStart = useSelector(breathStateServices.breathStateService, (state) =>
    state.can("START")
  );
  // - - - - - - - - - - - - - -
  const canStop = useSelector(breathStateServices.breathStateService, (state) =>
    state.can("STOP")
  );
  // - - - - - - - - - - - - - -
  const isExtending = useSelector(
    breathStateServices.breathStateService,
    (state) => state.context.extend
  );

  return { canPause, canUnPause, canExtend, canStart, canStop, isExtending };
};

//------------------------------------
// update sessionSettings function used in useBreathEvents
//------------------------------------
const updateSessionSettings =
  (send) =>
  (sessionSettings: SessionSettingsType, clearSessionStats: boolean = true) => {
    if (clearSessionStats) {
      send({
        type: "UPDATE_DEFAULTS",
        sessionSettings: {
          ...sessionSettings,
          sessionStats: undefined,
          sessionComplete: false,
        },
      });
    } else {
      send({ type: "UPDATE_DEFAULTS", sessionSettings });
    }
  };
//------------------------------------
// Hook the encapulates events for easy use.
//------------------------------------
export const useBreathEvents = () => {
  const breathStateServices = useBreathState();
  const send = breathStateServices.breathStateService.send;
  const breathEvents = {
    startSession: () => send("START"),
    stopSession: () => send("STOP"),
    pauseSession: () => send("PAUSE"),
    unpauseSession: () => send("UNPAUSE"),
    goToNext: () => send("NEXT"),
    extendSession: () => send("EXTEND_TOGGLE"),
    updateSessionSettings: updateSessionSettings(send), //(sessionSettings: SessionSettingsType) => send({ type: "UPDATE_DEFAULTS", sessionSettings }),
  };
  return breathEvents;
};
