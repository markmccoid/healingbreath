import { Asset } from "expo-asset";
import { AlertSoundNames } from "./sounds/soundTypes";

export type AlertSettings = {
  ConsciousForcedBreathing?: {
    alertEveryXBreaths?: {
      value: number;
      sound: AlertSoundNames;
    };
    alertXBreathsBeforeEnd?: {
      value: number;
      sound: AlertSoundNames;
      countDown: boolean;
      countDownSound: AlertSoundNames;
    };
  };
  BreathRetention?: {
    alertEveryXSeconds?: {
      value: number;
      sound: AlertSoundNames;
    };
    alertXSecondsBeforeEnd?: {
      value: number;
      sound: AlertSoundNames;
      countDown: boolean;
      countDownSound: AlertSoundNames;
    };
  };
  RecoveryBreath?: {
    alertBreathInPause?: {
      sound: AlertSoundNames;
    };
    alertEveryXSeconds?: {
      value: number;
      sound: AlertSoundNames;
    };
    alertXSecondsBeforeEnd?: {
      value: number;
      sound: AlertSoundNames;
      countDown: boolean;
      countDownSound: AlertSoundNames;
    };
    alertBreathOutPause?: {
      sound: AlertSoundNames;
    };
  };
};

type BreathAlertNames = "breathing.everyXBreaths" | "breathing.breathsBeforeEnd";
type SecondsAlertNames =
  | "retention.everyXSeconds"
  | "retention.secondsBeforeEnd"
  | "recovery.everyXSeconds"
  | "recovery.secondsBeforeEnd";

export type Alert<T = SecondsAlertNames | BreathAlertNames> = {
  type: T;
  alertSound: AlertSoundNames;
  // breath number that triggered alert
  breath?: number;
  // elapsed seconds that triggered alert (milliseconds)
  elapsed?: number;
};
export type BreathAlert = Omit<Alert<BreathAlertNames>, "elapsed"> | undefined;
export type SecondsAlert = Omit<Alert<SecondsAlertNames>, "breath"> | undefined;
