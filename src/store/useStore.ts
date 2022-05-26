import create, { GetState, SetState, StoreApi } from "zustand";
import { defaultSessions, defaultAlertSettings } from "./defaultSettings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configurePersist } from "zustand-persist";
import { flatMapDeep, flattenDeep, uniq } from "lodash";
import { findKeyValuesInObject } from "../utils/helpers";
// Types
import { AlertSoundNames } from "../utils/sounds/soundTypes";
import { SessionSettingsType } from "../context/breathMachineContext";
import { SessionStats } from "../machines/breathMachine";
import { AlertSettings } from "../utils/alertTypes";
import { stateValuesEqual } from "xstate/lib/State";

export type StoredSession = {
  id: string;
  name: string;
  alertSettings?: AlertSettings;
} & SessionSettingsType;

export type StoredSessionStats = {
  statsId: string;
  sessionName: string;
  sessionDate: Date;
  sessionLengthDisplay: string;
  sessionLengthSeconds: number;
  numberOfRounds: number;
  SessionStats: SessionStats;
};
export type BreathState = {
  // Array of all stored sessions
  storedSessions: StoredSession[];
  // Current session that has be selected
  activeSession: StoredSession | undefined;
  // sets the activeSession property to hold the session data based on the passed id
  setActiveSession: (sessionId: string) => void;
  // Create or update a session
  createUpdateSession: (sessionData: StoredSession) => void;
  // Delete session from storesSessions
  deleteSession: (sessionId: string) => void;
  // Returns session data from a session with the passed sessionId
  getSessionFromId: (sessionId: string) => StoredSession | undefined;
  // The stored session contains all the information about a session
  // But it is needed it two different areas.  One area is the session info
  // the the breathMachine state machine needs, the other is the Alert settings
  // that deal with when to play sounds during the session
  // This getter returns the session Info (state machine needs)
  getActiveSessionSettings: () => SessionSettingsType | undefined;
  // This getter returns alert information so app knows when and what sounds to play
  getActiveAlertSettings: () => [AlertSettings, Partial<AlertSoundNames>[]] | [];
  //** Session Stats **//
  // Array of stored/completed sessions sessions
  storedSessionStats: StoredSessionStats[];
  // Adds the passed session to the storedSessionStats array
  addSessionStats: (newSession: StoredSessionStats) => void;
  getSessionStats: () => StoredSessionStats[];
};

//-- Configure zustand persist
const { persist, purge } = configurePersist({
  storage: AsyncStorage, // use `AsyncStorage` in react native
  rootKey: "root", // optional, default value is `root`
});

//-- Function that defines the store setters and getters
const storeFunction = (
  set: SetState<BreathState>,
  get: GetState<BreathState>
): BreathState => ({
  storedSessions: defaultSessions,
  activeSession: undefined,
  storedSessionStats: [],
  // --SETTERS
  setActiveSession: (sessionId) =>
    set((state) => ({
      activeSession: retrieveSessionFromId(state.storedSessions, sessionId),
    })),
  createUpdateSession: (sessionData) =>
    set((state) => {
      // Must have an id or a name otherwise, do nothing
      if (!sessionData.id || !sessionData.name) {
        return { storedSessions: state.storedSessions };
      }

      // get id from passed sessionData and search through stored sessions
      // removing any sessions with the same id.
      // If we are updating a session, this removes it from the currSessions variable
      // Now we can add the new/updated session to the list and spread the currSessions
      const { id } = sessionData;
      const currSessions = state.storedSessions.filter((el) => el.id !== id);

      return {
        storedSessions: [sessionData, ...currSessions],
      };
    }),
  deleteSession: (sessionId) => {
    set((state) => {
      return { storedSessions: [...state.storedSessions.filter((el) => el.id !== sessionId)] };
    });
  },
  // --GETTERS
  getSessionFromId: (sessionId) => {
    return retrieveSessionFromId(get().storedSessions, sessionId);
  },
  getActiveSessionSettings: () => {
    const activeSession = get().activeSession;
    // If not session is active, return undefined
    if (!activeSession) return activeSession;
    // Remove the id and name as they are not part of the session settings
    const { id, name, alertSettings, ...settingsOnly } = activeSession;
    const updatedSettings = convertSecondsToMS(settingsOnly);
    return updatedSettings;
  },
  getActiveAlertSettings: () => {
    const activeSession = get().activeSession;
    // If no session is active, return undefined
    if (!activeSession) return [];
    // Separate the alertSettings from all the other settings in the session
    let { alertSettings, ...otherSettings } = activeSession;
    // If not alert settings, then use defaultAlertSettings
    if (!alertSettings) {
      alertSettings = defaultAlertSettings;
    }
    // extract the alert sounds used in these settings
    const alertSoundNames = getAlertSoundNames(alertSettings);
    return [alertSettings, alertSoundNames];
  },
  //
  addSessionStats: (newSession) => {
    set((state) => {
      return { storedSessionStats: [newSession, ...state.storedSessionStats] };
    });
  },
  getSessionStats: () => {
    return get().storedSessionStats;
  },
});

