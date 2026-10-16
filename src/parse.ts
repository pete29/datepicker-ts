import { InvalidDateError } from "./errors";
import type { CalendarDate } from "./types";

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Days from 0000-03-01 to 1970-01-01 in the civil-from-days algorithm. */
const EPOCH_SHIFT = 719468;
const DAYS_PER_ERA = 146097;

const MIN_YEAR = 0;
const MAX_YEAR = 9999;

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

interface DateParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

/**
 * Gregorian leap-year rule: divisible by 4, except centuries not divisible by 400.
 */
export function isLeapYear(year: number): boolean {
  if (!Number.isInteger(year)) {
    return false;
  }
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Number of days in the given month (1-12) of the given year.
 * Throws InvalidDateError when the year or month is not a valid integer value.
 */
export function daysInMonth(year: number, month: number): number {
  if (!Number.isInteger(year)) {
    throw new InvalidDateError(year, `Invalid year: ${String(year)}`);
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new InvalidDateError(month, `Invalid month: ${String(month)}`);
  }
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  return MONTH_LENGTHS[month - 1] as number;
}

/**
 * Validates numeric year/month/day parts as a real calendar date.
 */
function validateParts(
  year: number,
  month: number,
  day: number,
): DateParts | null {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }
  if (year < MIN_YEAR || year > MAX_YEAR) {
    return null;
  }
  if (month < 1 || month > 12) {
    return null;
  }
  if (day < 1 || day > daysInMonth(year, month)) {
    return null;
  }
  return { year, month, day };
}

/**
 * Extracts and validates the parts of a calendar date. Accepts either a strict
 * "YYYY-MM-DD" string or an object with numeric year, month and day fields.
 * Returns null when the input is malformed or not a real calendar date.
 */
function tryParseParts(input: unknown): DateParts | null {
  if (typeof input === "string") {
    const match = DATE_PATTERN.exec(input);
    if (match === null) {
      return null;
    }
    return validateParts(Number(match[1]), Number(match[2]), Number(match[3]));
  }
  if (typeof input === "object" && input !== null) {
    const candidate = input as Record<string, unknown>;
    const { year, month, day } = candidate;
    if (
      typeof year !== "number" ||
      typeof month !== "number" ||
      typeof day !== "number"
    ) {
      return null;
    }
    return validateParts(year, month, day);
  }
  return null;
}

/**
 * True when the input is a strictly formatted, real calendar date.
 */
export function isValidDate(input: unknown): input is CalendarDate {
  return tryParseParts(input) !== null;
}

/**
 * Parses a strict "YYYY-MM-DD" string into a CalendarDate.
 * Throws InvalidDateError for malformed input or dates that do not exist.
 */
export function parseDate(input: string): CalendarDate {
  if (typeof input !== "string" || tryParseParts(input) === null) {
    throw new InvalidDateError(input);
  }
  return input as unknown as CalendarDate;
}

/**
 * Converts a date to the number of days since 1970-01-01 (day 0).
 * Dates before the epoch yield negative numbers.
 */
export function toDayNumber(date: CalendarDate): number {
  const parts = tryParseParts(date);
  if (parts === null) {
    throw new InvalidDateError(date);
  }
  const { month, day } = parts;
  const y = month <= 2 ? parts.year - 1 : parts.year;
  const era = Math.floor(y / 400);
  const yearOfEra = y - era * 400;
  const shiftedMonth = month > 2 ? month - 3 : month + 9;
  const dayOfYear = Math.floor((153 * shiftedMonth + 2) / 5) + day - 1;
  const dayOfEra =
    yearOfEra * 365 +
    Math.floor(yearOfEra / 4) -
    Math.floor(yearOfEra / 100) +
    dayOfYear;
  return era * DAYS_PER_ERA + dayOfEra - EPOCH_SHIFT;
}

/**
 * Converts a number of days since 1970-01-01 back to a CalendarDate.
 * Throws InvalidDateError when the value is not an integer or the result
 * falls outside the years 0000-9999.
 */
export function fromDayNumber(dayNumber: number): CalendarDate {
  if (!Number.isSafeInteger(dayNumber)) {
    throw new InvalidDateError(
      dayNumber,
      `Invalid day number: ${String(dayNumber)}`,
    );
  }
  const z = dayNumber + EPOCH_SHIFT;
  const era = Math.floor(z / DAYS_PER_ERA);
  const dayOfEra = z - era * DAYS_PER_ERA;
  const yearOfEra = Math.floor(
    (dayOfEra -
      Math.floor(dayOfEra / 1460) +
      Math.floor(dayOfEra / 36524) -
      Math.floor(dayOfEra / 146096)) /
      365,
  );
  const dayOfYear =
    dayOfEra -
    (365 * yearOfEra +
      Math.floor(yearOfEra / 4) -
      Math.floor(yearOfEra / 100));
  const shiftedMonth = Math.floor((5 * dayOfYear + 2) / 153);
  const day = dayOfYear - Math.floor((153 * shiftedMonth + 2) / 5) + 1;
  const month = shiftedMonth < 10 ? shiftedMonth + 3 : shiftedMonth - 9;
  const year = yearOfEra + era * 400 + (month <= 2 ? 1 : 0);

  if (year < MIN_YEAR || year > MAX_YEAR) {
    throw new InvalidDateError(
      dayNumber,
      `Day number out of supported range: ${String(dayNumber)}`,
    );
  }
  return { year, month, day } as unknown as CalendarDate;
}