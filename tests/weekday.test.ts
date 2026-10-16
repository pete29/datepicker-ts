import { describe, it, expect } from 'vitest';
import { getWeekday, startOfWeek } from '../src/weekday';
import { parseDate } from '../src/parse';
import { Weekday } from '../src/types';

describe('getWeekday', () => {
  it('returns ISO weekday numbers for known dates, including before the epoch and leap days', () => {
    expect(getWeekday(parseDate('1970-01-05'))).toBe(Weekday.Monday);
    expect(getWeekday(parseDate('1970-01-01'))).toBe(Weekday.Thursday);
    expect(getWeekday(parseDate('2024-02-29'))).toBe(Weekday.Thursday);
    expect(getWeekday(parseDate('2000-01-01'))).toBe(Weekday.Saturday);
    expect(getWeekday(parseDate('2023-12-31'))).toBe(Weekday.Sunday);
    expect(getWeekday(parseDate('1969-12-28'))).toBe(Weekday.Sunday);
    expect(getWeekday(parseDate('0001-01-01'))).toBe(Weekday.Monday);
  });
});

describe('startOfWeek', () => {
  it('returns the Monday of the containing ISO week, crossing month/year/epoch boundaries', () => {
    expect(startOfWeek(parseDate('2024-01-15'))).toBe('2024-01-15');
    expect(startOfWeek(parseDate('2024-01-21'))).toBe('2024-01-15');
    expect(startOfWeek(parseDate('2024-01-01'))).toBe('2024-01-01');
    expect(startOfWeek(parseDate('2021-01-01'))).toBe('2020-12-28');
    expect(startOfWeek(parseDate('2024-03-03'))).toBe('2024-02-26');
    expect(startOfWeek(parseDate('1970-01-01'))).toBe('1969-12-29');
  });
});

describe('weekday invariants', () => {
  it('startOfWeek always yields a Monday and propagates errors for out-of-range results', () => {
    const dates = ['2024-02-29', '2023-07-09', '1999-12-31', '1600-03-01', '2100-02-28'];
    for (const d of dates) {
      const start = startOfWeek(parseDate(d));
      expect(getWeekday(start)).toBe(Weekday.Monday);
      expect(start <= d).toBe(true);
    }
    // 0000-01-01 is a Saturday; its week's Monday is before year 0
    expect(() => startOfWeek(parseDate('0000-01-01'))).toThrow();
  });
});