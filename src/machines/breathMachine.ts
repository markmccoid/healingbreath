import { createMachine, assign, Sender } from "xstate";
import { myTicker } from "../utils/timerAdjustingInterval";

// const tickerTimer = (ctx, cb) => {
//   new AdjustingInverval()
// }

export type BreathEvent =
  | { type: "TICK" }
  | { type: "START" }
  | { type: "STOP" }
  | { type: "PAUSE" }
  | { type: "UNPAUSE" }
  | { type: "EXTEND_TOGGLE" }
  | { type: "NEXT" }
  | {
      type: "UPDATE_DEFAULTS";
      sessionSettings: Partial<Omit<BreathContext, "extend" | "interval" | "elapsed">>;
    };

export type sessionStats =
  | {
      breaths: number;
      holdTimeSeconds: number;
      recoveryHoldTimeSeconds: number;
    }
  | {};

export type BreathRoundsDetail = {
  [breathRound: number]: {
    holdTime: number;
  };
};
export type BreathContext = {
  // -- Breathing pattern config
  inhaleTime: number; // milliseconds
  pauseTime: number; // milliseconds
  exhaleTime: number; // milliseconds
  //-- Breathing round config
  breathReps: number; // How many breaths before hold time.
  breathCurrRep: number; // Current breath in current round
  //-- Long hold config
  holdTime: number; // hold time in milliseconds
  defaultHoldTime: number; // default hold time
  breathRoundsDetail: BreathRoundsDetail; // Object that holds the details for each round.
  recoveryHoldTime: number; // recovery holding time in milliseconds
  actionPauseTimeIn: number; // milliseconds to "wait" before inhale holds
  actionPauseTimeOut: number; // milliseconds to "wait" after inhale holds
  extend: boolean; // When true, extend the hold time, don't stop the timer
  //-- Breathing session config
  breathRounds: number; // Number of rounds (breathReps + Long Hold + )
  breathCurrRound: number; // Current round
  // -- session statistics
  sessionStats: { [round: number]: sessionStats };
  sessionStart: number; // stores unix timestamp (milliseconds) using Date.now()
  sessionEnd: number; // stores unix timestamp (milliseconds) using Date.now()
  sessionComplete: boolean;
  //-- Timer config
  //-- Interval is in milliseconds
  interval: number; // interval will cause TICK to be called every x milliseconds.
  elapsedInt: number;
  elapsed: number;
};

const ticker = (ctx: BreathContext) => (cb: Sender<BreathEvent>) => {
  const timerId = myTicker(
    () => cb("TICK"),
    ctx.interval // * 1000 # intervalms
  );
  // When timer "done", stop the timer.
  return () => {
    // console.log("stop", timerId);
    clearTimeout(timerId);
  };
};

//--OLD Ticker code. Had issue with time slippage
// const ticker = (ctx) => (cb) => {
//   const intervalId = setInterval(() => {
//     cb("TICK");
//   }, ctx.interval * 1000);

//   return () => {
//     console.log("Clearing Interval");
//     clearInterval(intervalId);
//   };
// };

const updateElapsedTime = assign<BreathContext, BreathEvent>({
  // elapsedInt: (context) => context.elapsedInt + context.interval * 10,
  // elapsed: (context) => {
  //   return context.elapsedInt / 10;
  // },
  elapsed: (context) => {
    //# intervalms
    return context.elapsed + context.interval;
  },
});

const resetElapsed = assign<BreathContext, BreathEvent>({
  elapsedInt: 0,
  elapsed: 0,
});

const resetContext = assign<BreathContext, BreathEvent>({
  elapsedInt: 0,
  elapsed: 0,
  breathCurrRep: 0,
  breathCurrRound: 0,
});

const resetSessionStats = assign<BreathContext, BreathEvent>({
  sessionStats: undefined,
  sessionComplete: false,
});
const incrementBreathRound = assign<BreathContext, BreathEvent>({
  breathCurrRound: (ctx, event) => ctx.breathCurrRound + 1,
});

const resetBreathCurrRep = assign<BreathContext, BreathEvent>({
  breathCurrRep: 0,
});

const incrementBreathRep = assign<BreathContext, BreathEvent>({
  breathCurrRep: (ctx) => ctx.breathCurrRep + 1,
});

type TimeCheckItems =
  | "holdTime"
  | "recoveryHoldTime"
  | "inhaleTime"
  | "exhaleTime"
  | "pauseTime"
  | "actionPauseTimeIn"
  | "actionPauseTimeOut";

const isElapsedGreaterThan = (checkAgainstTime: TimeCheckItems) => (ctx: BreathContext) => {
  if (checkAgainstTime === "holdTime") {
    // main hold breath section can have different hold times for each round
    // If a round is not set, then it will default to the default hold time.
    return (
      ctx.elapsed >
      (ctx?.breathRoundsDetail?.[ctx.breathCurrRound]?.holdTime || ctx.defaultHoldTime)
    );
  }
  return ctx.elapsed > ctx[checkAgainstTime];
};
const extendToggle = assign<BreathContext, BreathEvent>({
  extend: (ctx) => !ctx.extend,
});

