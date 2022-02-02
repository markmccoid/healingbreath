import { AlertSettings, AlertSounds } from "../utils/alertTypes";

export const defaultAlertSettings: AlertSettings = {
  ConsciousForcedBreathing: {
    alertEveryXBreaths: {
      value: 3,
      sound: "gong",
    },
    alertXBreathsBeforeEnd: {
      value: 1,
      sound: "gong",
      countDown: false,
      countDownSound: "gong",
    },
  },
  BreathRetention: {
    alertEveryXSeconds: {
      value: 5,
      sound: "gong",
    },
    alertXSecondsBeforeEnd: {
      value: 2,
      sound: "airplaneDing",
      countDown: true,
      countDownSound: "elevatorDing",
    },
  },
  RecoveryBreath: {
    alertBreathInPause: {
      sound: "breathInMark",
    },
    alertEveryXSeconds: {
      value: 0,
      sound: "gong",
    },
    alertXSecondsBeforeEnd: {
      value: 4,
      sound: "gong",
      countDown: false,
      countDownSound: "gong",
    },
    alertBreathOutPause: {
      sound: "breathOutMark",
    },
  },
};
