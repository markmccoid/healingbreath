import { BreathRoundsDetail, BreathRoundsDetailForInput } from "../../machines/breathMachine";
import { StoredSession } from "../../store/useStore";
import { defaultSessionSettings } from "../../store/defaultSettings";

import uuid from "react-native-uuid";
import _values from "lodash/values";
import { AlertSoundNames } from "../../utils/sounds/soundTypes";
import { AlertSettings } from "../../utils/alertTypes";
import { extendWith } from "lodash";
import { convertKeyValsToNumber } from "../../utils/helpers";

//-- -- -- -- -- -- -- -- --
//- In Typescript, take one type and covert
//- all keys that are numbers to strings
//- might be useful in reusing types for inputs if they
//- are number, but for inputs need to be strings.
//-- -- -- -- -- -- -- -- --
/*
type InputToString<Type> = {
  [Property in keyof Type]: Type[Property] extends number ? string : Type[Property];
};
type Init = {
  breathReps: number,
  breathRounds: number,
  name: string,
  breathDetails: { a: string, b: string }
}
type InputValues = InputToString<Init>
*/

export type BreathSessionValues = {
  includeAlerts: boolean;
  name: string;
  breathRounds: string;
  breathReps: string;
  defaultHoldTime: string;
  recoveryHoldTime: string;
  retentionHoldTimes: BreathRoundsArray;
  inhaleTime: string;
  exhaleTime: string;
  pauseTime: string;
  actionPauseTimeIn: string;
  actionPauseTimeOut: string;
  // Maybe all alert stuff here too
  alerts?: {
    ConsciousForcedBreathing?: {
      alertEveryXBreaths?: {
        value: string;
        sound: AlertSoundNames | undefined;
      };
      alertXBreathsBeforeEnd?: {
        value: string;
        sound: AlertSoundNames | undefined;
        countDown: boolean;
        countDownSound: AlertSoundNames | undefined;
      };
    };
    BreathRetention?: {
      alertEveryXSeconds?: {
        value: string;
        sound: AlertSoundNames | undefined;
      };
      alertXSecondsBeforeEnd?: {
        value: string;
        sound: AlertSoundNames | undefined;
        countDown: boolean;
        countDownSound: AlertSoundNames | undefined;
      };
    };
    RecoveryBreath?: {
      alertBreathInPause?: {
        sound: AlertSoundNames | undefined;
      };
      alertEveryXSeconds?: {
        value: string;
        sound: AlertSoundNames | undefined;
      };
      alertXSecondsBeforeEnd?: {
        value: string;
        sound: AlertSoundNames | undefined;
        countDown: boolean;
        countDownSound: AlertSoundNames | undefined;
      };
      alertBreathOutPause?: {
        sound: AlertSoundNames | undefined;
      };
    };
  };
};

export const initialValues: BreathSessionValues = {
  includeAlerts: false,
  name: "",
  breathRounds: defaultSessionSettings.breathRounds.toString(),
  breathReps: defaultSessionSettings.breathReps.toString(),
  defaultHoldTime: defaultSessionSettings.defaultHoldTime.toString(),
  recoveryHoldTime: defaultSessionSettings.recoveryHoldTime.toString(),
  retentionHoldTimes: [] as BreathRoundsArray,
  // Advanced properties
  inhaleTime: defaultSessionSettings.inhaleTime.toString(),
  exhaleTime: defaultSessionSettings.exhaleTime.toString(),
  pauseTime: defaultSessionSettings.pauseTime.toString(),
  actionPauseTimeIn: defaultSessionSettings.actionPauseTimeIn.toString(),
  actionPauseTimeOut: defaultSessionSettings.actionPauseTimeOut.toString(),
  alerts: {
    ConsciousForcedBreathing: {
      alertEveryXBreaths: {
        value: "0",
        sound: undefined,
      },
      alertXBreathsBeforeEnd: {
        value: "0",
        sound: undefined,
        countDown: false,
        countDownSound: undefined,
      },
    },
    BreathRetention: {
      alertEveryXSeconds: {
        value: "0",
        sound: undefined,
      },
      alertXSecondsBeforeEnd: {
        value: "0",
        sound: undefined,
        countDown: false,
        countDownSound: undefined,
      },
    },
    RecoveryBreath: {
      alertEveryXSeconds: {
        value: "0",
        sound: undefined,
      },
      alertXSecondsBeforeEnd: {
        value: "0",
        sound: undefined,
        countDown: false,
        countDownSound: undefined,
      },
      alertBreathInPause: {
        sound: undefined,
      },
      alertBreathOutPause: {
        sound: undefined,
      },
    },
  },
};

