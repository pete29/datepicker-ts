import { compareDates } from "./compare";
import { isDateDisabled } from "./constraints";
import type {
  DateConstraints,
  RangeSelectionState,
} from "./selection-types";
import type { CalendarDate } from "./types";

/**
 * Selects a date in range mode and returns a new state.
 *
 * - A disabled date returns the input state unchanged.
 * - With no start, or with both start and end set, the date begins a new
 *   range: start is the date and end is null.
 * - With a start but no end, the date becomes the end. If it is earlier than
 *   the start, the two are swapped so that start <= end.
 *
 * The input state is never mutated.
 */
export function selectRange(
  state: RangeSelectionState,
  date: CalendarDate,
  constraints?: DateConstraints,
): RangeSelectionState {
  if (constraints !== undefined && isDateDisabled(date, constraints)) {
    return state;
  }

  const { start, end } = state;

  if (start === null || end !== null) {
    return { start: date, end: null };
  }

  if (compareDates(date, start) < 0) {
    return { start: date, end: start };
  }

  return { start, end: date };
}