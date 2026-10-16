import { describe, it, expect } from 'vitest';
import { isLeapYear, daysInMonth, isValidDate, parseDate, toDayNumber, fromDayNumber } from '../src/parse';

describe('parse', () => {
  it('validates and parses strict dates, rejecting malformed or nonexistent ones', () => {
    expect(isValidDate('2024-02-29')).toBe(true);
    expect(isValidDate('0000-01-01')).toBe(true);
    expect(isValidDate('9999-12-31')).toBe(true);
    expect(isValidDate('2023-02-29')).toBe(false);
    expect(isValidDate('1900-02-29')).toBe(false);
    expect(isValidDate('2023-13-01')).toBe(false);
    expect(isValidDate('2023-00-10')).toBe(false);
    expect(isValidDate('2023-04-31')).toBe(false);
    expect(isValidDate('2023-1-01')).toBe(false);
    expect(isValidDate(' 2023-01-01')).toBe(false);
    expect(isValidDate(20230101)).toBe(false);
    expect(isValidDate(null)).toBe(false);

    expect(parseDate('2000-02-29')).toBe('2000-02-29');
    expect(() => parseDate('2023-02-30')).toThrow(/Invalid calendar date/);
    try {
      parseDate('bad');
      expect.unreachable();
    } catch (e) {
      expect((e as Error).name).toBe('InvalidDateError');
      expect((e as { input: unknown }).input).toBe('bad');
    }
    expect(() => parseDate(5 as unknown as string)).toThrow();
  });

  it('computes leap years and days in month', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2024.5)).toBe(false);

    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2023, 2)).toBe(28);
    expect(daysInMonth(2023, 1)).toBe(31);
    expect(daysInMonth(2023, 4)).toBe(30);
    expect(daysInMonth(2023, 12)).toBe(31);
    expect(() => daysInMonth(2023, 0)).toThrow();
    expect(() => daysInMonth(2023, 13)).toThrow();
    expect(() => daysInMonth(2023, 1.5)).toThrow();
    expect(() => daysInMonth(1.5, 1)).toThrow();
  });

  it('converts between dates and day numbers, round-tripping and enforcing range', () => {
    const d = (s: string) => parseDate(s);
    expect(toDayNumber(d('1970-01-01'))).toBe(0);
    expect(toDayNumber(d('1970-01-02'))).toBe(1);
    expect(toDayNumber(d('1969-12-31'))).toBe(-1);
    expect(toDayNumber(d('2000-03-01'))).toBe(11017);
    expect(toDayNumber(d('2024-01-01'))).toBe(19723);
    expect(toDayNumber(d('0000-01-01'))).toBe(-719528);
    expect(toDayNumber(d('9999-12-31'))).toBe(2932896);
    expect(() => toDayNumber('2023-02-30' as never)).toThrow();

    expect(fromDayNumber(0)).toBe('1970-01-01');
    expect(fromDayNumber(-1)).toBe('1969-12-31');
    expect(fromDayNumber(11017)).toBe('2000-03-01');
    expect(fromDayNumber(-719528)).toBe('0000-01-01');
    expect(fromDayNumber(2932896)).toBe('9999-12-31');
    expect(() => fromDayNumber(2932897)).toThrow();
    expect(() => fromDayNumber(-719529)).toThrow();
    expect(() => fromDayNumber(1.5)).toThrow();
    expect(() => fromDayNumber(NaN)).toThrow();
    expect(() => fromDayNumber(Infinity)).toThrow();

    for (const s of ['2024-02-29', '1900-03-01', '1999-12-31', '0400-02-29', '1600-02-29']) {
      expect(fromDayNumber(toDayNumber(d(s)))).toBe(s);
    }
    for (let n = -800; n <= 800; n += 37) {
      expect(toDayNumber(fromDayNumber(n))).toBe(n);
    }
  });
});