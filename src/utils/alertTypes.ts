import { Asset } from "expo-asset";
import { AlertSoundNames } from "./sounds/soundTypes";

export type AlertSettings = {
  ConsciousForcedBreathing?: {
    alertEveryXBreaths?: {
      value: number;
      sound: AlertSoundNames | undefined;
    };
    alertXBreathsBeforeEnd?: {
      value: number;
      sound: AlertSoundNames | undefined;
      countDown: boolean;
      countDownSound: AlertSoundNames | undefined;
    };
  };
  BreathRetention?: {
    alertEveryXSeconds?: {
      value: number;
      sound: AlertSoundNames | undefined;
    };
    alertXSecondsBeforeEnd?: {
      value: number;
      sound: AlertSoundNames | undefined;
      countDown: boolean;
      countDownSound: AlertSoundNames | undefined;
    };
  };
  RecoveryBreath?: {
    alertBreathInPause?: {
      sound: AlertSoundNames | undefined;
    };
    alertEveryXSeconds?: {
      value: number;
      sound: AlertSoundNames | undefined;
    };
    alertXSecondsBeforeEnd?: {
      value: number;
      sound: AlertSoundNames | undefined;
      countDown: boolean;
      countDownSound: AlertSoundNames | undefined;
    };
    alertBreathOutPause?: {
      sound: AlertSoundNames | undefined;
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
  alertSound: AlertSoundNames | undefined;
  // breath number that triggered alert
  breath?: number;
  // elapsed seconds that triggered alert (milliseconds)
  elapsed?: number;
};
export type BreathAlert = Omit<Alert<BreathAlertNames>, "elapsed"> | undefined;
export type SecondsAlert = Omit<Alert<SecondsAlertNames>, "breath"> | undefined;
