import React, { createContext, useState, useCallback, useReducer } from "react";
import { breathMachine, BreathContext, BreathRoundsDetail } from "../machines/breathMachine";
import uuid from "react-native-uuid";

import _, { isEqual } from "lodash";

import { StoredSession, useStore } from "../store/useStore";
import { Alert } from "../utils/alertTypes";

// Object compare for xstate's useSelectors compare function.
export const objCompare = (prevObj: any, nextObj: any) => isEqual(prevObj, nextObj);

type InputValues =
  | "inhaleTime"
  | "exhaleTime"
  | "pauseTime"
  | "breathReps"
  | "breathRounds"
  | "defaultHoldTime"
  | "recoveryHoldTime"
  | "actionPauseTimeIn"
  | "actionPauseTimeOut";

type DisplayValues = {
  name: string;
  inhaleTime: string;
  exhaleTime: string;
  pauseTime: string;
  breathReps: string;
  breathRounds: string;
  breathRoundsDetail?: BreathRoundsDetail;
  defaultHoldTime: string;
  recoveryHoldTime: string;
  actionPauseTimeIn: string;
  actionPauseTimeOut: string;
};
type ErrorMessages = {
  name?: string;
  inhaleTime?: string;
  exhaleTime?: string;
  pauseTime?: string;
  breathReps?: string;
  breathRounds?: string;
  defaultHoldTime?: string;
  breathRoundsDetail?: BreathRoundsDetail;
  recoveryHoldTime?: string;
  actionPauseTimeIn?: string;
  actionPauseTimeOut?: string;
};
type SessionInputContextType = {
  displayValues: DisplayValues;
  setters: {};
  errorMessages?: ErrorMessages;
  isValidToSave: boolean;
  saveSession: () => void;
  finalValues?: {
    name: string;
    inhaleTime: number;
    exhaleTime: number;
    pauseTime: number;
    breathReps: number;
    breathRounds: number;
    defaultHoldTime: number;
    breathRoundsDetail: BreathRoundsDetail;
    recoveryHoldTime: number;
    actionPauseTimeIn: number;
    actionPauseTimeOut: number;
  };
};

type State = { displayValues: DisplayValues; errorMessages?: ErrorMessages };
type Action =
  | { type: "name"; payload: { name: string; error?: string } }
  | { type: "breathRounds"; payload: { breathRounds: string; error?: string } }
  | { type: "breathReps"; payload: { breathReps: string; error?: string } }
  | { type: "recoveryHoldTime"; payload: { recoveryHoldTime: string; error?: string } }
  | {
      type: "retentionHoldTimes";
      payload: { index: number; holdTime: string; error?: string };
    };

type FormReducer = (state: State, action: Action) => State;

//*** REDUCER */
function formReducer(state: State, action: Action): State {
  let displayValues;
  let errorMessages;
  switch (action.type) {
    case "name":
      displayValues = { ...state.displayValues, name: action.payload.name };
      errorMessages = { ...state.errorMessages, name: action.payload?.error };
      return { displayValues, errorMessages };
    case "breathRounds":
      displayValues = { ...state.displayValues, breathRounds: action.payload.breathRounds };
      errorMessages = { ...state.errorMessages, breathRounds: action.payload?.error };
      return { displayValues, errorMessages };
    case "breathReps":
      // displayValues = { ...state.displayValues, breathReps: action.payload };
      displayValues = { ...state.displayValues, breathReps: action.payload.breathReps };
      errorMessages = { ...state.errorMessages, breathReps: action.payload?.error };
      return { displayValues, errorMessages };
    case "recoveryHoldTime":
      // displayValues = { ...state.displayValues, recoveryHoldTime: action.payload };
      displayValues = {
        ...state.displayValues,
        recoveryHoldTime: action.payload.recoveryHoldTime,
      };
      errorMessages = { ...state.errorMessages, recoveryHoldTime: action.payload?.error };
      return { displayValues, errorMessages };
    case "retentionHoldTimes":
      const { index, holdTime, error } = action.payload;
      // Based on index update or create the appropriate hold time entry
      let breathRoundDets = { ...state.displayValues.breathRoundsDetail };
      breathRoundDets = { ...breathRoundDets, [index]: { holdTime } };
      displayValues = { ...state.displayValues, breathRoundsDetail: breathRoundDets };

      let errorMessagesBR = { ...state.errorMessages?.breathRoundsDetail };
      errorMessagesBR = { ...errorMessagesBR, [index]: error };
      errorMessages = { ...state.errorMessages, breathRoundsDetail: errorMessages };
      return {
        displayValues,
        errorMessages,
      };

    default:
      return state;
      break;
  }
}
//*** ACTIONS */
//--UTILS
function returnANumber(input: string): undefined | string {
  if (!input) return;
  if (isNaN(parseInt(input)) || parseInt(input) <= 0) {
    return undefined;
  }
  return input.match(/\d+/)?.[0];
}
//---------SESSION NAME
function setSessionName(name: string): Action {
  let error = undefined;

  if (!name || name.length === 0) {
    // Not a number
    name = "";
    error = "Session Name required";
  }
  return { type: "name", payload: { name, error } };
}
//---------BREATH ROUNDS
function setBreathRounds(breathRounds: string): Action {
  let error = undefined;
  let breathRoundsValidated = returnANumber(breathRounds);
  if (!breathRoundsValidated) {
    // Not a number
    breathRoundsValidated = "";
    error = "Breath rounds must be numeric";
  }
  return { type: "breathRounds", payload: { breathRounds: breathRoundsValidated, error } };
}
//---------BREATH REPS
function setBreathReps(breathReps: string): Action {
  let error = undefined;
  let breathRepsValidated = returnANumber(breathReps);
  if (!breathRepsValidated) {
    // Not a number
    breathRepsValidated = "";
    error = "Breath reps must be numeric";
  }
  return { type: "breathReps", payload: { breathReps: breathRepsValidated, error } };
}
//---------Recovery HOLD TIME
function setRecoveryHoldTime(recoveryHoldTime: string): Action {
  let error = undefined;
  let recoveryHoldTimeValidated = returnANumber(recoveryHoldTime);
  if (!recoveryHoldTimeValidated) {
    // Not a number
    recoveryHoldTimeValidated = "";
    error = "recovery Hold Time must be numeric";
  }
  return {
    type: "recoveryHoldTime",
    payload: { recoveryHoldTime: recoveryHoldTimeValidated, error },
  };
}

