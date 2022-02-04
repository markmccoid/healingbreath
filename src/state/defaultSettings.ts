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
      sound: "ding",
    },
    alertXSecondsBeforeEnd: {
      value: 5,
      sound: "airplaneDing",
      countDown: true,
      countDownSound: "tick",
    },
  },
  RecoveryBreath: {
    alertBreathInPause: {
      sound: "breathInMark",
    },
    alertEveryXSeconds: {
      value: 5,
      sound: "ding",
    },
    alertXSecondsBeforeEnd: {
      value: 4,
      sound: "ding",
      countDown: false,
      countDownSound: "gong",
    },
    alertBreathOutPause: {
      sound: "breathOutMark",
    },
  },
};
