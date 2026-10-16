import type { CalendarDate, Clock } from "./types";
import type {
  DateConstraints,
  RangeSelectionState,
  SingleSelectionState,
} from "./selection-types";

/**
 * A single cell in the month grid.
 */
export interface MonthGridDay {
  /** The calendar date this cell represents. */
  readonly date: CalendarDate;
  /** True when the date belongs to the month being displayed. */
  readonly isInMonth: boolean;
  /** True when the date equals the clock's current date. */
  readonly isToday: boolean;
  /** True when the date is selected, or lies within the selected range. */
  readonly isSelected: boolean;
  /** True when the date is disabled by the supplied constraints. */
  readonly isDisabled: boolean;
}

/**
 * One week of the month grid: exactly 7 days, Monday first.
 */
export type MonthGridWeek = [
  MonthGridDay,
  MonthGridDay,
  MonthGridDay,
  MonthGridDay,
  MonthGridDay,
  MonthGridDay,
  MonthGridDay,
];

/**
 * Options for building a month grid.
 */
export interface MonthGridOptions {
  /** The full year, e.g. 2024. */
  readonly year: number;
  /** The month number, 1 (January) through 12 (December). */
  readonly month: number;
  /** Source of the current date, used to compute isToday. */
  readonly clock: Clock;
  /** Optional selection state, in single or range mode. */
  readonly selection?: SingleSelectionState | RangeSelectionState;
  /** Optional constraints used to compute isDisabled. */
  readonly constraints?: DateConstraints;
}

/**
 * Builds the grid of weeks (Monday first) covering the requested month.
 */
export declare function getMonthGrid(options: MonthGridOptions): MonthGridWeek[];