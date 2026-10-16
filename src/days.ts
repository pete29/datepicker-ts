import { fromDayNumber, toDayNumber } from "./parse";
import type { CalendarDate } from "./types";

function assertWholeDays(n: number): void {
  if (typeof n !== "number" || !Number.isInteger(n)) {
    throw new RangeError(`Day offset must be a whole number, received ${String(n)}`);
  }
}

/**
 * Returns the calendar date that is `n` days after `date`.
 * Negative values move backwards. Works across month, year and leap-year boundaries.
 */
export function addDays(date: CalendarDate, n: number): CalendarDate {
  assertWholeDays(n);
  return fromDayNumber(toDayNumber(date) + n);
}

/**
 * Returns the calendar date that is `n` days before `date`.
 * Negative values move forwards.
 */
export function subtractDays(date: CalendarDate, n: number): CalendarDate {
  assertWholeDays(n);
  return fromDayNumber(toDayNumber(date) - n);
}

/**
 * Returns the signed number of whole days from `a` to `b` (b - a).
 * The result is positive when `b` is later than `a`, negative when earlier,
 * and zero when both are the same date.
 */
export function daysBetween(a: CalendarDate, b: CalendarDate): number {
  return toDayNumber(b) - toDayNumber(a);
}