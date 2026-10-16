import { describe, it, expect } from "vitest";
import {
  InvalidDateError,
  UnsupportedLocaleError,
  addDays,
  availableLocales,
  compareDates,
  createEmptyRangeSelection,
  createEmptySingleSelection,
  daysInMonth,
  en,
  fixedClock,
  getLocale,
  getMonthGrid,
  isLeapYear,
  isSupportedLocale,
  moveFocus,
  pl,
  renderMonthGrid,
  selectRange,
  selectSingle,
  systemClock,
} from "../src/index.js";

describe("public API exports", () => {
  it("exports runtime functions, error classes and locales", () => {
    expect(typeof InvalidDateError).toBe("function");
    expect(typeof UnsupportedLocaleError).toBe("function");
    expect(typeof addDays).toBe("function");
    expect(typeof compareDates).toBe("function");
    expect(typeof daysInMonth).toBe("function");
    expect(typeof fixedClock).toBe("function");
    expect(typeof systemClock).toBe("function");
    expect(typeof getMonthGrid).toBe("function");
    expect(typeof renderMonthGrid).toBe("function");
    expect(typeof moveFocus).toBe("function");
    expect(typeof selectSingle).toBe("function");
    expect(typeof selectRange).toBe("function");
    expect(en).toBeDefined();
    expect(pl).toBeDefined();
  });

  it("re-exported date helpers behave correctly", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2023, 2)).toBe(28);
  });

  it("exports locale registry and empty selection factories", () => {
    expect(isSupportedLocale("en")).toBe(true);
    expect(isSupportedLocale("xx")).toBe(false);
    expect(getLocale("en")).toBe(en);
    expect(availableLocales).toBeDefined();
    expect(createEmptySingleSelection()).toBeDefined();
    expect(createEmptyRangeSelection()).toBeDefined();
  });
});