export const useStore = create<
  BreathState,
  SetState<BreathState>,
  GetState<BreathState>,
  StoreApi<BreathState>
>(
  persist(
    {
      key: "breath6", // required, child key of storage
      allowlist: ["storedSessions", "storedSessionStats"], // optional, will save everything if allowlist is undefined
      denylist: [], // optional, if allowlist set, denylist will be ignored
    },
    storeFunction
  )
);

//**** Utils */
//-- Extract used Alert Sounds from session's alertSettings
function getAlertSoundNames(
  alertSettings: AlertSettings
): Partial<AlertSoundNames>[] | undefined {
  // Use helper function to return unique values in "sound" and "countDownSound" keys
  // Need to take the result and make it unique (get rid of dups)
  const uniqSounds = [
    ...findKeyValuesInObject(alertSettings, "sound", true),
    ...findKeyValuesInObject(alertSettings, "countDownSound", true),
  ];
  const uniqSoundsSet = new Set(uniqSounds);
  // console.log("GET UNIQUE", Array.from(uniqSoundsSet));
  return Array.from(uniqSoundsSet).filter((el) => el) as
    | Partial<AlertSoundNames>[]
    | undefined;
}

//----------------------------
//-- Convert To milliseconds
//----------------------------
function convertSecondsToMS(settings: SessionSettingsType): SessionSettingsType {
  let updatedSettings = { ...settings };
  const settingsAffected = [
    "inhaleTime",
    "pauseTime",
    "exhaleTime",
    "defaultHoldTime",
    "recoveryHoldTime",
    "actionPauseTimeIn",
    "actionPauseTimeOut",
  ];

  // Loop through top level context and only update the
  // values in settingsAffected array to milliseconds
  Object.keys(updatedSettings).forEach((key) => {
    if (updatedSettings?.[key] && settingsAffected.some((el) => el === key)) {
      updatedSettings[key] = updatedSettings[key] * 1000;
    }
  });

  // breathRoundsDetail is an sub object.  Deal with this separately
  // Since it is a sub object, make a deep clone so that we are not
  // inadvertantely changing the source object
  const breathRoundsDetail = JSON.parse(JSON.stringify(settings?.breathRoundsDetail));
  if (breathRoundsDetail) {
    Object.keys(breathRoundsDetail).forEach((key) => {
      breathRoundsDetail[key].holdTime = breathRoundsDetail[key].holdTime * 1000;
    });
  }
  updatedSettings.breathRoundsDetail = { ...breathRoundsDetail };
  return updatedSettings;
}
//----------------------------
//-- get session from Id
//----------------------------
function retrieveSessionFromId(
  storedSessions: StoredSession[],
  sessionId: string
): StoredSession | undefined {
  return storedSessions.find((session) => session.id === sessionId);
}
