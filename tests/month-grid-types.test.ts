import { describe, it, expect } from 'vitest';
import { type MonthGridDay, type MonthGridWeek, type MonthGridOptions } from '../src/month-grid-types';

type Date_ = MonthGridDay['date'];
const d = (s: string): Date_ => s as Date_;

const makeDay = (s: string, overrides: Partial<MonthGridDay> = {}): MonthGridDay => ({
  date: d(s),
  isInMonth: true,
  isToday: false,
  isSelected: false,
  isDisabled: false,
  ...overrides,
});

describe('month-grid-types', () => {
  it('describes a grid day with date and the four boolean flags', () => {
    const day = makeDay('2024-03-15', { isToday: true });
    expect(Object.keys(day).sort()).toEqual(
      ['date', 'isDisabled', 'isInMonth', 'isSelected', 'isToday'].sort(),
    );
    expect(day.date).toBe('2024-03-15');
    expect(day.isToday).toBe(true);
    expect(day.isSelected).toBe(false);
  });

  it('describes a week as a tuple of exactly 7 days', () => {
    const week: MonthGridWeek = [
      makeDay('2024-02-26', { isInMonth: false }),
      makeDay('2024-02-27', { isInMonth: false }),
      makeDay('2024-02-28', { isInMonth: false }),
      makeDay('2024-02-29', { isInMonth: false }),
      makeDay('2024-03-01'),
      makeDay('2024-03-02'),
      makeDay('2024-03-03'),
    ];
    expect(week).toHaveLength(7);
    expect(week[0].isInMonth).toBe(false);
    expect(week[4].date).toBe('2024-03-01');
  });

  it('accepts options with optional single or range selection and constraints', () => {
    const clock: MonthGridOptions['clock'] = { today: () => d('2024-03-10') };
    const minimal: MonthGridOptions = { year: 2024, month: 3, clock };
    const single: MonthGridOptions = {
      ...minimal,
      selection: { selected: d('2024-03-05') },
      constraints: { min: d('2024-03-01'), disabled: [d('2024-03-02')] },
    };
    const range: MonthGridOptions = {
      ...minimal,
      selection: { start: d('2024-03-05'), end: null },
      constraints: { disabled: (x) => x === d('2024-03-09') },
    };

    expect(minimal.selection).toBeUndefined();
    expect(minimal.constraints).toBeUndefined();
    expect(minimal.clock.today()).toBe('2024-03-10');
    expect(single.selection).toEqual({ selected: '2024-03-05' });
    expect(range.selection).toEqual({ start: '2024-03-05', end: null });
    expect(typeof range.constraints?.disabled).toBe('function');
  });
});