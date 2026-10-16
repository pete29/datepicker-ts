import { fromDayNumber, toDayNumber } from "./parse";
import type { CalendarDate } from "./types";
import { Weekday } from "./types";

/**
 * 1970-01-05 was a Monday. Anchoring on a known Monday, measured with
 * toDayNumber itself, keeps the calculation independent of the day-number
 * epoch and of the time zone.
 */
const REFERENCE_MONDAY = "1970-01-05" as CalendarDate;

let referenceMondayDayNumber: number | undefined;

function getReferenceMonday(): number {
  if (referenceMondayDayNumber === undefined) {
    referenceMondayDayNumber = toDayNumber(REFERENCE_MONDAY);
  }
  return referenceMondayDayNumber;
}

function weekdayFromDayNumber(dayNumber: number): Weekday {
  const offset = (dayNumber - getReferenceMonday()) % 7;
  const normalized = (offset + 7) % 7;
  return (normalized + 1) as Weekday;
}

/**
 * Returns the ISO weekday (Monday = 1 through Sunday = 7) of a date.
 * Derived purely from the day number, so it does not depend on the time zone.
 */
export function getWeekday(date: CalendarDate): Weekday {
  return weekdayFromDayNumber(toDayNumber(date));
}

/**
 * Returns the Monday of the ISO week that contains the given date.
 */
export function startOfWeek(date: CalendarDate): CalendarDate {
  const dayNumber = toDayNumber(date);
  const weekday = weekdayFromDayNumber(dayNumber);
  return fromDayNumber(dayNumber - (weekday - Weekday.Monday));
}