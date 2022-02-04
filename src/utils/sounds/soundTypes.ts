import { Audio } from "expo-av";
import { Asset } from "expo-asset";

export type AssetNames =
  | "tick"
  | "ding"
  | "gong"
  | "churchBell"
  | "breathInMark"
  | "breathOutMark"
  | "airplaneDing"
  | "elevatorDing";

export type AlertSounds = {
  [assetName in AssetNames]: Asset;
};

export type AlertPlayableSounds = {
  [assetName in AssetNames]: Audio.Sound;
};
