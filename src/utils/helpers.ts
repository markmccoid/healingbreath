import { BreathRoundsDetail } from "../machines/breathMachine";
import { cloneDeep } from "lodash";
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
export function convertSecondsToMinutes(secondsIn: number, padMinutes: boolean = false) {
  const seconds = (Math.trunc(secondsIn) % 60).toString();
  const minutes = Math.trunc(secondsIn / 60).toString();
  //
  return `${padMinutes ? minutes.padStart(2, "0") : minutes}:${seconds.padStart(2, "0")}`;
}

// Function to determine if parameter is object or not
const isObject = (obj: any): boolean => typeof obj === "object" && !Array.isArray(obj);

//****** Recursive functions below */
// Used in findKeyValuesInObject() function
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
// You will get an array back with the values.
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

//--------------------
// take an attrString "objKey1.objKey2..." and use
// it to return the value at the end of the string
export function getObjValueFromString(obj: any, attrString: string) {
  // if (!obj) return;
  var path = attrString.split(".");
  for (var i in path) {
    obj = obj?.[path[i]];
  }
  return obj;
}

//-----------------------------
//-- Take an Object and Keys array, option convertAll flag
//-- Recurse through object and change all matching
//-- keys and their values to a number, if NaN returned,
//-- the leave the value unchanged
//-- pass empty array and convertAll flag = true to convert
//-- all number like items to numbers
//-- Will also work for an array of objects (since an array is an object with key 0,1...)
//------------------------------
//!! NOTE: String fields that start with a number with a number but have text, will get the
//!! rest of the string truncated and return the number.
//!! ex: 9String will convert to just 9
//!!  Need to use some regex to see if any letters or special chars other than . and ,
export function convertKeyValsToNumberRecurse(
  obj: any,
  keysToChange: string[],
  convertAll: boolean = false
) {
  // Loop through each key of obj passed.
  // if the key contains an object recurse passing the value at the key
  // the keyToFind and the result.
  Object.keys(obj).forEach((key) => {
    // Deal with an Array
    if (Array.isArray(obj[key])) {
      for (let i = 0; obj[key].length > i; i++) {
        convertKeyValsToNumberRecurse(obj[key][i], keysToChange, convertAll);
      }
      return;
    }
    // If not an array, check if an object
    if (isObject(obj[key])) {
      return convertKeyValsToNumberRecurse(obj[key], keysToChange, convertAll);
    } else if (keysToChange.includes(key) || convertAll) {
      // If we find a key we are looking for
      // Try to convert to float, if fails don't change
      obj[key] = isNaN(parseFloat(obj[key])) ? obj[key] : parseFloat(obj[key]);
      return obj[key];
    }
  });
}

// Function to call to convert keys to number
export function convertKeyValsToNumber(
  obj: any,
  keysToChange: string[],
  convertAll: boolean = false
) {
  const newObj = cloneDeep(obj);
  convertKeyValsToNumberRecurse(newObj, keysToChange, convertAll);
  return newObj;
}

//-----------------------------
//-- Take an Object and Keys array, option convertAll flag
//-- Recurse through object and change all matching
//-- keys and their values to a string, if NaN returned,
//-- the leave the value unchanged, otherwise, we assume number and toString() it
//-- pass empty array and convertAll flag = true to convert
//-- Will also work for an array of objects (since an array is an object with key 0,1...)
//------------------------------
function convertKeyValsToStringRecurse(
  obj: any,
  keysToChange: string[],
  convertAll: boolean = false
) {
  // Loop through each key of obj passed.
  // if the key contains an object recurse passing the value at the key
  // the keyToFind and the result.
  Object.keys(obj).forEach((key) => {
    // Deal with an Array
    if (Array.isArray(obj[key])) {
      for (let i = 0; obj[key].length > i; i++) {
        convertKeyValsToStringRecurse(obj[key][i], keysToChange, convertAll);
      }
      return;
    }
    // If not an array, check if an object
    if (isObject(obj[key])) {
      return convertKeyValsToStringRecurse(obj[key], keysToChange, convertAll);
    } else if (keysToChange.includes(key) || convertAll) {
      // If we find a key we are looking for
      // Try to convert to float, if fails don't change
      obj[key] = isNaN(parseFloat(obj[key])) ? obj[key] : obj[key].toString();
      return obj[key];
    }
  });
}

export function convertKeyValsToString(
  obj: any,
  keysToChange: string[],
  convertAll: boolean = false
) {
  const newObj = cloneDeep(obj);
  convertKeyValsToStringRecurse(newObj, keysToChange, convertAll);
  return newObj;
}
