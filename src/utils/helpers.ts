import { BreathRoundsDetail } from "../machines/breathMachine";
/**
 * returns an array with the formatted times of each rounds retention
 * breath hold:
 * [ '0:50', '1:09', '1:30', '1:30' ]
 * @param breathRounds
 * @param defaultHoldTime
 * @param breathRoundsDetail
 * @returns string[]
 */
export const formattedRetentionTimes = (
  breathRounds: number | undefined,
  defaultHoldTime: number | undefined,
  breathRoundsDetail: BreathRoundsDetail | undefined
): string[] | undefined => {
  // To satisfy typescript
  if (!breathRounds || !defaultHoldTime || !breathRoundsDetail) return undefined;

  let roundDetail = Object.keys(breathRoundsDetail).map((key) => {
    return `${convertSecondsToMinutes(breathRoundsDetail[key].holdTime)}`;
  });

  const defaultLoader = () => `${convertSecondsToMinutes(defaultHoldTime)}`;
  const length = breathRounds - roundDetail.length;

  if (roundDetail.length < breathRounds) {
    roundDetail = [...roundDetail, ...Array.from({ length: length }, defaultLoader)];
  }

  return roundDetail;
};

/**
 * Takes seconds in and returns a formatted string:
 * min:sec
 * 1:30
 * 12:15
 * NOTE: there are no hours, so if minutes go over 60, they go over 60
 * @param secondsIn
 * @param padMinutes - determines if you want minutes padded with zero
 * @returns
 */
function convertSecondsToMinutes(secondsIn: number, padMinutes: boolean = false) {
  const seconds = (Math.trunc(secondsIn) % 60).toString();
  const minutes = Math.trunc(secondsIn / 60).toString();
  //
  return `${padMinutes ? minutes.padStart(2, "0") : minutes}:${seconds.padStart(2, "0")}`;
}

// Function to determine if parameter is object or not
const isObject = (obj: any): boolean => typeof obj === "object" && !Array.isArray(obj);

function recurseObjForKey(obj: any, keyToFind: string, result: any[]): any[] {
  // Loop through each key of obj passed.
  // if the key contains an object recurse passing the value at the key
  // the keyToFind and the result.
  Object.keys(obj).forEach((key) => {
    if (isObject(obj[key])) {
      // console.log('recurse result', result)
      result = recurseObjForKey(obj[key], keyToFind, result);
    } else if (key === keyToFind) {
      // If we find a key we are looking for, add it to the result array
      // But if it is an array flatten in result
      if (Array.isArray(obj[key])) {
        result = [...obj[key], ...result];
      } else {
        result = [obj[key], ...result];
      }
      // console.log('result', result, obj[key])
    }
  });
  return result;
}

// Pass in an object and a key whose values you want returned.
// You wil get an array back with the values.
export function findKeyValuesInObject(
  obj: any,
  keyValuesToReturn: string,
  makeUnique: boolean = true
): any[] {
  const values = recurseObjForKey(obj, keyValuesToReturn, []);
  if (makeUnique) {
    const valuesSet = new Set(values);
    return Array.from(valuesSet);
  }

  return values;
}
