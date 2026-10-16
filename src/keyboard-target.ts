import type { CalendarDate } from "./types";
import type { NavigationKey, SearchDirection } from "./keyboard-types";
import { addDays, subtractDays } from "./days";
import { addMonths, subtractMonths } from "./months";
import { startOfWeek } from "./weekday";

/**
 * The raw (unconstrained) result of applying a navigation key to a date.
 */
export interface KeyboardTarget {
  readonly target: CalendarDate;
  readonly direction: SearchDirection;
}

/**
 * Computes the unconstrained target date for a navigation key together with
 * the direction in which to search for the nearest enabled date.
 *
 * - ArrowLeft / ArrowRight: -1 / +1 day
 * - ArrowUp / ArrowDown: -7 / +7 days
 * - PageUp / PageDown: -1 / +1 month (day clamped to the target month's length)
 * - Home: Monday of the focused week
 * - End: Sunday of the focused week (6 days after that Monday)
 *
 * Pure: the input is never mutated.
 */
export function getKeyboardTarget(
  focused: CalendarDate,
  key: NavigationKey,
): KeyboardTarget {
  switch (key) {
    case "ArrowLeft":
      return { target: subtractDays(focused, 1), direction: "backward" };
    case "ArrowRight":
      return { target: addDays(focused, 1), direction: "forward" };
    case "ArrowUp":
      return { target: subtractDays(focused, 7), direction: "backward" };
    case "ArrowDown":
      return { target: addDays(focused, 7), direction: "forward" };
    case "PageUp":
      return { target: subtractMonths(focused, 1), direction: "backward" };
    case "PageDown":
      return { target: addMonths(focused, 1), direction: "forward" };
    case "Home":
      return { target: startOfWeek(focused), direction: "backward" };
    case "End":
      return {
        target: addDays(startOfWeek(focused), 6),
        direction: "forward",
      };
    default: {
      const unreachable: never = key;
      throw new RangeError(`Unsupported navigation key: ${String(unreachable)}`);
    }
  }
}