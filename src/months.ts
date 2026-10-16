import type { CalendarDate } from "./types.js";
import { daysInMonth } from "./parse.js";

function pad(value: number, width: number): string {
  return String(value).padStart(width, "0");
}

function splitDate(date: CalendarDate): { year: number; month: number; day: number } {
  const text: string = date;
  return {
    year: Number(text.slice(0, 4)),
    month: Number(text.slice(5, 7)),
    day: Number(text.slice(8, 10)),
  };
}

function formatDate(year: number, month: number, day: number): CalendarDate {
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}` as CalendarDate;
}

/**
 * Shifts a date by a number of months (positive or negative), carrying across
 * year boundaries and clamping the day to the last day of the target month
 * when the original day does not exist there.
 */
export function addMonths(date: CalendarDate, n: number): CalendarDate {
  if (!Number.isInteger(n)) {
    throw new RangeError(`Month offset must be an integer, received ${n}`);
  }

  const parts = splitDate(date);
  const totalMonths = parts.year * 12 + (parts.month - 1) + n;
  const year = Math.floor(totalMonths / 12);
  const month = totalMonths - year * 12 + 1;

  const lastDay = daysInMonth(year, month);
  const day = Math.min(parts.day, lastDay);

  return formatDate(year, month, day);
}

/**
 * Shifts a date backwards by a number of months. Equivalent to addMonths(date, -n).
 */
export function subtractMonths(date: CalendarDate, n: number): CalendarDate {
  if (!Number.isInteger(n)) {
    throw new RangeError(`Month offset must be an integer, received ${n}`);
  }
  return addMonths(date, -n);
}