const updateSessionSettings = assign<BreathContext, BreathEvent>((ctx, event) => {
  // checking for type.  Only way to appease typescript
  if (event.type === "UPDATE_DEFAULTS") {
    // - decided to just merge the passed sessionSettings object with the context
    // - this way users can send one or more settings, prettty much affect any
    // - part of context that is needed.
    console.log("EVENT", event.sessionSettings);
    const mergedSettings = { ...ctx, ...event.sessionSettings };
    return mergedSettings;
    // return {
    //   breathReps: event.breathReps || ctx.breathReps,
    //   breathRounds: event.breathRounds || ctx.breathRounds,
    //   holdTime: event.holdTime || ctx.holdTime,
    // };
  }
});

const sessionComplete = assign<BreathContext, BreathEvent>({
  sessionComplete: true,
});

// Session stats helper.  Makes sure the breathCurrRound key exists
// merges passed updateObj into sessionStats
const updateSessionHelper = (ctx: BreathContext, updateObj: object) => {
  const tempState = ctx.sessionStats?.[ctx.breathCurrRound]
    ? { ...ctx.sessionStats?.[ctx.breathCurrRound] }
    : {};

  return {
    ...ctx.sessionStats,
    [ctx.breathCurrRound]: {
      ...tempState,
      ...updateObj,
    },
  };
};
// Session stats
// type sessionStats = {
//   [roundNum: number]: {
//     breaths: number;
//     longHoldSeconds: Number;
//     inhaleHoldSeconds: Number;
//   };
// }

const updateSessionStats = (type: "breaths" | "longhold" | "recoveryhold") =>
  assign<BreathContext, BreathEvent>({
    sessionStats: (ctx) => {
      if (ctx.breathCurrRound > ctx.breathRounds) {
        return ctx.sessionStats;
      }
      switch (type) {
        case "breaths":
          return updateSessionHelper(ctx, { breaths: ctx.breathCurrRep - 1 });
        case "longhold":
          return updateSessionHelper(ctx, {
            holdTimeSeconds: Math.floor(ctx.elapsed - ctx.interval),
          });
        case "recoveryhold":
          return updateSessionHelper(ctx, {
            recoveryHoldTimeSeconds: Math.floor(ctx.elapsed - ctx.interval),
          });
      }
    },
  });

// create functions that can be used in XStates options area
const updateSessionBreathsStats = updateSessionStats("breaths");
const updateSessionLongHoldStats = updateSessionStats("longhold");
const updateSessionRecoveryHoldStats = updateSessionStats("recoveryhold");

