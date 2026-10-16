import { InvalidDateError } from "./errors";
import { daysInMonth } from "./parse";
import { addDays, daysBetween } from "./days";
import { startOfWeek } from "./weekday";
import { isDateDisabled } from "./constraints";
import { isDateSelected } from "./selection-match";
import type { CalendarDate } from "./types";
import type {
  MonthGridDay,
  MonthGridOptions,
  MonthGridWeek,
} from "./month-grid-types";

function pad(value: number, width: number): string {
  return String(value).padStart(width, "0");
}

/**
 * Builds the grid of weeks (Monday first) covering the requested month.
 * Leading days come from the previous month and trailing days from the next
 * month, so every week has exactly 7 days. Throws InvalidDateError when the
 * year or month is not valid.
 */
export function getMonthGrid(options: MonthGridOptions): MonthGridWeek[] {
  const { year, month, clock, selection, constraints } = options;

  if (typeof year !== "number" || !Number.isInteger(year) || year < 1 || year > 9999) {
    throw new InvalidDateError(
      `Invalid year: ${String(year)}. Expected an integer between 1 and 9999.`,
    );
  }
  if (typeof month !== "number" || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new InvalidDateError(
      `Invalid month: ${String(month)}. Expected an integer between 1 and 12.`,
    );
  }

  const monthPrefix = `${pad(year, 4)}-${pad(month, 2)}-`;
  const firstOfMonth = `${monthPrefix}01` as CalendarDate;
  const lastOfMonth = `${monthPrefix}${pad(daysInMonth(year, month), 2)}` as CalendarDate;

  const gridStart = startOfWeek(firstOfMonth);
  const gridEnd = addDays(startOfWeek(lastOfMonth), 6);

  const totalDays = daysBetween(gridStart, gridEnd) + 1;
  const weekCount = totalDays / 7;

  const today = clock.today();

  const weeks: MonthGridWeek[] = [];
  for (let w = 0; w < weekCount; w++) {
    const days: MonthGridDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(gridStart, w * 7 + d);
      days.push({
        date,
        isInMonth: String(date).startsWith(monthPrefix),
        isToday: String(date) === String(today),
        isSelected: isDateSelected(date, selection),
        isDisabled: isDateDisabled(date, constraints),
      });
    }
    weeks.push(days as MonthGridWeek);
  }

  return weeks;
}