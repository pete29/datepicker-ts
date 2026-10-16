import type { CalendarDate } from "../types.js";
import type { CalendarLocale } from "../locale-types.js";

const monthNames: CalendarLocale["monthNames"] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const fullWeekdayNames: CalendarLocale["fullWeekdayNames"] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const shortWeekdayNames: CalendarLocale["shortWeekdayNames"] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

/**
 * English calendar locale.
 */
export const en: CalendarLocale = {
  code: "en",
  monthNames,
  fullWeekdayNames,
  shortWeekdayNames,

  formatDate(date: CalendarDate): string {
    const parts = (date as string).split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    const monthName = monthNames[month - 1];
    return `${monthName} ${day}, ${year}`;
  },

  formatMonthHeading(year: number, month: number): string {
    const monthName = monthNames[month - 1];
    return `${monthName} ${year}`;
  },
};