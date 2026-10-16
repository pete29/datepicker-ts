import { describe, it, expect } from "vitest";
import {
  InvalidDateError,
  addDays,
  addMonths,
  clampDate,
  compareDates,
  daysBetween,
  daysInMonth,
  fixedClock,
  fromDayNumber,
  getWeekday,
  isAfter,
  isBefore,
  isEqual,
  isLeapYear,
  isValidDate,
  parseDate,
  startOfWeek,
  subtractDays,
  subtractMonths,
  systemClock,
  toDayNumber,
} from "../src/index.js";

describe("public API exports", () => {
  it("exports all expected functions and the error class", () => {
    const fns = [
      addDays,
      addMonths,
      clampDate,
      compareDates,
      daysBetween,
      daysInMonth,
      fixedClock,
      fromDayNumber,
      getWeekday,
      isAfter,
      isBefore,
      isEqual,
      isLeapYear,
      isValidDate,
      parseDate,
      startOfWeek,
      subtractDays,
      subtractMonths,
      systemClock,
      toDayNumber,
    ];
    for (const fn of fns) {
      expect(typeof fn).toBe("function");
    }
    expect(typeof InvalidDateError).toBe("function");
    expect(new InvalidDateError("x")).toBeInstanceOf(Error);
  });

  it("exposes basic calendar helpers", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2023, 2)).toBe(28);
  });

  it("re-exported functions work together", () => {
    const a = parseDate("2024-01-31");
    const b = addDays(a, 1);
    expect(daysBetween(a, b)).toBe(1);
    expect(isBefore(a, b)).toBe(true);
    expect(isAfter(a, b)).toBe(false);
    expect(isEqual(a, a)).toBe(true);
  });
});
