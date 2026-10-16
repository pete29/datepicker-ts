import { addDays, subtractDays } from "./days";
import { compareDates, isAfter, isBefore } from "./compare";
import { isDateDisabled } from "./constraints";
import type { SearchDirection } from "./keyboard-types";
import type { DateConstraints } from "./selection-types";
import type { CalendarDate } from "./types";

/**
 * Safety cap on the number of steps taken when the search direction has no
 * bound (no max for forward, no min for backward). It prevents an endless
 * loop when every date in that direction is disabled.
 */
const MAX_UNBOUNDED_STEPS = 366 * 1000;

/**
 * Returns true when the date lies beyond the bound in the given direction,
 * i.e. after max when searching forward, before min when searching backward.
 */
function isPastBound(
  date: CalendarDate,
  direction: SearchDirection,
  constraints: DateConstraints,
): boolean {
  const { min, max } = constraints;
  if (direction === "forward") {
    return max !== undefined && isAfter(date, max);
  }
  return min !== undefined && isBefore(date, min);
}

/**
 * Finds the nearest enabled date, starting at `start` and moving one day at a
 * time in `direction`. If `start` is enabled it is returned as is.
 *
 * Starting points outside the min/max range are handled consistently:
 * - Before min, searching forward: the search begins at min.
 * - After max, searching backward: the search begins at max.
 * - Before min searching backward, or after max searching forward: the search
 *   has already passed the bound, so null is returned.
 *
 * Returns null when the search passes the min/max bound or no enabled date is
 * found. This function is pure and never mutates its inputs.
 */
export function findNearestEnabledDate(
  start: CalendarDate,
  direction: SearchDirection,
  constraints: DateConstraints = {},
): CalendarDate | null {
  const { min, max } = constraints;

  let current: CalendarDate = start;

  if (min !== undefined && compareDates(current, min) < 0) {
    if (direction === "backward") {
      return null;
    }
    current = min;
  } else if (max !== undefined && compareDates(current, max) > 0) {
    if (direction === "forward") {
      return null;
    }
    current = max;
  }

  const bounded = direction === "forward" ? max !== undefined : min !== undefined;
  let steps = 0;

  for (;;) {
    if (!isDateDisabled(current, constraints)) {
      return current;
    }

    if (!bounded) {
      steps += 1;
      if (steps > MAX_UNBOUNDED_STEPS) {
        return null;
      }
    }

    let next: CalendarDate;
    try {
      next =
        direction === "forward" ? addDays(current, 1) : subtractDays(current, 1);
    } catch {
      // The representable date range has been exhausted.
      return null;
    }

    if (isPastBound(next, direction, constraints)) {
      return null;
    }

    current = next;
  }
}