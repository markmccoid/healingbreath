import React, { createContext, useState } from "react";
import { useInterpret } from "@xstate/react";
import { ActorRefFrom, State } from "xstate";
import { breathMachine, BreathContext, BreathEvent } from "../machines/breathMachine";

import { isEqual } from "lodash";

import { myListener, configureSounds } from "../utils/alertListener";

interface BreathMachineContextType {
  breathStateService: ActorRefFrom<typeof breathMachine>;
  alert: string | undefined;
}

// Object compare for xstate's useSelectors compare function.
export const objCompare = (prevObj: any, nextObj: any) => isEqual(prevObj, nextObj);

export const BreathMachineContext = createContext({} as BreathMachineContextType);

//************************
//*- BreathMachineProvider
//************************
// Remove context items that we won't consider session settings
export type SessionSettingsType = Partial<
  Omit<BreathContext, "extend" | "sessionStats" | "sessionComplete" | "elapsed">
>;
// -- passed sessionSettings prop will allow for individual session settings
// -- to be applied when the machine provider is used and the machine is instantiated.
export const BreathMachineProvider = ({
  children,
  sessionSettings,
}: {
  children: any;
  sessionSettings?: SessionSettingsType | undefined;
}) => {
  const [alert, setAlert] = useState<string>();
  const breathStateService = useInterpret(
    breathMachine,
    {
      context: { ...sessionSettings },
      devTools: true,
    },
    (state) => myListener(state, setAlert)
  );
  React.useEffect(() => {
    configureSounds();
  }, []);
  // console.log("STATE SERVICE", breathStateService, breathMachine);
  return (
    <BreathMachineContext.Provider value={{ breathStateService, alert }}>
      {children}
    </BreathMachineContext.Provider>
  );
};

export const useBreathState = (): BreathMachineContextType => {
  return React.useContext(BreathMachineContext);
};

//----
// Selectors - Playing with these, but most needed
// functionality can come from "useBreathMachineHooks"
export const canExtendTimeSelector = (
  state: State<
    BreathContext,
    BreathEvent,
    any,
    {
      value: any;
      context: BreathContext;
    }
  >
) => state.can("EXTEND_TOGGLE");
