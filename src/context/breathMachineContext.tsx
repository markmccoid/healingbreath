import React, { createContext, useState } from "react";
import { View, Text } from "react-native";
import { useInterpret } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import { breathMachine, BreathContext } from "../machines/breathMachine";

import _, { isEqual } from "lodash";

import { breathAlertListener, configureAlertListener } from "../utils/alertListener";
import { useStore } from "../store/useStore";
import { Alert } from "../utils/alertTypes";
// import { useAlertSounds } from "../utils/sounds/soundLibrary";
import { useAlertSounds } from "../hooks/useAlertSounds";

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
  // const getActiveAlertSettings = useStore((state) => state.getActiveAlertSettings);
  const [alertSettings, alertSoundNames] = useStore((state) => state.getActiveAlertSettings());

  const [alert, setAlert] = useState<Alert>();
  const breathStateService = useInterpret(
    breathMachine,
    {
      context: { ...sessionSettings },
      // devTools: true,
    },
    (state) => breathAlertListener(state, setAlert)
  );

  const { soundsLoaded, playSound } = useAlertSounds(alertSoundNames);

  //* Probably a better way to get Alert settings configured.
  //* maybe when get global state provider implemented
  React.useEffect(() => {
    console.log("USEEFFECT Config Alert listener", soundsLoaded);
    if (soundsLoaded) {
      configureAlertListener(alertSettings, playSound);
    }
    return () => console.log("exiting breath machine context");
  }, [soundsLoaded]);

  {
    !soundsLoaded && (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
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
