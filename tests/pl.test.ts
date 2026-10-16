import { describe, it, expect } from 'vitest';
import { pl } from '../src/locales/pl';

const asDate = (value: string) => value as Parameters<typeof pl.formatDate>[0];

describe('pl locale', () => {
  it('exposes the Polish names and code', () => {
    expect(pl.code).toBe('pl');
    expect(pl.monthNames).toHaveLength(12);
    expect(pl.genitiveMonthNames).toHaveLength(12);
    expect(pl.monthNames[0]).toBe('styczeń');
    expect(pl.monthNames[11]).toBe('grudzień');
    expect(pl.genitiveMonthNames[8]).toBe('września');
    expect(pl.genitiveMonthNames[9]).toBe('października');
    expect(pl.fullWeekdayNames).toEqual([
      'poniedziałek',
      'wtorek',
      'środa',
      'czwartek',
      'piątek',
      'sobota',
      'niedziela',
    ]);
    expect(pl.shortWeekdayNames).toEqual(['pn', 'wt', 'śr', 'czw', 'pt', 'sob', 'nd']);
  });

  it('formats dates with the genitive month and no leading zero on the day', () => {
    expect(pl.formatDate(asDate('2024-03-05'))).toBe('5 marca 2024');
    expect(pl.formatDate(asDate('2023-12-31'))).toBe('31 grudnia 2023');
    expect(pl.formatDate(asDate('2021-01-01'))).toBe('1 stycznia 2021');
  });

  it('formats month headings with nominative names and rejects invalid months', () => {
    expect(pl.formatMonthHeading(2024, 1)).toBe('styczeń 2024');
    expect(pl.formatMonthHeading(1999, 12)).toBe('grudzień 1999');
    expect(() => pl.formatMonthHeading(2024, 0)).toThrow(RangeError);
    expect(() => pl.formatMonthHeading(2024, 13)).toThrow(RangeError);
    expect(() => pl.formatMonthHeading(2024, 1.5)).toThrow(RangeError);
    expect(() => pl.formatDate(asDate('2024-13-01'))).toThrow(RangeError);
  });
});