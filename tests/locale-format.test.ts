import { describe, it, expect } from 'vitest';
import {
  formatFullDate,
  formatMonthHeading,
  getMonthNames,
  getWeekdayNames,
} from '../src/locale-format';

type DateArg = Parameters<typeof formatFullDate>[0];
const asDate = (s: string) => s as unknown as DateArg;

describe('locale-format', () => {
  it('formats full dates and month headings for supported locales', () => {
    for (const code of ['en', 'pl']) {
      const full = formatFullDate(asDate('2024-02-29'), code);
      expect(typeof full).toBe('string');
      expect(full).toContain('2024');

      const heading = formatMonthHeading(2024, 3, code);
      expect(typeof heading).toBe('string');
      expect(heading).toContain('2024');
    }
  });

  it('rejects unsupported locales and invalid dates, checking locale first', () => {
    expect(() => formatFullDate(asDate('2024-03-15'), 'xx')).toThrow(/Unsupported locale/);
    expect(() => formatMonthHeading(2024, 3, 'xx')).toThrow(/Unsupported locale/);
    expect(() => getMonthNames('xx')).toThrow(/Unsupported locale/);
    expect(() => getWeekdayNames('xx', 'short')).toThrow(/Unsupported locale/);

    expect(() => formatFullDate(asDate('2023-02-30'), 'en')).toThrow(/Invalid calendar date/);
    expect(() => formatFullDate(asDate('not-a-date'), 'pl')).toThrow(/Invalid calendar date/);
    expect(() => formatFullDate(asDate('2024-03-15'), 'xx')).toThrow(/Unsupported locale/);
    expect(() => formatFullDate(asDate('2023-02-30'), 'xx')).toThrow(/Unsupported locale/);

    expect(() => formatMonthHeading(2024, 13, 'en')).toThrow(/Invalid month/);
    expect(() => formatMonthHeading(2024, 0, 'en')).toThrow(/Invalid month/);
    expect(() => formatMonthHeading(2024.5, 3, 'en')).toThrow(/Invalid year/);
  });

  it('returns month and weekday name lists as fresh copies', () => {
    for (const code of ['en', 'pl']) {
      const months = getMonthNames(code);
      expect(months).toHaveLength(12);
      // month names are the same for both widths
      expect(getMonthNames(code, 'short')).toEqual(months);
      expect(getMonthNames(code, 'full')).toEqual(months);

      const full = getWeekdayNames(code);
      const short = getWeekdayNames(code, 'short');
      expect(full).toHaveLength(7);
      expect(short).toHaveLength(7);
      expect(getWeekdayNames(code, 'full')).toEqual(full);
      expect(short).not.toEqual(full);

      // mutating a returned array must not affect later calls
      (months as string[])[0] = 'MUTATED';
      (full as string[])[0] = 'MUTATED';
      expect(getMonthNames(code)[0]).not.toBe('MUTATED');
      expect(getWeekdayNames(code)[0]).not.toBe('MUTATED');
    }
    expect(getMonthNames('en')[0]).toBe('January');
  });
});