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
