import { describe, it, expect } from 'vitest';
import { en } from '../src/locales/en';

describe('en locale', () => {
  it('exposes the locale code and name tables in the expected order', () => {
    expect(en.code).toBe('en');
    expect(en.monthNames).toHaveLength(12);
    expect(en.monthNames[0]).toBe('January');
    expect(en.monthNames[11]).toBe('December');
    expect(en.fullWeekdayNames).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
    expect(en.shortWeekdayNames).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ]);
  });

  it('formatDate renders "Month D, YYYY" without zero-padding the day', () => {
    expect(en.formatDate('2024-03-05' as Parameters<typeof en.formatDate>[0])).toBe('March 5, 2024');
    expect(en.formatDate('1999-12-31' as Parameters<typeof en.formatDate>[0])).toBe('December 31, 1999');
    expect(en.formatDate('2020-01-01' as Parameters<typeof en.formatDate>[0])).toBe('January 1, 2020');
  });

  it('formatMonthHeading renders "Month YYYY" using 1-based months', () => {
    expect(en.formatMonthHeading(2024, 1)).toBe('January 2024');
    expect(en.formatMonthHeading(2031, 12)).toBe('December 2031');
    expect(en.formatMonthHeading(2024, 7)).toBe('July 2024');
  });
});