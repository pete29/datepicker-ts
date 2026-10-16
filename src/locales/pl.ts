import type { CalendarLocale } from "../locale-types.js";
import type { CalendarDate } from "../types.js";

/**
 * The Polish locale additionally exposes genitive month names,
 * which are used when a month appears after a day number.
 */
export interface PolishCalendarLocale extends CalendarLocale {
  readonly code: "pl";
  /** The 12 month names in the genitive case, January first. */
  readonly genitiveMonthNames: CalendarLocale["monthNames"];
}

const monthNames: CalendarLocale["monthNames"] = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień",
];

const genitiveMonthNames: CalendarLocale["monthNames"] = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];

const fullWeekdayNames: CalendarLocale["fullWeekdayNames"] = [
  "poniedziałek",
  "wtorek",
  "środa",
  "czwartek",
  "piątek",
  "sobota",
  "niedziela",
];

const shortWeekdayNames: CalendarLocale["shortWeekdayNames"] = [
  "pn",
  "wt",
  "śr",
  "czw",
  "pt",
  "sob",
  "nd",
];

function assertMonth(month: number): void {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError(`Month must be an integer from 1 to 12, got ${month}`);
  }
}

export const pl: PolishCalendarLocale = {
  code: "pl",
  monthNames,
  genitiveMonthNames,
  fullWeekdayNames,
  shortWeekdayNames,

  formatDate(date: CalendarDate): string {
    // CalendarDate is a validated "YYYY-MM-DD" string.
    const year = Number(date.slice(0, 4));
    const month = Number(date.slice(5, 7));
    const day = Number(date.slice(8, 10));
    assertMonth(month);
    return `${day} ${genitiveMonthNames[month - 1]} ${year}`;
  },

  formatMonthHeading(year: number, month: number): string {
    assertMonth(month);
    return `${monthNames[month - 1]} ${year}`;
  },
};