//---------Retention HOLD TIMES
function setRetentionHoldTimes(index: number, holdTime: string): Action {
  let error = undefined;
  let holdTimeValidated = returnANumber(holdTime);
  if (!holdTimeValidated) {
    // Not a number
    holdTimeValidated = "";
    error = "Hold Time must be numeric";
  }
  return {
    type: "retentionHoldTimes",
    payload: { index, holdTime: holdTimeValidated, error },
  };
}

//*** UTILITY Action Creator functions */
function bindActionCreator(actionCreator: () => void, dispatch: any) {
  return function (this: any, ...args: any[]) {
    dispatch(actionCreator.apply(this, args));
  };
}
function bindActionCreators(
  actionCreators: any,
  dispatch: any
): { [key: string]: () => Action } {
  if (typeof actionCreators === "function") {
    console.log(
      "Only binding objects of action creators, send over an object of action creators."
    );
    // return bindActionCreator(actionCreators, dispatch);
  }

  const boundActionCreators: { [key: string]: () => Action } = {};
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
//******************* */

const initialInputs = {
  displayValues: {
    name: "Enter Session Name",
    inhaleTime: "1.6",
    exhaleTime: "1.6",
    pauseTime: "0",
    breathReps: "30",
    breathRounds: "3",
    defaultHoldTime: "60",
    recoveryHoldTime: "15",
    actionPauseTimeIn: "4",
    actionPauseTimeOut: "7",
  },
};

const saveSessionPrep = (displayValues: DisplayValues, createNewSession) => {
  const id = uuid.v4() as string;

  //--- Create the breathRoundsDetail object merging defaults with defined

  const initArray = (_, index: number) => index + 1;
  // Create an array of breath round numbers [1,2,3]
  const breathRoundsArray = Array.from(
    { length: parseInt(displayValues.breathRounds) },
    initArray
  );
  // use array of breath rounds to get a default breathRoundsDetail object
  const breathRoundsDefault: BreathRoundsDetail = breathRoundsArray.reduce((final, el) => {
    return { ...final, [el]: { holdTime: parseInt(displayValues.defaultHoldTime) } };
  }, {});

  // Merge the default object with fields defined by user
  const finalBreathRoundsDetail: BreathRoundsDetail = Object.keys(breathRoundsDefault).reduce(
    (final, key) => {
      const next = displayValues?.breathRoundsDetail?.[key] || breathRoundsDefault[key];
      return { ...final, [key]: next };
    },
    {}
  );
  //------------------------------------------------------------

  const finalValues: StoredSession = {
    id,
    name: displayValues.name,
    inhaleTime: parseFloat(displayValues.inhaleTime),
    exhaleTime: parseFloat(displayValues.exhaleTime),
    pauseTime: parseInt(displayValues.pauseTime),
    breathReps: parseInt(displayValues.breathReps),
    breathRounds: parseInt(displayValues.breathRounds),
    defaultHoldTime: parseInt(displayValues.defaultHoldTime),
    recoveryHoldTime: parseInt(displayValues.recoveryHoldTime),
    actionPauseTimeIn: parseInt(displayValues.actionPauseTimeIn),
    actionPauseTimeOut: parseInt(displayValues.actionPauseTimeOut),
    breathRoundsDetail: finalBreathRoundsDetail,
  };
  // console.log("final Values", finalValues);
  createNewSession(finalValues);
};

type Setters = {
  setBreathRounds: (breathRounds: string) => Action;
  setBreathReps: (breathReps: string) => Action;
  setRecoveryHoldTime: (recoveryHoldTime: string) => Action;
  setSessionName: (name: string) => Action;
  setRetentionHoldTimes: (index: number, holdTime: string) => Action;
};
export const SessionInputContext = createContext({} as SessionInputContextType);
//************************
//*- SessionInputProvider
//************************
export const SessionInputProvider = ({ children }: { children: any }) => {
  const { createNewSession } = useStore();
  const [state, dispatch] = useReducer<FormReducer>(formReducer, initialInputs);
  const actionCreators: Setters = {
    setBreathRounds,
    setBreathReps,
    setRecoveryHoldTime,
    setSessionName,
    setRetentionHoldTimes,
  };
  // const setters = useCallback(() => bindActionCreators(actionCreators, dispatch), []);
  const setters = bindActionCreators(actionCreators, dispatch);

  // const alertSettings = useStore((state) => state.getActiveAlertSettings());
  const saveSession = () => saveSessionPrep(state.displayValues, createNewSession);
  return (
    <SessionInputContext.Provider
      value={{
        displayValues: state.displayValues,
        setters,
        errorMessages: state.errorMessages,
        saveSession,
      }}
    >
      {children}
    </SessionInputContext.Provider>
  );
};

export const useSessionInputs = (): SessionInputContextType => {
  const context = React.useContext(SessionInputContext);
  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error("SessionInputContext was used outside of its Provider");
  }
  return context;
};
