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
  | { type: "FINISHED" }
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
  // holdTime: number; // hold time in milliseconds
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
  elapsed: number; // milliseconds elapsed
  timeLeft: number; // milliseconds left -- only used by some states
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
  elapsed: (context) => {
    //# intervalms
    return context.elapsed + context.interval;
  },
  timeLeft: (context) => {
    return context.timeLeft - context.interval;
  },
});

const resetElapsed = assign<BreathContext, BreathEvent>({
  elapsed: 0,
});
const resetTimeLeft = assign<BreathContext, BreathEvent>({
  timeLeft: 0,
});

const resetContext = assign<BreathContext, BreathEvent>({
  elapsed: 0,
  timeLeft: 0,
  breathCurrRep: 0,
  breathCurrRound: 0,
});

const updateHoldingTimeLeft = (
  source: "holding" | "recoveryhold" | "breathing" | "intropause" | "outropause"
) =>
  assign<BreathContext, BreathEvent>((ctx, event) => {
    let timeLeft = 0;
    switch (source) {
      case "holding":
        // Use the context to get the round if we are "holding" or fallback to the defaultHoldTime
        return {
          timeLeft:
            ctx?.breathRoundsDetail?.[ctx.breathCurrRound]?.holdTime || ctx.defaultHoldTime,
        };
      case "recoveryhold":
        return { timeLeft: ctx.recoveryHoldTime };
      case "breathing":
        return {
          timeLeft: ctx.breathReps * (ctx.inhaleTime + ctx.exhaleTime + ctx.pauseTime + 200),
        };
      case "intropause":
        return {
          timeLeft: ctx.actionPauseTimeIn,
        };
      case "outropause":
        return {
          timeLeft: ctx.actionPauseTimeOut,
        };
      default:
        return {
          timeLeft,
        };
    }
  });
