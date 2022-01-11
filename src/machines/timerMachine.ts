import { Machine, createMachine, assign, AssignAction } from "xstate";

export interface MultiStepTimerMachineContext {
  currentLoop: number;
  numberOfLoops: number;
}

export interface MultiStepTimerStates {
  states: {
    idle: {};
    firstStep: {};
    secondStep: {};
    thirdStep: {};
  };
}
export type MultiStepTimerMachineEvent = {
  type: "BEGIN";
};

const firstStepEnter: AssignAction<MultiStepTimerMachineContext, MultiStepTimerMachineEvent> =
  assign({
    currentLoop: (context, event) => {
      console.log("context", context);
      return context.currentLoop + 1;
    },
  });

const multiStepTimerMachine = Machine<
  MultiStepTimerMachineContext,
  MultiStepTimerStates,
  MultiStepTimerMachineEvent
>({
  id: "multiStepTimer",
  initial: "idle",
  context: {
    currentLoop: 0,
    numberOfLoops: 2,
  },
  states: {
    idle: {
      on: {
        BEGIN: {
          target: "firstStep",
        },
      },
    },
    firstStep: {
      entry: firstStepEnter,
      after: {
        3000: "secondStep",
      },
    },
    secondStep: {
      after: {
        3000: "thirdStep",
      },
    },
    thirdStep: {
      after: {
        3000: [
          {
            target: "firstStep",
            cond: (context, event) => {
              console.log(context);
              return context.currentLoop < context.numberOfLoops;
            },
          },
          { target: "idle" }, // reenter 'green' state
        ],
      },
    },
  },
});

export default multiStepTimerMachine;
