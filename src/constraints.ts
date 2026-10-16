import { isAfter, isBefore, isEqual } from "./compare";
import type { DateConstraints } from "./selection-types";
import type { CalendarDate } from "./types";

/**
 * Reports whether a date is disabled under the given constraints.
 * A date is disabled when it is before min, after max, listed in the
 * disabled array, or the disabled predicate returns true for it.
 * Missing constraints impose no restriction. This function is pure.
 */
export function isDateDisabled(
  date: CalendarDate,
  constraints: DateConstraints = {},
): boolean {
  const { min, max, disabled } = constraints;

  if (min !== undefined && isBefore(date, min)) {
    return true;
  }

  if (max !== undefined && isAfter(date, max)) {
    return true;
  }

  if (disabled !== undefined) {
    if (typeof disabled === "function") {
      return disabled(date) === true;
    }
    for (const entry of disabled) {
      if (isEqual(date, entry)) {
        return true;
      }
    }
  }

  return false;
}