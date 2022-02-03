import { Asset } from "expo-asset";
import { AssetNames } from "./sounds/soundTypes";

export type AlertSettings = {
  ConsciousForcedBreathing: {
    alertEveryXBreaths: {
      value: number;
      sound: AssetNames;
    };
    alertXBreathsBeforeEnd: {
      value: number;
      sound: AssetNames;
      countDown: boolean;
      countDownSound: AssetNames;
    };
  };
  BreathRetention: {
    alertEveryXSeconds: {
      value: number;
      sound: AssetNames;
    };
    alertXSecondsBeforeEnd: {
      value: number;
      sound: AssetNames;
      countDown: boolean;
      countDownSound: AssetNames;
    };
  };
  RecoveryBreath: {
    alertBreathInPause: {
      sound: AssetNames;
    };
    alertEveryXSeconds: {
      value: number;
      sound: AssetNames;
    };
    alertXSecondsBeforeEnd: {
      value: number;
      sound: AssetNames;
      countDown: boolean;
      countDownSound: AssetNames;
    };
    alertBreathOutPause: {
      sound: AssetNames;
    };
  };
};

// export type AssetNames =
//   | "gong"
//   | "churchBell"
//   | "breathInMark"
//   | "breathOutMark"
//   | "airplaneDing"
//   | "elevatorDing";

// export type AlertSounds = {
//   [assetName in AssetNames]: Asset;
// };
