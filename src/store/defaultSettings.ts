import { useDebugValue } from "react";
import { AlertSettings } from "../utils/alertTypes";
import { StoredSession } from "./useStore";

export const defaultSessionSettings = {
  inhaleTime: 1.2,
  exhaleTime: 1.2,
  pauseTime: 0,
  breathReps: 30,
  breathRounds: 3,
  defaultHoldTime: 60,
  recoveryHoldTime: 15,
  actionPauseTimeIn: 3.5,
  actionPauseTimeOut: 6,
};

export const alertNoAlertSettings = {
  ConsciousForcedBreathing: undefined,
  BreathRetention: undefined,
  RecoveryBreath: undefined,
};
export const defaultAlertSettings: AlertSettings = {
  ConsciousForcedBreathing: {
    alertEveryXBreaths: {
      value: 10,
      sound: "gong",
    },
    alertXBreathsBeforeEnd: {
      value: 2,
      sound: "gong",
      countDown: false,
      countDownSound: "gong",
    },
  },
  BreathRetention: {
    alertEveryXSeconds: {
      value: 30,
      sound: "gong",
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
      value: 0,
      sound: "ding",
    },
    // could just leave this key off since it will not run
    alertXSecondsBeforeEnd: {
      value: 3, // zero means NO alert will be triggered
      sound: "ding",
      countDown: false,
      countDownSound: "gong",
    },
    alertBreathOutPause: {
      sound: "breathOutMark",
    },
  },
};

const testSession1: StoredSession = {
  id: "sample001",
  name: "Short Testing Session",
  inhaleTime: 1.6,
  exhaleTime: 1.6,
  pauseTime: 0,
  breathReps: 5,
  breathRounds: 3,
  defaultHoldTime: 5,
  recoveryHoldTime: 15,
  actionPauseTimeIn: 3,
  actionPauseTimeOut: 3,
  breathRoundsDetail: {
    1: {
      holdTime: 120,
    },
    2: {
      holdTime: 80,
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
  inhaleTime: 1.2,
  exhaleTime: 1.2,
  pauseTime: 0,
  breathReps: 35,
  breathRounds: 4,
  defaultHoldTime: 60,
  recoveryHoldTime: 15,
  actionPauseTimeIn: 3.5,
  actionPauseTimeOut: 3,
  breathRoundsDetail: {
    1: {
      holdTime: 90,
    },
    2: {
      holdTime: 120,
    },
    3: {
      holdTime: 150,
    },
    4: {
      holdTime: 180,
    },
  },
  alertSettings: defaultAlertSettings,
};

export const defaultSessions = [testSession1, testSession2];
