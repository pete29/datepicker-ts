import { describe, it, expect } from 'vitest';
import { Weekday } from '../src/types';
import type { CalendarDate, Clock } from '../src/types';

describe('types', () => {
  it('maps weekday names to ISO 8601 numbers, Monday = 1 through Sunday = 7', () => {
    expect(Weekday).toEqual({
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    });
  });

  it('has seven distinct weekday values covering 1 to 7', () => {
    const values = Object.values(Weekday).sort((a, b) => a - b);
    expect(values).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(values).size).toBe(7);
  });

  it('allows a Clock to be implemented with a fixed CalendarDate', () => {
    const fixed = '2024-02-29' as CalendarDate;
    const clock: Clock = {
      today: () => fixed,
    };
    expect(clock.today()).toBe('2024-02-29');
    expect(typeof clock.today()).toBe('string');
  });
});