//***** arrayToObject() *********************************** /
// Helper function to convert array to object
// with object key being index+1
export function arrayToObject<T>(arr: any[]): T | {} {
  const returnObject: T | {} = arr.reduce((final, el, index) => {
    return { ...final, [index + 1]: el };
  }, {});

  return returnObject;
}

/**
 * Used in Formik to return an array of holdTime object [ {holdTime: string} ]
 * to be used in the input form.
 * Formik expects an Array and we use an object (BreathRoundsDetail type)
 * This
 * @param breathRounds
 * @param defaultHoldTime
 * @param currentBreathRoundsDetailArr
 * @returns
 */
export type BreathRoundsArray = {
  holdTime: string;
}[];

//***** createRetentionFields() *********************************** /
export const createRetentionFields = (
  breathRounds: string,
  defaultHoldTime: string,
  currentBreathRoundsDetailArr: BreathRoundsArray
): { holdTime: string }[] => {
  const initArray = (_, index: number) => index + 1;
  // Create an array of breath round numbers [1,2,3]
  const breathRoundsArray = Array.from({ length: parseInt(breathRounds) }, initArray);
  // use array of breath rounds to get a default breathRoundsDetail object
  const breathRoundsDefault: BreathRoundsDetailForInput = breathRoundsArray.reduce(
    (final, el) => {
      return { ...final, [el]: { holdTime: defaultHoldTime } };
    },
    {}
  );

  // Convert currentBreathRoundsDetailArr array to object so that
  // we can merge it with the defaults
  const currentBreathRoundsDetail: BreathRoundsDetailForInput =
    arrayToObject<BreathRoundsDetailForInput>(currentBreathRoundsDetailArr);
  // Merge the default object with fields defined by user
  const finalBreathRoundsDetail: BreathRoundsDetailForInput = Object.keys(
    breathRoundsDefault
  ).reduce((final, key) => {
    const next = currentBreathRoundsDetail?.[key] || breathRoundsDefault[key];
    return { ...final, [key]: next };
  }, {});
  // convert back to an Array that Formik likes and return
  return _values(finalBreathRoundsDetail);
};

//***** prepareSubmit() *********************************** /
export const prepareSubmit = (values: BreathSessionValues): StoredSession => {
  // console.log("values", values);
  // Build retention hold times
  // console.log(arrayToObject(values.retentionHoldTimes));

  const holdSession = convertKeyValsToNumber(values, [], true);

  const { retentionHoldTimes, alerts, includeAlerts, ...restOfSessionValues } = holdSession;

  const inputValuesFormatted: StoredSession = {
    id: uuid.v4() as string,
    ...restOfSessionValues,
    breathRoundsDetail: arrayToObject<BreathRoundsDetail>(retentionHoldTimes),
    alertSettings: alerts,
  };
  console.log("INPUTFORMATTEd", inputValuesFormatted);
  //--------- ALERTS
  // console.log("Alert settings", values.alerts);
  // const newAlerts: AlertSettings = { ...values.alerts };
  // newAlerts.ConsciousForcedBreathing.alertEveryXBreaths.value = parseInt(
  //   newAlerts.ConsciousForcedBreathing?.alertEveryXBreaths?.value
  // );
  // console.log("NEW", newAlerts);
  //----------------------------
  //! Not sure if I need to spread the defaultSessionSetting since I'm doing that when setting up session in formik
  const newSessionValues = { ...defaultSessionSettings, ...inputValuesFormatted };
  return newSessionValues;
};
