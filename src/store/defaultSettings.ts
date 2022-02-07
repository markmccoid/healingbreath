import { useDebugValue } from "react";
import { AlertSettings } from "../utils/alertTypes";

export const alertNoAlertSettings = {
  ConsciousForcedBreathing: undefined,
  BreathRetention: undefined,
  RecoveryBreath: undefined,
};
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

const testSession1 = {
  id: "sample001",
  name: "Short Testing Session",
  interval: 100,
  inhaleTime: 1.6 * 1000,
  exhaleTime: 1.6 * 1000,
  pauseTime: 0,
  breathReps: 5,
  breathRounds: 3,
  defaultHoldTime: 5 * 1000,
  recoveryHoldTime: 15 * 1000,
  actionPauseTimeIn: 3 * 1000,
  actionPauseTimeOut: 3 * 1000,
  breathRoundsDetail: {
    1: {
      holdTime: 12000,
    },
    2: {
      holdTime: 8000,
    },
  },
  alertSettings: {
    ConsciousForcedBreathing: {
      alertEveryXBreaths: {
        value: 2,
        sound: "gong",
      },
      alertXBreathsBeforeEnd: {
        value: 1,
        sound: "gong",
        countDown: false,
        countDownSound: "gong",
      },
    },
  },
};

const testSession2 = {
  id: "sample002",
  name: "Standard Sample Session",
  interval: 100,
  inhaleTime: 1.6 * 1000,
  exhaleTime: 1.6 * 1000,
  pauseTime: 0,
  breathReps: 15,
  breathRounds: 2,
  defaultHoldTime: 60 * 1000,
  recoveryHoldTime: 15 * 1000,
  actionPauseTimeIn: 3.5 * 1000,
  actionPauseTimeOut: 3 * 1000,
  breathRoundsDetail: {
    1: {
      holdTime: 60 * 1000,
    },
    2: {
      holdTime: 90 * 1000,
    },
  },
};

export const defaultSessions = [testSession1, testSession2];
