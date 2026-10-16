import { describe, it, expect } from "vitest";
import * as api from "../src/index.js";
import { InvalidDateError, isLeapYear } from "../src/index.js";

describe("public API barrel", () => {
  it("exposes all documented runtime functions", () => {
    const names = [
      "daysInMonth",
      "fromDayNumber",
      "isLeapYear",
      "isValidDate",
      "parseDate",
      "toDayNumber",
      "addDays",
      "daysBetween",
      "subtractDays",
      "addMonths",
      "subtractMonths",
      "clampDate",
      "compareDates",
      "isAfter",
      "isBefore",
      "isEqual",
      "getWeekday",
      "startOfWeek",
      "fixedClock",
      "systemClock",
      "createEmptyRangeSelection",
      "createEmptySingleSelection",
      "isDateDisabled",
      "selectSingle",
      "selectRange",
    ];
    for (const name of names) {
      expect(typeof (api as Record<string, unknown>)[name]).toBe("function");
    }
  });

  it("re-exports isLeapYear working correctly", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
  });

  it("re-exports InvalidDateError as an Error subclass", () => {
    expect(typeof InvalidDateError).toBe("function");
    expect(InvalidDateError.prototype instanceof Error).toBe(true);
  });
});
