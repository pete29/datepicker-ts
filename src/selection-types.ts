import type { CalendarDate } from "./types";

/**
 * How dates are selected: a single date, or a range with a start and an end.
 */
export type SelectionMode = "single" | "range";

/**
 * Selection state for single mode: one selected date, or null when empty.
 */
export interface SingleSelectionState {
  readonly selected: CalendarDate | null;
}

/**
 * Selection state for range mode. Each boundary is a date or null.
 */
export interface RangeSelectionState {
  readonly start: CalendarDate | null;
  readonly end: CalendarDate | null;
}

/**
 * Dates that cannot be selected: either an explicit readonly list of dates
 * or a predicate that returns true when the given date is disabled.
 */
export type DisabledDates =
  | readonly CalendarDate[]
  | ((date: CalendarDate) => boolean);

/**
 * Constraints restricting which dates may be selected.
 */
export interface DateConstraints {
  readonly min?: CalendarDate;
  readonly max?: CalendarDate;
  readonly disabled?: DisabledDates;
}

/**
 * Returns a fresh, empty single selection state.
 */
export function createEmptySingleSelection(): SingleSelectionState {
  return { selected: null };
}

/**
 * Returns a fresh, empty range selection state.
 */
export function createEmptyRangeSelection(): RangeSelectionState {
  return { start: null, end: null };
}