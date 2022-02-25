import create, { GetState, SetState, StoreApi } from "zustand";
import { defaultSessions, defaultAlertSettings } from "./defaultSettings";
import { SessionSettingsType } from "../context/breathMachineContext";
import { AlertSettings } from "../utils/alertTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configurePersist } from "zustand-persist";
import { AlertSoundNames } from "../utils/sounds/soundTypes";
import { flatMapDeep, flattenDeep, uniq } from "lodash";
import { findKeyValuesInObject } from "../utils/helpers";

export type StoredSession = {
  id: string;
  name: string;
  alertSettings?: AlertSettings;
} & SessionSettingsType;

export type BreathState = {
  storedSessions: StoredSession[];
  activeSession: StoredSession | undefined;
  setActiveSession: (sessionId: string) => void;
  createNewSession: (sessionData: StoredSession) => void;
  deleteSession: (sessionId: string) => void;
  getActiveSessionSettings: () => SessionSettingsType | undefined;
  getActiveAlertSettings: () => [AlertSettings, Partial<AlertSoundNames>[]];
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
  // --SETTERS
  setActiveSession: (sessionId) =>
    set((state) => ({ activeSession: getSessionFromId(state.storedSessions, sessionId) })),
  createNewSession: (sessionData) =>
    set((state) => {
      if (!sessionData.id || !sessionData.name) {
        return { storedSessions: state.storedSessions };
      }
      return { storedSessions: [sessionData, ...state.storedSessions] };
    }),
  deleteSession: (sessionId) => {
    set((state) => {
      return { storedSessions: [...state.storedSessions.filter((el) => el.id !== sessionId)] };
    });
  },
  // --GETTERS
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
    if (!activeSession) return undefined;
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
      allowlist: ["storedSessions"], // optional, will save everything if allowlist is undefined
      denylist: [], // optional, if allowlist set, denylist will be ignored
    },
    storeFunction
  )
);

//**** Utils */
//-- Extract used Alert Sounds from session's alertSettings
function getAlertSoundNames(alertSettings: AlertSettings) {
  // Use helper function to return unique values in "sound" and "countDownSound" keys
  // Need to take the result and make it unique (get rid of dups)
  const uniqSounds = [
    ...findKeyValuesInObject(alertSettings, "sound", true),
    ...findKeyValuesInObject(alertSettings, "countDownSound", true),
  ];
  const uniqSoundsSet = new Set(uniqSounds);
  // console.log("GET UNIQUE", Array.from(uniqSoundsSet));
  return Array.from(uniqSoundsSet).filter((el) => el);
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
function getSessionFromId(
  storedSessions: StoredSession[],
  sessionId: string
): StoredSession | undefined {
  return storedSessions.find((session) => session.id === sessionId);
}
