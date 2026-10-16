import type { CalendarDate, Clock } from "./types.js";
import { parseDate } from "./parse.js";

export interface SystemClockOptions {
  /** IANA time zone name, e.g. "UTC" or "America/New_York". Defaults to "UTC". */
  timeZone?: string;
  /** Source of the current instant in epoch milliseconds. Defaults to Date.now. */
  now?: () => number;
}

/**
 * A clock that always reports the same date. The date is validated once,
 * when the clock is created.
 */
export function fixedClock(date: string): Clock {
  const fixed: CalendarDate = parseDate(date) as CalendarDate;
  return {
    today(): CalendarDate {
      return fixed;
    },
  };
}

/**
 * A clock that reads the current instant and formats it as "YYYY-MM-DD"
 * in an explicit time zone (default "UTC"), so the result does not depend
 * on the TZ of the environment.
 */
export function systemClock(options: SystemClockOptions = {}): Clock {
  const timeZone = options.timeZone ?? "UTC";
  const now = options.now ?? Date.now;

  // Created eagerly so an invalid time zone fails at construction time.
  const formatter = new Intl.DateTimeFormat("en-US-u-ca-gregory-nu-latn", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return {
    today(): CalendarDate {
      const parts = formatter.formatToParts(new Date(now()));
      let year = "";
      let month = "";
      let day = "";
      for (const part of parts) {
        if (part.type === "year") year = part.value;
        else if (part.type === "month") month = part.value;
        else if (part.type === "day") day = part.value;
      }
      const text = `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      return parseDate(text) as CalendarDate;
    },
  };
}