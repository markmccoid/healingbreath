import { createMachine, assign, send } from "xstate";
// import { send } from 'xstate/lib/actionTypes';
type XCallBack = (arg: string) => void;
type XContext = {
  inhaleTime: number; // seconds and tenths of a second
  pauseTime: number;
  exhaleTime: number;
  //---------------
  breathReps: number; // How many breaths before hold time.
  breathCurrRep: number; // Current breath in current round
  //---------------
  holdTime: number; // hold time in seconds
  //---------------
  breathRounds: number; // Number of round (breathReps + Hold time)
  breathCurrRound: number; // Current round
  //---------------
  interval: number; // interval will cause TICK to be called every tenth of a sec. If you want more precision use .01
  elapsed: number;
};

const ticker = (ctx: XContext) => (cb: XCallBack) => {
  const interval = setInterval(() => {
    cb("TICK");
  }, ctx.interval * 1000);
  return () => {
    clearInterval(interval);
  };
};

const resetElapsed = assign({ elapsed: 0 });

const resetContext = assign({
  elapsed: 0,
  breathCurrRep: 0,
  breathCurrRound: 0,
});

const incrementBreathRound = assign({
  breathCurrRound: (ctx: XContext, event) =>
    event.type === "UNPAUSE" ? ctx.breathCurrRound : ctx.breathCurrRound + 1,
});

const resetBreathCurrRound = assign({
  breathCurrRound: 0,
});

const resetBreathCurrRep = assign({
  breathCurrRep: 0,
});

const incrementBreathRep = assign({
  breathCurrRep: (ctx: XContext, event) => ctx.breathCurrRep + 1,
});

const isElapsedGreaterThan = (checkAgainstTime: keyof XContext) => (ctx: XContext) =>
  ctx.elapsed > ctx[checkAgainstTime];

export const breathMachine = createMachine(
  {
    id: "breathmachine",
    initial: "idle",
    context: {
      inhaleTime: 2, // seconds and tenths of a second
      pauseTime: 0.5,
      exhaleTime: 1.5,
      //---------------
      breathReps: 3, // How many breaths before hold time.
      breathCurrRep: 0, // Current breath in current round
      //---------------
      holdTime: 5, // hold time in seconds
      //---------------
      breathRounds: 15, // Number of round (breathReps + Hold time)
      breathCurrRound: 0, // Current round
      //---------------
      interval: 0.1, // interval will cause TICK to be called every tenth of a sec. If you want more precision use .01
      elapsed: 0,
    },
    states: {
      idle: {
        entry: resetContext,
        on: {
          START: "breathing",
          UPDATE_DEFAULTS: "update",
        },
      },
      update: {
        entry: assign({
          breathReps: (ctx: XContext, event) => event.breathReps,
          breathRounds: (ctx: XContext, event) => event.breathRounds,
        }),
        always: {
          target: "idle",
        },
      },
      breathing: {
        id: "breathing",
        invoke: {
          id: "ticker", // only used for viz
          src: ticker,
        },
        entry: ["incrementBreathRound"],
        exit: (ctx) => console.log("EXIT breathing"),
        initial: "inhale",
        always: {
          target: "idle",
          actions: (ctx: XContext, event) =>
            console.log("breating Action Always Taken", event),
          cond: (ctx: XContext) => ctx.breathCurrRound > ctx.breathRounds,
        },
        on: {
          STOP: "idle",
          PAUSE: "paused",
          TICK: {
            actions: assign({
              elapsed: (ctx: XContext) => ctx.elapsed + ctx.interval,
            }),
          },
        },
        states: {
          inhale: {
            entry: ["resetElapsed", incrementBreathRep],
            always: [
              {
                target: "#breathmachine.holding",
                actions: [
                  (ctx: XContext, event) =>
                    console.log("transition to holding", ctx.breathCurrRep),
                ],
                cond: (ctx: XContext) => ctx.breathCurrRep > ctx.breathReps,
              },

              {
                target: "hold",
                cond: isElapsedGreaterThan("inhaleTime"),
              },
            ],
          },
          hold: {
            entry: "resetElapsed",
            always: {
              target: "exhale",
              cond: isElapsedGreaterThan("pauseTime"),
            },
          },
          exhale: {
            entry: "resetElapsed",
            always: {
              target: "inhale",
              cond: isElapsedGreaterThan("exhaleTime"),
            },
          },
          // paused: {
          //   on: {
          //     START: 'inhale',
          //   },
          // },
        },
      },
      holding: {
        entry: ["resetElapsed"],
        exit: resetBreathCurrRep,
        invoke: {
          id: "ticker-hold", // only used for viz
          src: ticker,
        },
        // exit: {
        //   actions: console.log(send('STOP')),
        //   cond: (ctx) => {
        //     console.log('Exit Holding', ctx.breathCurrRound, ctx.breathRounds);
        //     return ctx.breathCurrRound >= ctx.breathRounds;
        //   },
        // },
        always: {
          target: "breathing",
          actions: (ctx: XContext) => console.log("going back to breathing"),
          cond: isElapsedGreaterThan("holdTime"),
        },
        on: {
          STOP: "idle",
          NEXT: {
            target: "breathing",
            actions: "resetBreathCurrRep",
          },
          TICK: {
            actions: assign({
              elapsed: (ctx: XContext, event) => ctx.elapsed + ctx.interval,
            }),
          },
        },
      },
      //By having the paused event at this level,
      //every time we go back into the breathing state,
      //the breathing round is updated.
      paused: {
        on: {
          UNPAUSE: "breathing",
        },
      },
      finished: {},
    },
  },
  {
    actions: {
      incrementBreathRound,
      resetElapsed,
      resetBreathCurrRep,
    },
  }
);
