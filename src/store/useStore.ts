import create, { GetState, SetState, StoreApi } from "zustand";
import { defaultSessions, defaultAlertSettings } from "./defaultSettings";
import { SessionSettingsType } from "../context/breathMachineContext";
import { AlertSettings } from "../utils/alertTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configurePersist } from "zustand-persist";

export type StoredSession = {
  id: string;
  name: string;
  alertSettings?: AlertSettings;
} & SessionSettingsType;

export type BreathState = {
  storedSessions: StoredSession[];
  activeSession: StoredSession | undefined;
  setActiveSession: (session: StoredSession) => void;
  createNewSession: (sessionData: StoredSession) => void;
  deleteSession: (sessionId: string) => void;
  getActiveSessionSettings: () => SessionSettingsType | undefined;
  getActiveAlertSettings: () => AlertSettings;
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
  setActiveSession: (storedSession) => set((state) => ({ activeSession: storedSession })),
  createNewSession: (sessionData) =>
    set((state) => {
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
    // If not session is active, return undefined
    if (!activeSession) return defaultAlertSettings;
    // Remove the id and name as they are not part of the session settings
    const { alertSettings, ...otherSettings } = activeSession;
    return alertSettings || defaultAlertSettings; // for typescript.  Above return should keep the || from happening
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
      key: "breath", // required, child key of storage
      allowlist: ["storedSessions"], // optional, will save everything if allowlist is undefined
      denylist: [], // optional, if allowlist set, denylist will be ignored
    },
    storeFunction
  )
);

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
  const breathRoundsDetail = { ...settings?.breathRoundsDetail };
  if (breathRoundsDetail) {
    Object.keys(breathRoundsDetail).forEach((key) => {
      breathRoundsDetail[key].holdTime = breathRoundsDetail[key].holdTime * 1000;
    });
  }
  updatedSettings.breathRoundsDetail = { ...breathRoundsDetail };
  return updatedSettings;
}
