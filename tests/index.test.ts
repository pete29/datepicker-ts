import { describe, it, expect } from "vitest";
import * as api from "../src/index.js";

describe("public API exports", () => {
  it("exports all expected runtime functions and values", () => {
    const names = [
      "InvalidDateError",
      "UnsupportedLocaleError",
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
      "getMonthGrid",
      "moveFocus",
      "pl",
      "en",
      "availableLocales",
      "getLocale",
      "isSupportedLocale",
      "formatFullDate",
      "formatMonthHeading",
      "getMonthNames",
      "getWeekdayNames",
    ];
    for (const name of names) {
      expect((api as Record<string, unknown>)[name], name).toBeDefined();
    }
  });

  it("exposes working date helpers through the entry point", () => {
    expect(api.isLeapYear(2024)).toBe(true);
    expect(api.isLeapYear(2023)).toBe(false);
    expect(api.daysInMonth(2024, 2)).toBe(29);
  });

  it("exposes locale registry consistent with exported locales", () => {
    expect(api.isSupportedLocale("en")).toBe(true);
    expect(api.isSupportedLocale("xx")).toBe(false);
    expect(api.getLocale("en")).toBe(api.en);
  });
});
