import { parseDate, toDayNumber } from "./parse";
import type { CalendarDate } from "./types";

/** Optional inclusive bounds for clampDate. */
export interface ClampBounds {
  readonly min?: CalendarDate | string;
  readonly max?: CalendarDate | string;
}

/**
 * Compares two calendar dates.
 * Returns -1 when a is before b, 1 when a is after b, and 0 when equal.
 * Throws InvalidDateError when either input is not a valid date.
 */
export function compareDates(
  a: CalendarDate | string,
  b: CalendarDate | string,
): -1 | 0 | 1 {
  const left = toDayNumber(parseDate(a));
  const right = toDayNumber(parseDate(b));
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

/** True when a is strictly earlier than b. */
export function isBefore(
  a: CalendarDate | string,
  b: CalendarDate | string,
): boolean {
  return compareDates(a, b) < 0;
}

/** True when a is strictly later than b. */
export function isAfter(
  a: CalendarDate | string,
  b: CalendarDate | string,
): boolean {
  return compareDates(a, b) > 0;
}

/** True when a and b are the same calendar date. */
export function isEqual(
  a: CalendarDate | string,
  b: CalendarDate | string,
): boolean {
  return compareDates(a, b) === 0;
}

/**
 * Limits a date to the given inclusive bounds. Either bound may be omitted.
 * Throws InvalidDateError when any provided input is invalid, and a
 * RangeError when min is after max.
 */
export function clampDate(
  date: CalendarDate | string,
  bounds: ClampBounds = {},
): CalendarDate {
  const parsed = parseDate(date);
  const min = bounds.min !== undefined ? parseDate(bounds.min) : undefined;
  const max = bounds.max !== undefined ? parseDate(bounds.max) : undefined;

  if (min !== undefined && max !== undefined) {
    if (toDayNumber(min) > toDayNumber(max)) {
      throw new RangeError(
        `Invalid clamp bounds: min (${String(min)}) is after max (${String(max)})`,
      );
    }
  }

  const value = toDayNumber(parsed);
  if (min !== undefined && value < toDayNumber(min)) {
    return min;
  }
  if (max !== undefined && value > toDayNumber(max)) {
    return max;
  }
  return parsed;
}