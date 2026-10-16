import { describe, it, expect } from 'vitest';
import { isLeapYear, daysInMonth, isValidDate, parseDate, toDayNumber, fromDayNumber } from '../src/parse';

describe('parse', () => {
  it('applies Gregorian leap-year and month-length rules', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1.5)).toBe(false);

    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2023, 4)).toBe(30);
    expect(daysInMonth(2023, 12)).toBe(31);
    expect(() => daysInMonth(2023, 13)).toThrow();
    expect(() => daysInMonth(2023, 0)).toThrow();
    expect(() => daysInMonth(1.5, 1)).toThrow();
  });

  it('validates and parses strict dates', () => {
    expect(isValidDate('2024-02-29')).toBe(true);
    expect(isValidDate('2023-02-29')).toBe(false);
    expect(isValidDate('2024-2-29')).toBe(false);
    expect(isValidDate('2024-13-01')).toBe(false);
    expect(isValidDate(' 2024-01-01')).toBe(false);
    expect(isValidDate({ year: 2024, month: 2, day: 29 })).toBe(true);
    expect(isValidDate({ year: '2024', month: 2, day: 29 })).toBe(false);
    expect(isValidDate({ year: 2023, month: 2, day: 29 })).toBe(false);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(42)).toBe(false);

    expect(parseDate('2024-02-29') as unknown).toBe('2024-02-29');
    expect(() => parseDate('2023-02-29')).toThrow();
    expect(() => parseDate('garbage')).toThrow();
  });

  it('converts between dates and day numbers', () => {
    expect(toDayNumber(parseDate('1970-01-01'))).toBe(0);
    expect(toDayNumber(parseDate('1970-01-02'))).toBe(1);
    expect(toDayNumber(parseDate('1969-12-31'))).toBe(-1);
    expect(toDayNumber(parseDate('2000-03-01'))).toBe(11017);
    expect(toDayNumber(parseDate('0000-01-01'))).toBe(-719528);

    expect(fromDayNumber(0) as unknown).toEqual({ year: 1970, month: 1, day: 1 });
    expect(fromDayNumber(11017) as unknown).toEqual({ year: 2000, month: 3, day: 1 });
    expect(fromDayNumber(-719528) as unknown).toEqual({ year: 0, month: 1, day: 1 });

    const last = parseDate('9999-12-31');
    expect(fromDayNumber(toDayNumber(last)) as unknown).toEqual({ year: 9999, month: 12, day: 31 });
    expect(() => fromDayNumber(toDayNumber(last) + 1)).toThrow();
    expect(() => fromDayNumber(-719529)).toThrow();
    expect(() => fromDayNumber(1.5)).toThrow();
    expect(() => fromDayNumber(NaN)).toThrow();
  });
});