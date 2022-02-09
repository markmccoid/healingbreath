import { Audio } from "expo-av";
import { Asset } from "expo-asset";

export type AlertSoundNames =
  | "tick"
  | "ding"
  | "gong"
  | "churchBell"
  | "breathInMark"
  | "breathOutMark"
  | "airplaneDing"
  | "elevatorDing";

export type AlertSounds = {
  [assetName in AlertSoundNames]: Asset;
};

export type AlertPlayableSounds = {
  [assetName in AlertSoundNames]: Audio.Sound;
};
