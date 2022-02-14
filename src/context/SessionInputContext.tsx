import React, { createContext, useState, useCallback, useReducer } from "react";
import { breathMachine, BreathContext } from "../machines/breathMachine";

import _, { isEqual } from "lodash";

import { useStore } from "../store/useStore";
import { Alert } from "../utils/alertTypes";
import { BreathRoundsDetail } from "../machines/breathMachine";

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
  | { type: "name"; payload: string }
  | { type: "breathRounds"; payload: { breathRounds: string; error?: string } }
  | { type: "breathReps"; payload: string }
  | { type: "recoveryHoldTime"; payload: string }
  | { type: "retentionHoldTimes"; payload: { index: string; holdTime: string } };

type FormReducer = (state: State, action: Action) => State;

//*** REDUCER */
function formReducer(state: State, action: Action): State {
  let displayValues;
  let errorMessages;
  switch (action.type) {
    case "name":
      displayValues = { ...state.displayValues, name: action.payload };
      return { displayValues, errorMessages: {} };
    case "breathRounds":
      displayValues = { ...state.displayValues, breathRounds: action.payload.breathRounds };
      errorMessages = { ...state.errorMessages, breathRounds: action.payload?.error };
      return { displayValues, errorMessages };
    case "breathReps":
      displayValues = { ...state.displayValues, breathReps: action.payload };
    case "recoveryHoldTime":
      displayValues = { ...state.displayValues, recoveryHoldTime: action.payload };
    case "retentionHoldTimes":
      const { index, holdTime } = action.payload;
      // Based on index update or create the appropriate hold time entry
      return {
        ...state,
        breathRoundsDetail: {
          ...state.breathRoundsDetail,
          [index]: { holdTime },
        },
      };
    default:
      return state;
      break;
  }
}
//*** ACTIONS */
function setBreathRounds(breathRounds: string) {
  if (isNaN(parseInt(breathRounds))) {
    // Not a number
    breathRounds = "";
  }
  return { type: "breathRounds", payload: { breathRounds, error: "Breath Round Error" } };
}

//*** UTILITY Action Creator functions */
function bindActionCreator(actionCreator, dispatch) {
  return function (this: any, ...args: any[]) {
    return dispatch(actionCreator.apply(this, args));
  };
}
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch);
  }

  const boundActionCreators = {};
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
    name: "",
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

export const SessionInputContext = createContext({} as SessionInputContextType);
//************************
//*- SessionInputProvider
//************************
export const SessionInputProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer<FormReducer>(formReducer, initialInputs);
  const setters = useCallback(bindActionCreators({ setBreathRounds }, dispatch), []);
  // const alertSettings = useStore((state) => state.getActiveAlertSettings());

  return (
    <SessionInputContext.Provider
      value={{
        displayValues: state.displayValues,
        setters,
        errorMessages: state.errorMessages,
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
