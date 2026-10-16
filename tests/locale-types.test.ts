import { describe, it, expect } from 'vitest';
import { type CalendarLocale, type LocaleCode } from '../src/locale-types';

type DateArg = Parameters<CalendarLocale['formatDate']>[0];

const asDate = (s: string): DateArg => s as DateArg;

const en: CalendarLocale = {
  code: 'en',
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  fullWeekdayNames: [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
  ],
  shortWeekdayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  formatDate(date) {
    const [y, m, d] = String(date).split('-').map(Number);
    return `${this.monthNames[m - 1]} ${d}, ${y}`;
  },
  formatMonthHeading(year, month) {
    return `${this.monthNames[month - 1]} ${year}`;
  },
};

const pl: CalendarLocale = {
  code: 'pl',
  monthNames: [
    'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
    'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień',
  ],
  fullWeekdayNames: [
    'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela',
  ],
  shortWeekdayNames: ['pon', 'wt', 'śr', 'czw', 'pt', 'sob', 'niedz'],
  formatDate(date) {
    const [y, m, d] = String(date).split('-').map(Number);
    return `${d} ${this.monthNames[m - 1]} ${y}`;
  },
  formatMonthHeading(year, month) {
    return `${this.monthNames[month - 1]} ${year}`;
  },
};

const locales: CalendarLocale[] = [en, pl];

describe('CalendarLocale contract', () => {
  it('identifies each locale with a LocaleCode', () => {
    const codes: LocaleCode[] = locales.map((l) => l.code);
    expect(codes).toEqual(['en', 'pl']);
  });

  it('provides 12 month names and 7 full and short weekday names, all non-empty', () => {
    for (const locale of locales) {
      expect(locale.monthNames).toHaveLength(12);
      expect(locale.fullWeekdayNames).toHaveLength(7);
      expect(locale.shortWeekdayNames).toHaveLength(7);
      for (const name of [
        ...locale.monthNames,
        ...locale.fullWeekdayNames,
        ...locale.shortWeekdayNames,
      ]) {
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
      }
    }
    // Monday first
    expect(en.fullWeekdayNames[0]).toBe('Monday');
    expect(en.fullWeekdayNames[6]).toBe('Sunday');
    expect(pl.fullWeekdayNames[0]).toBe('poniedziałek');
    // January first
    expect(en.monthNames[0]).toBe('January');
    expect(pl.monthNames[0]).toBe('styczeń');
  });

  it('formats dates and month headings as strings using 1-based months', () => {
    expect(en.formatDate(asDate('2024-03-05'))).toBe('March 5, 2024');
    expect(pl.formatDate(asDate('2024-03-05'))).toBe('5 marzec 2024');
    expect(en.formatMonthHeading(2024, 1)).toBe('January 2024');
    expect(en.formatMonthHeading(2024, 12)).toBe('December 2024');
    expect(pl.formatMonthHeading(2024, 10)).toBe('październik 2024');
  });
});