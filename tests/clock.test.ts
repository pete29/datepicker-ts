import { describe, it, expect } from 'vitest';
import { fixedClock, systemClock } from '../src/clock';

describe('fixedClock', () => {
  it('always returns the same validated date and rejects invalid dates at creation', () => {
    const clock = fixedClock('2024-02-29');
    expect(clock.today()).toBe('2024-02-29');
    expect(clock.today()).toBe(clock.today());
    expect(() => fixedClock('2023-02-29')).toThrow();
    expect(() => fixedClock('not-a-date')).toThrow();
  });
});

describe('systemClock', () => {
  it('formats the injected instant in the given time zone, defaulting to UTC', () => {
    // 2024-03-10T03:30:00Z
    const instant = Date.UTC(2024, 2, 10, 3, 30, 0);
    const now = () => instant;

    expect(systemClock({ now }).today()).toBe('2024-03-10');
    expect(systemClock({ now, timeZone: 'UTC' }).today()).toBe('2024-03-10');
    expect(systemClock({ now, timeZone: 'America/New_York' }).today()).toBe('2024-03-09');
    expect(systemClock({ now, timeZone: 'Asia/Tokyo' }).today()).toBe('2024-03-10');

    // Year boundary and zero padding of early years
    const nye = () => Date.UTC(2023, 11, 31, 23, 59, 59);
    expect(systemClock({ now: nye }).today()).toBe('2023-12-31');
    expect(systemClock({ now: nye, timeZone: 'Pacific/Auckland' }).today()).toBe('2024-01-01');
  });

  it('reads the clock on every call and fails fast on an invalid time zone', () => {
    let current = Date.UTC(2024, 0, 1, 12, 0, 0);
    const clock = systemClock({ now: () => current });
    expect(clock.today()).toBe('2024-01-01');
    current = Date.UTC(2024, 0, 2, 12, 0, 0);
    expect(clock.today()).toBe('2024-01-02');

    expect(() => systemClock({ timeZone: 'Not/AZone' })).toThrow();
  });
});