export const breathMachine = createMachine<BreathContext, BreathEvent>(
  {
    id: "breathmachine",
    initial: "idle",
    context: {
      // -- Breathing pattern config
      inhaleTime: 2000, // milliseconds
      pauseTime: 0,
      exhaleTime: 1500,
      //-- Breathing round config
      breathReps: 3, // How many breaths before hold time.
      breathCurrRep: 0, // Current breath in current round
      //-- Long hold config
      holdTime: 5000, // hold time in seconds
      defaultHoldTime: 5000,
      breathRoundsDetail: {},
      extend: false, // When true, extend the hold time, don't stop the timer
      recoveryHoldTime: 5000, // inhaled holding time in seconds
      actionPauseTimeIn: 3, // seconds to "wait" before inhale holds
      actionPauseTimeOut: 7, // seconds to "wait" after inhale holds
      //-- Breathing session config
      breathRounds: 15, // Number of rounds (breathReps + Long Hold + )
      breathCurrRound: 0, // Current round
      // -- session statistics
      sessionStats: {},
      sessionEnd: 0,
      sessionStart: 0,
      sessionComplete: false,
      //-- Timer config # intervalms
      interval: 100, // interval will cause TICK to be called every tenth of a sec. If you want more precision use .01
      elapsedInt: 0,
      elapsed: 0,
    },

    states: {
      idle: {
        entry: "resetContext",
        exit: "resetSessionStats",
        on: {
          START: {
            target: "breathing",
            actions: assign({ sessionStart: (ctx, event) => Date.now() }),
          },
          UPDATE_DEFAULTS: {
            actions: ["updateSessionSettings"],
          },
        },
      },
      breathing: {
        id: "breathing",
        entry: ["incrementBreathRound"],
        exit: ["updateSessionBreathsStats"],
        initial: "inhale",
        always: {
          target: "idle",
          actions: "sessionComplete",
          cond: (ctx) => ctx.breathCurrRound > ctx.breathRounds,
        },
        on: {
          STOP: "idle",
          PAUSE: ".paused",
          TICK: {
            actions: "updateElapsedTime",
          },
        },
        states: {
          inhale: {
            entry: ["resetElapsed", "incrementBreathRep"],
            invoke: {
              id: "ticker", // only used for viz
              src: ticker,
            },
            always: [
              {
                target: "#breathmachine.holding",
                cond: (ctx) => ctx.breathCurrRep > ctx.breathReps,
              },
              {
                // this condition is here so that we can SKIP the hold
                // state by setting the pauseTime to 0.
                target: "exhale",
                cond: (ctx) => isElapsedGreaterThan("inhaleTime")(ctx) && ctx.pauseTime === 0,
              },
              {
                target: "hold",
                cond: isElapsedGreaterThan("inhaleTime"),
              },
            ],
          },
          hold: {
            entry: "resetElapsed",
            invoke: {
              id: "ticker", // only used for viz
              src: ticker,
            },
            always: {
              target: "exhale",
              cond: isElapsedGreaterThan("pauseTime"),
            },
          },
          exhale: {
            entry: "resetElapsed",
            invoke: {
              id: "ticker", // only used for viz
              src: ticker,
            },
            always: {
              target: "inhale",
              cond: isElapsedGreaterThan("exhaleTime"),
            },
          },
          paused: {
            on: {
              UNPAUSE: "inhale",
            },
          },
        },
      },
      holding: {
        initial: "breathhold",
        entry: ["resetElapsed", "resetBreathCurrRep"],
        exit: ["updateSessionLongHoldStats"],
        on: {
          STOP: "idle",
          PAUSE: ".paused",
          NEXT: {
            target: "recoveryhold",
            // actions: 'resetBreathCurrRep',
          },
          EXTEND_TOGGLE: {
            actions: "extendToggle",
          },
          TICK: {
            actions: "updateElapsedTime",
          },
        },
        states: {
          breathhold: {
            invoke: {
              id: "ticker-hold", // only used for viz
              src: ticker,
            },
            always: {
              target: "#breathmachine.intropause",
              // actions: (ctx) => console.log("go to inhalehold"),
              cond: (ctx) => isElapsedGreaterThan("holdTime")(ctx) && !ctx.extend,
            },
          },
          paused: {
            // entry: (ctx) => clearInterval(ctx.intervalId),
            on: {
              UNPAUSE: "#breathmachine.holding",
            },
          },
        },
      },
      intropause: {
        entry: ["resetElapsed", () => console.log("intropause")],
        invoke: {
          id: "ticker-pause", // only used for viz
          src: ticker,
        },
        always: {
          target: "recoveryhold",
          cond: isElapsedGreaterThan("actionPauseTimeIn"),
        },
        on: {
          STOP: "idle",
          TICK: {
            actions: "updateElapsedTime",
          },
        },
      },
      recoveryhold: {
        entry: ["resetElapsed"],
        initial: "breathhold",
        exit: ["updateSessionRecoveryHoldStats", "resetBreathCurrRep"],
        on: {
          STOP: "idle",
          PAUSE: ".paused",
          NEXT: {
            target: "breathing",
            actions: "resetBreathCurrRep",
          },
          EXTEND_TOGGLE: {
            actions: "extendToggle",
          },
          TICK: {
            actions: "updateElapsedTime",
          },
        },
        states: {
          breathhold: {
            invoke: {
              id: "ticker-recoveryhold", // only used for viz
              src: ticker,
            },
            always: {
              target: "#breathmachine.outropause",
              cond: (ctx) => isElapsedGreaterThan("recoveryHoldTime")(ctx) && !ctx.extend,
            },
          },
          paused: {
            // entry: (ctx) => clearInterval(ctx.intervalId),
            on: {
              UNPAUSE: "#breathmachine.recoveryhold",
            },
          },
        },
      },
      outropause: {
        entry: ["resetElapsed", () => console.log("outropause")],
        invoke: {
          id: "ticker-outropause", // only used for viz
          src: ticker,
        },
        always: {
          target: "breathing",
          cond: isElapsedGreaterThan("actionPauseTimeOut"),
          actions: assign({ sessionEnd: (ctx, events) => Date.now() }),
        },
        on: {
          STOP: "idle",
          TICK: {
            actions: "updateElapsedTime",
          },
        },
      },
      finished: {},
    },
  },
  {
    actions: {
      incrementBreathRound,
      incrementBreathRep,
      resetElapsed,
      resetBreathCurrRep,
      resetSessionStats,
      resetContext,
      updateSessionSettings,
      updateSessionBreathsStats,
      updateSessionLongHoldStats,
      updateSessionRecoveryHoldStats,
      updateElapsedTime,
      //    updateLongHoldStats,
      //      updateRecoveryHoldStats,
      extendToggle,
      sessionComplete,
    },
  }
);
