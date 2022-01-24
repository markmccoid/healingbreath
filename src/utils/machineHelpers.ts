import { BreathContext } from "../machines/breathMachine";

// based on the passed breathMachine contex, will return the
// hold time for the current round
export function getCurrentRoundHoldTime(
  ctx: Pick<BreathContext, "breathRoundsDetail" | "breathCurrRound" | "defaultHoldTime">
): number {
  return ctx?.breathRoundsDetail?.[ctx.breathCurrRound]?.holdTime || ctx.defaultHoldTime;
}
