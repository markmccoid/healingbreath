import React, { createContext, useState } from "react";
import { useInterpret } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import { breathMachine, BreathContext } from "../machines/breathMachine";

import _, { isEqual } from "lodash";

import { myListener, configureAlertListener } from "../utils/alertListener";
import { useStore } from "../store/useStore";
import { Alert } from "../utils/alertTypes";

interface BreathMachineContextType {
  breathStateService: ActorRefFrom<typeof breathMachine>;
  alert: Alert | undefined;
}

// Object compare for xstate's useSelectors compare function.
export const objCompare = (prevObj: any, nextObj: any) => isEqual(prevObj, nextObj);

export const BreathMachineContext = createContext({} as BreathMachineContextType);

//************************
//*- BreathMachineProvider
//************************
// Remove context items that we won't consider session settings
export type SessionSettingsType =
  | Partial<
      Omit<
        BreathContext,
        "extend" | "sessionStats" | "sessionComplete" | "elapsed" | "interval"
      >
    >
  | undefined;
// -- passed sessionSettings prop will allow for individual session settings
// -- to be applied when the machine provider is used and the machine is instantiated.
export const BreathMachineProvider = ({
  children,
  sessionSettings,
}: {
  children: any;
  sessionSettings?: SessionSettingsType | undefined;
}) => {
  const alertSettings = useStore((state) => state.getActiveAlertSettings());
  const [alert, setAlert] = useState<Alert>();
  const breathStateService = useInterpret(
    breathMachine,
    {
      context: { ...sessionSettings },
      // devTools: true,
    },
    (state) => myListener(state, setAlert)
  );
  //* Probably a better way to get Alert settings configured.
  //* maybe when get global state provider implemented
  React.useEffect(() => {
    configureAlertListener(alertSettings);
  }, []);

  return (
    <BreathMachineContext.Provider value={{ breathStateService, alert }}>
      {children}
    </BreathMachineContext.Provider>
  );
};

export const useBreathState = (): BreathMachineContextType => {
  return React.useContext(BreathMachineContext);
};

// //----
// // Selectors - Playing with these, but most needed
// // functionality can come from "useBreathMachineHooks"
// export const canExtendTimeSelector = (
//   state: State<
//     BreathContext,
//     BreathEvent,
//     any,
//     {
//       value: any;
//       context: BreathContext;
//     }
//   >
// ) => state.can("EXTEND_TOGGLE");
