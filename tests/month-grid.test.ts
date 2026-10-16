import { describe, it, expect } from 'vitest';
import { getMonthGrid } from '../src/month-grid';

const d = (s: string) => s as any;
const clock = (s: string) => ({ today: () => d(s) });

describe('getMonthGrid', () => {
  it('builds Monday-first weeks of 7 days with correct in-month flags and today', () => {
    // February 2024: starts Thursday, leap year, ends Thursday
    const grid = getMonthGrid({ year: 2024, month: 2, clock: clock('2024-02-14') } as any);
    expect(grid.length).toBe(5);
    for (const week of grid) {
      expect(week.length).toBe(7);
    }
    expect(String(grid[0][0].date)).toBe('2024-01-29');
    expect(grid[0][0].isInMonth).toBe(false);
    expect(String(grid[0][3].date)).toBe('2024-02-01');
    expect(grid[0][3].isInMonth).toBe(true);
    expect(String(grid[4][6].date)).toBe('2024-03-03');
    expect(grid[4][6].isInMonth).toBe(false);
    const flat = grid.flat();
    const inMonth = flat.filter((x) => x.isInMonth);
    expect(inMonth.length).toBe(29);
    const todays = flat.filter((x) => x.isToday);
    expect(todays.length).toBe(1);
    expect(String(todays[0].date)).toBe('2024-02-14');
  });

  it('handles a month that fits exactly in four weeks and a six-week month', () => {
    // February 2021 starts Monday and has 28 days
    const feb = getMonthGrid({ year: 2021, month: 2, clock: clock('2000-01-01') } as any);
    expect(feb.length).toBe(4);
    expect(String(feb[0][0].date)).toBe('2021-02-01');
    expect(feb.flat().every((x) => x.isInMonth)).toBe(true);
    expect(feb.flat().some((x) => x.isToday)).toBe(false);
    // March 2025 starts Saturday, 31 days -> 6 weeks
    const mar = getMonthGrid({ year: 2025, month: 3, clock: clock('2000-01-01') } as any);
    expect(mar.length).toBe(6);
    expect(String(mar[0][0].date)).toBe('2025-02-24');
    expect(String(mar[5][6].date)).toBe('2025-04-06');
  });

  it('applies selection and constraints and rejects invalid year or month', () => {
    const grid = getMonthGrid({
      year: 2024,
      month: 5,
      clock: clock('2024-05-10'),
      selection: { start: d('2024-05-06'), end: d('2024-05-08') },
      constraints: { min: d('2024-05-02'), disabled: [d('2024-05-15')] },
    } as any);
    const find = (s: string) => grid.flat().find((x) => String(x.date) === s)!;
    expect(find('2024-05-05').isSelected).toBe(false);
    expect(find('2024-05-06').isSelected).toBe(true);
    expect(find('2024-05-07').isSelected).toBe(true);
    expect(find('2024-05-08').isSelected).toBe(true);
    expect(find('2024-05-09').isSelected).toBe(false);
    expect(find('2024-05-01').isDisabled).toBe(true);
    expect(find('2024-05-02').isDisabled).toBe(false);
    expect(find('2024-05-15').isDisabled).toBe(true);

    const c = clock('2024-01-01');
    expect(() => getMonthGrid({ year: 2024, month: 0, clock: c } as any)).toThrow(/Invalid month/);
    expect(() => getMonthGrid({ year: 2024, month: 13, clock: c } as any)).toThrow();
    expect(() => getMonthGrid({ year: 0, month: 1, clock: c } as any)).toThrow(/Invalid year/);
    expect(() => getMonthGrid({ year: 10000, month: 1, clock: c } as any)).toThrow();
    expect(() => getMonthGrid({ year: 2024.5, month: 1, clock: c } as any)).toThrow();
  });
});