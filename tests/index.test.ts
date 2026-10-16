import { describe, it, expect } from "vitest";
import * as api from "../src/index.js";

describe("public API exports", () => {
  it("exports date utility functions", () => {
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
    ] as const;
    for (const name of names) {
      expect(typeof (api as Record<string, unknown>)[name]).toBe("function");
    }
  });

  it("exports clock, selection and grid functions", () => {
    const names = [
      "fixedClock",
      "systemClock",
      "createEmptyRangeSelection",
      "createEmptySingleSelection",
      "isDateDisabled",
      "selectSingle",
      "selectRange",
      "getMonthGrid",
    ] as const;
    for (const name of names) {
      expect(typeof (api as Record<string, unknown>)[name]).toBe("function");
    }
  });

  it("exports InvalidDateError as an Error subclass", () => {
    expect(typeof api.InvalidDateError).toBe("function");
    expect(api.InvalidDateError.prototype).toBeInstanceOf(Error);
  });
});
