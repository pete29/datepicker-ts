import { describe, it, expect } from 'vitest';
import { addMonths, subtractMonths } from '../src/months';
import { parseDate } from '../src/parse';

describe('addMonths', () => {
  it('shifts across year boundaries in both directions and clamps the day', () => {
    expect(addMonths(parseDate('2023-11-15'), 3)).toBe('2024-02-15');
    expect(addMonths(parseDate('2024-01-15'), -2)).toBe('2023-11-15');
    expect(addMonths(parseDate('2024-05-10'), 0)).toBe('2024-05-10');
    expect(addMonths(parseDate('2024-01-31'), 1)).toBe('2024-02-29');
    expect(addMonths(parseDate('2023-01-31'), 1)).toBe('2023-02-28');
    expect(addMonths(parseDate('2024-03-31'), -1)).toBe('2024-02-29');
    expect(addMonths(parseDate('2024-01-15'), 24)).toBe('2026-01-15');
    expect(addMonths(parseDate('0001-01-15'), -1)).toBe('0000-12-15');
  });

  it('rejects non-integer offsets with RangeError', () => {
    expect(() => addMonths(parseDate('2024-01-15'), 1.5)).toThrow(RangeError);
    expect(() => addMonths(parseDate('2024-01-15'), NaN)).toThrow(RangeError);
    expect(() => addMonths(parseDate('2024-01-15'), Infinity)).toThrow(RangeError);
  });
});

describe('subtractMonths', () => {
  it('is equivalent to addMonths with a negated offset and validates the offset', () => {
    const d = parseDate('2024-03-31');
    expect(subtractMonths(d, 1)).toBe('2024-02-29');
    expect(subtractMonths(d, 1)).toBe(addMonths(d, -1));
    expect(subtractMonths(d, -2)).toBe('2024-05-31');
    expect(subtractMonths(parseDate('2024-01-15'), 13)).toBe('2022-12-15');
    expect(() => subtractMonths(d, 0.5)).toThrow(RangeError);
  });
});