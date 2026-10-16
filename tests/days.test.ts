import { describe, it, expect } from 'vitest';
import { addDays, subtractDays, daysBetween } from '../src/days';
import { parseDate } from '../src/parse';

describe('days', () => {
  it('addDays and subtractDays move across month, year and leap-year boundaries', () => {
    expect(addDays(parseDate('2024-01-31'), 1)).toBe('2024-02-01');
    expect(addDays(parseDate('2024-02-28'), 1)).toBe('2024-02-29');
    expect(addDays(parseDate('2023-02-28'), 1)).toBe('2023-03-01');
    expect(addDays(parseDate('2023-12-31'), 1)).toBe('2024-01-01');
    expect(addDays(parseDate('2024-03-01'), -1)).toBe('2024-02-29');
    expect(addDays(parseDate('2024-05-10'), 0)).toBe('2024-05-10');
    expect(subtractDays(parseDate('2024-01-01'), 1)).toBe('2023-12-31');
    expect(subtractDays(parseDate('2024-03-01'), 1)).toBe('2024-02-29');
    expect(subtractDays(parseDate('2024-03-01'), -31)).toBe('2024-04-01');
    expect(addDays(parseDate('2024-01-01'), 366)).toBe('2025-01-01');
  });

  it('daysBetween returns signed whole-day differences', () => {
    const a = parseDate('2024-01-01');
    const b = parseDate('2024-03-01');
    expect(daysBetween(a, b)).toBe(60);
    expect(daysBetween(b, a)).toBe(-60);
    expect(daysBetween(a, a)).toBe(0);
    expect(daysBetween(parseDate('2023-01-01'), parseDate('2024-01-01'))).toBe(365);
    expect(daysBetween(parseDate('2024-01-01'), parseDate('2025-01-01'))).toBe(366);
    expect(daysBetween(parseDate('1900-02-28'), parseDate('1900-03-01'))).toBe(1);
  });

  it('rejects non-integer offsets and out-of-range results', () => {
    const d = parseDate('2024-01-01');
    expect(() => addDays(d, 1.5)).toThrow(RangeError);
    expect(() => addDays(d, NaN)).toThrow(RangeError);
    expect(() => addDays(d, Infinity)).toThrow(RangeError);
    expect(() => addDays(d, '1' as unknown as number)).toThrow(RangeError);
    expect(() => subtractDays(d, 0.1)).toThrow(RangeError);
    expect(() => subtractDays(d, NaN)).toThrow(RangeError);
    expect(() => addDays(parseDate('9999-12-31'), 1)).toThrow();
    expect(() => subtractDays(parseDate('0000-01-01'), 1)).toThrow();
  });
});