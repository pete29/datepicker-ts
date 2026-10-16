import { isDateDisabled } from "./constraints";
import type { DateConstraints, SingleSelectionState } from "./selection-types";
import type { CalendarDate } from "./types";

/**
 * Selects a single date, replacing any earlier selection.
 * Returns the input state unchanged (same reference) when the date is
 * disabled under the given constraints. The input state is never mutated.
 */
export function selectSingle(
  state: SingleSelectionState,
  date: CalendarDate,
  constraints?: DateConstraints,
): SingleSelectionState {
  if (isDateDisabled(date, constraints)) {
    return state;
  }

  return { selected: date };
}