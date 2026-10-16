import type { CalendarDate } from "./types.js";

/**
 * Locale codes supported by the calendar.
 */
export type LocaleCode = "pl" | "en";

/**
 * Everything the calendar needs to present dates in a given language.
 */
export interface CalendarLocale {
  /** The code identifying this locale. */
  readonly code: LocaleCode;

  /**
   * The 12 month names in the nominative case, January first.
   */
  readonly monthNames: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  /**
   * The 7 full weekday names, Monday first.
   */
  readonly fullWeekdayNames: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  /**
   * The 7 short weekday names, Monday first.
   */
  readonly shortWeekdayNames: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  /**
   * Formats a date as a full, human-readable string.
   */
  formatDate(date: CalendarDate): string;

  /**
   * Formats the heading shown above a month grid.
   *
   * @param year The calendar year.
   * @param month The month number, 1 (January) through 12 (December).
   */
  formatMonthHeading(year: number, month: number): string;
}