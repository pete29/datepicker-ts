import type { CalendarDate } from "./types.js";
import { InvalidDateError } from "./errors.js";
import { getLocale } from "./locale-registry.js";
import { daysInMonth, isValidDate } from "./parse.js";

/**
 * Width of the names returned by getMonthNames and getWeekdayNames.
 */
type NameWidth = "full" | "short";

/**
 * Returns the full, human-readable form of a date in the given locale.
 *
 * @throws UnsupportedLocaleError when `localeCode` is not supported.
 * @throws InvalidDateError when `date` is not a real calendar date.
 */
export function formatFullDate(date: CalendarDate, localeCode: string): string {
  const locale = getLocale(localeCode);
  if (!isValidDate(date)) {
    throw new InvalidDateError(date);
  }
  return locale.formatDate(date);
}

/**
 * Returns the heading for a month (for example "March 2024") in the given
 * locale. `month` is 1-12.
 *
 * @throws UnsupportedLocaleError when `localeCode` is not supported.
 * @throws InvalidDateError when `year` or `month` is not a valid value.
 */
export function formatMonthHeading(
  year: number,
  month: number,
  localeCode: string,
): string {
  const locale = getLocale(localeCode);
  // daysInMonth throws InvalidDateError for a non-integer year or an
  // out-of-range month.
  daysInMonth(year, month);
  return locale.formatMonthHeading(year, month);
}

/**
 * Returns the locale's month names, January first.
 *
 * @throws UnsupportedLocaleError when `localeCode` is not supported.
 */
export function getMonthNames(
  localeCode: string,
  width: NameWidth = "full",
): readonly string[] {
  const locale = getLocale(localeCode);
  // The locale exposes a single list of month names, used for both widths.
  void width;
  return [...locale.monthNames];
}

/**
 * Returns the locale's weekday names in the locale's own order.
 *
 * @throws UnsupportedLocaleError when `localeCode` is not supported.
 */
export function getWeekdayNames(
  localeCode: string,
  width: NameWidth = "full",
): readonly string[] {
  const locale = getLocale(localeCode);
  return width === "short"
    ? [...locale.shortWeekdayNames]
    : [...locale.fullWeekdayNames];
}