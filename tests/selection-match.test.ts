import { describe, it, expect } from 'vitest';
import { isDateSelected } from '../src/selection-match';

type Cal = Parameters<typeof isDateSelected>[0];

const d = (s: string) => s as unknown as Exclude<Cal, string>;

describe('isDateSelected', () => {
  it('returns false for missing selection and matches only the selected date in single mode', () => {
    expect(isDateSelected('2024-05-10', undefined)).toBe(false);
    expect(isDateSelected('2024-05-10', null)).toBe(false);
    expect(isDateSelected('2024-05-10', { selected: null })).toBe(false);
    expect(isDateSelected('2024-05-10', { selected: d('2024-05-10') })).toBe(true);
    expect(isDateSelected(d('2024-05-10'), { selected: d('2024-05-10') })).toBe(true);
    expect(isDateSelected('2024-05-11', { selected: d('2024-05-10') })).toBe(false);
  });

  it('handles range mode with partial ranges', () => {
    expect(isDateSelected('2024-05-10', { start: null, end: null })).toBe(false);
    expect(isDateSelected('2024-05-10', { start: null, end: d('2024-05-20') })).toBe(false);
    expect(isDateSelected('2024-05-10', { start: d('2024-05-10'), end: null })).toBe(true);
    expect(isDateSelected('2024-05-11', { start: d('2024-05-10'), end: null })).toBe(false);
    expect(isDateSelected('2024-05-09', { start: d('2024-05-10'), end: null })).toBe(false);
  });

  it('includes both boundaries and excludes dates outside a full range', () => {
    const range = { start: d('2024-05-10'), end: d('2024-05-20') };
    expect(isDateSelected('2024-05-10', range)).toBe(true);
    expect(isDateSelected('2024-05-15', range)).toBe(true);
    expect(isDateSelected('2024-05-20', range)).toBe(true);
    expect(isDateSelected('2024-05-09', range)).toBe(false);
    expect(isDateSelected('2024-05-21', range)).toBe(false);
    const same = { start: d('2024-05-10'), end: d('2024-05-10') };
    expect(isDateSelected('2024-05-10', same)).toBe(true);
    expect(isDateSelected('2024-05-11', same)).toBe(false);
  });
});