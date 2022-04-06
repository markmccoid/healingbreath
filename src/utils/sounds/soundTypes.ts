import { Audio } from "expo-av";
import { Asset } from "expo-asset";

export type AlertSoundNames =
  | "bellding_001"
  | "bellding_002"
  | "bellding_003"
  | "bellding_004"
  | "bowlgong_001"
  | "bowlgong_002"
  | "bowlgong_003"
  | "bowlgong_004"
  | "bowlgong_005"
  | "bowlgong_006"
  | "bowlgong_long_001"
  | "bowlgong_long_002"
  | "bowlsinging_001"
  | "bowlsinging_002"
  | "bowlsinging_long_loop_001"
  | "ding_001"
  | "ding_002"
  | "metalclang_001"
  | "metalgong_001"
  | "metalgong_002"
  | "metalgong_003"
  | "speak_mm_breath_in_and_hold"
  | "speak_mm_breath_out"
  | "tibentanbowl_001"
  | "tick_001";

export type AlertSounds = {
  [assetName in AlertSoundNames]: Asset;
};

export type AlertPlayableSounds = {
  [assetName in AlertSoundNames]: Audio.Sound;
};

export type SoundLibrary = {
  // Will match to the AlertSoundNames type
  id: string;
  type: "alert" | "music";
  // Optional category could be used in drop down list
  category: string;
  // Name to show to user
  displayName: string;
  // file name without path
  fileName: string;
  // length in seconds of clip
  length: number;
  // volume defaults to 1
  volume: number;
};
