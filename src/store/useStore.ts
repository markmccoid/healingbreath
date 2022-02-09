import create, { GetState, SetState, StoreApi } from "zustand";
import { defaultSessions } from "./defaultSettings";
import { SessionSettingsType } from "../context/breathMachineContext";
import { AlertSettings } from "../utils/alertTypes";
import { defaultAlertSettings } from "./defaultSettings";
import { BreathContext } from "../machines/breathMachine";

export type StoredSession = {
  id: string;
  name: string;
  alertSettings?: AlertSettings;
} & SessionSettingsType;

type BreathState = {
  storedSessions: StoredSession[];
  activeSession: StoredSession | undefined;
  setActiveSession: (session: StoredSession) => void;
  getActiveSessionSettings: () => SessionSettingsType | undefined;
  getActiveAlertSettings: () => AlertSettings;
};

export const useStore = create<
  BreathState,
  SetState<BreathState>,
  GetState<BreathState>,
  StoreApi<BreathState>
>((set, get) => ({
  storedSessions: defaultSessions,
  activeSession: undefined,
  setActiveSession: (storedSession) => set((state) => ({ activeSession: storedSession })),
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
}));

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
