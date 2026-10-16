import type { CalendarDate } from "./types";
import type {
  RangeSelectionState,
  SingleSelectionState,
} from "./selection-types";
import { isAfter, isBefore, isEqual } from "./compare";

/**
 * Reports whether a date is selected under the given selection state.
 * - No selection: false.
 * - Single mode: true only for the selected date.
 * - Range mode: true for every date from start to end inclusive; with only a
 *   start set, matches the start date alone. A range without a start matches
 *   nothing.
 *
 * Range states are expected to satisfy start <= end, which selectRange
 * guarantees.
 */
export function isDateSelected(
  date: CalendarDate | string,
  selection?: SingleSelectionState | RangeSelectionState | null,
): boolean {
  if (selection === undefined || selection === null) {
    return false;
  }

  if ("selected" in selection) {
    return selection.selected !== null && isEqual(date, selection.selected);
  }

  const { start, end } = selection;

  if (start === null) {
    return false;
  }
  if (end === null) {
    return isEqual(date, start);
  }

  return !isBefore(date, start) && !isAfter(date, end);
}