const resetSessionStats = assign<BreathContext, BreathEvent>({
  sessionStats: undefined,
  sessionComplete: false,
  sessionStart: 0,
  sessionEnd: 0,
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

const decrementBreathRep = assign<BreathContext, BreathEvent>({
  breathCurrRep: (ctx) => ctx.breathCurrRep - 1,
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
    // console.log("EVENT", event.sessionSettings);
    const mergedSettings = { ...ctx, ...event.sessionSettings };
    return mergedSettings;
    // return {
    //   breathReps: event.breathReps || ctx.breathReps,
    //   breathRounds: event.breathRounds || ctx.breathRounds,
    //   holdTime: event.holdTime || ctx.holdTime,
    // };
  }
});

const setSessionComplete = assign<BreathContext, BreathEvent>({
  sessionComplete: true,
  sessionEnd: Date.now(),
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
    sessionStats: (ctx, event) => {
      if (ctx.breathCurrRound > ctx.breathRounds) {
        return ctx.sessionStats;
      }
      switch (type) {
        case "breaths":
          // Because of how the breathCurrRep is updated, if next is pressed we don't subtract 1.
          // i.e. if next not initiated, then always check looks if breathcurrrep has gone past its limit
          // Probably a better way to do it, but my brain says nope!
          if (event.type === "NEXT") {
            return updateSessionHelper(ctx, { breaths: ctx.breathCurrRep });
          }
          return updateSessionHelper(ctx, { breaths: ctx.breathCurrRep - 1 });
        case "longhold":
          return updateSessionHelper(ctx, {
            holdTimeSeconds: Math.floor(ctx.elapsed - ctx.interval) / 1000,
          });
        case "recoveryhold":
          return updateSessionHelper(ctx, {
            recoveryHoldTimeSeconds: Math.floor(ctx.elapsed - ctx.interval) / 1000,
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
      // holdTime: 5000, // hold time in seconds
      defaultHoldTime: 5000,
      breathRoundsDetail: {},
      extend: false, // When true, extend the hold time, don't stop the timer
      recoveryHoldTime: 5000, // inhaled holding time in seconds
      actionPauseTimeIn: 3000, // seconds to "wait" before inhale holds
      actionPauseTimeOut: 7000, // seconds to "wait" after inhale holds
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
      elapsed: 0,
      timeLeft: 0,
    },

    states: {
      idle: {
        entry: "resetContext",
        on: {
          START: {
            target: "breathing",
            actions: assign({ sessionStart: (ctx, event) => Date.now() }),
          },
          UPDATE_DEFAULTS: {
            actions: ["updateSessionSettings"],
          },
          FINISHED: {
            target: "finished",
          },
        },
      },
      breathing: {
        id: "breathing",
        tags: "next.holding",
        entry: ["incrementBreathRound", updateHoldingTimeLeft("breathing")],
        exit: ["updateSessionBreathsStats"],
        initial: "inhale",
        always: {
          target: "idle",
          actions: "setSessionComplete",
          cond: (ctx) => ctx.breathCurrRound > ctx.breathRounds,
        },
        on: {
          STOP: "idle",
          PAUSE: {
            target: ".paused",
            actions: assign((ctx, event, meta) => {
              // if pause on "inhale", we lose rest of inhale time + pause + exhale time
              // if pause on "hold", we lose rest of pause + exhale time
              // if pause on "exhale", we lose rest of exhale time
              const offset = meta.state?.matches("breathing.inhale")
                ? ctx.inhaleTime + ctx.pauseTime + ctx.exhaleTime
                : meta.state?.matches("breathing.pause")
                ? ctx.pauseTime + ctx.exhaleTime
                : meta.state?.matches("breathing.exhale")
                ? ctx.exhaleTime
                : 0;
              const timeLeft = ctx.timeLeft - (offset - ctx.elapsed);
              return { timeLeft };
            }),
          },
          NEXT: {
            target: "holding",
            actions: ["incrementBreathRep"],
          },
          TICK: {
            actions: "updateElapsedTime",
          },
        },
        states: {
          inhale: {
            entry: ["resetElapsed", "incrementBreathRep"],
            // exit: assign((ctx, event, meta) => {
            //   console.log("meta state", meta.state.value);
            //   if (meta.state?.matches("breathing.paused")) {
            //     // const offset = ctx.inhaleTime;
            //     const offset = ctx.timeLeft - (ctx.inhaleTime - ctx.elapsed);
            //     console.log("offset", ctx.timeLeft, offset);
            //     return { timeLeft: offset };
            //   }
            //   return { timeLeft: ctx.timeLeft };
            // }),
            invoke: {
              id: "ticker", // only used for viz
              src: ticker,
            },
            always: [
              {
                // Check if current breath rep is > breaths supposed to take, if so transition
                target: "#breathmachine.holding",
                cond: (ctx) => ctx.breathCurrRep > ctx.breathReps,
                actions: "decrementBreathRep",
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
        tags: "next.recoveryhold",
        entry: [
          "resetElapsed",
          "resetTimeLeft",
          updateHoldingTimeLeft("holding"),
          // "resetBreathCurrRep",
        ],
        exit: ["updateSessionLongHoldStats"],
        on: {
          STOP: "idle",
          PAUSE: ".paused",
          NEXT: {
            target: "recoveryhold",
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
        entry: ["resetElapsed", updateHoldingTimeLeft("intropause")],
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
        initial: "breathhold",
        tags: "next.breathingreps",
        entry: ["resetElapsed", "resetTimeLeft", updateHoldingTimeLeft("recoveryhold")],
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
        entry: ["resetElapsed", updateHoldingTimeLeft("outropause")],
        invoke: {
          id: "ticker-outropause", // only used for viz
          src: ticker,
        },
        always: {
          target: "breathing",
          cond: isElapsedGreaterThan("actionPauseTimeOut"),
          // actions: assign({ sessionEnd: (ctx, events) => Date.now() }),
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
      decrementBreathRep,
      resetElapsed,
      resetTimeLeft,
      resetBreathCurrRep,
      resetSessionStats,
      resetContext,
      updateSessionSettings,
      updateSessionBreathsStats,
      updateSessionLongHoldStats,
      updateSessionRecoveryHoldStats,
      updateElapsedTime,
      // updateHoldingTimeLeft,
      //    updateLongHoldStats,
      //      updateRecoveryHoldStats,
      extendToggle,
      setSessionComplete,
    },
  }
);
