import { describe, it, expect } from 'vitest';
import { findNearestEnabledDate } from '../src/focus-search';

type D = NonNullable<ReturnType<typeof findNearestEnabledDate>>;
const d = (s: string): D => s as unknown as D;

describe('findNearestEnabledDate', () => {
  it('returns start when enabled, otherwise skips disabled dates in the given direction', () => {
    expect(findNearestEnabledDate(d('2024-02-10'), 'forward')).toBe('2024-02-10');
    expect(findNearestEnabledDate(d('2024-02-10'), 'backward', {})).toBe('2024-02-10');

    const disabled = [d('2024-02-28'), d('2024-02-29'), d('2024-03-01')];
    expect(findNearestEnabledDate(d('2024-02-28'), 'forward', { disabled })).toBe('2024-03-02');
    expect(findNearestEnabledDate(d('2024-03-01'), 'backward', { disabled })).toBe('2024-02-27');

    const calls: string[] = [];
    const pred = (x: string) => {
      calls.push(x);
      return x < '2024-03-05';
    };
    expect(
      findNearestEnabledDate(d('2024-03-01'), 'forward', {
        disabled: pred as unknown as (x: D) => boolean,
      }),
    ).toBe('2024-03-05');
    expect(calls.length).toBeGreaterThan(0);
  });

  it('handles starting points outside min/max and searches that pass a bound', () => {
    const min = d('2024-01-10');
    const max = d('2024-01-20');

    expect(findNearestEnabledDate(d('2024-01-05'), 'forward', { min, max })).toBe('2024-01-10');
    expect(findNearestEnabledDate(d('2024-01-05'), 'backward', { min, max })).toBeNull();
    expect(findNearestEnabledDate(d('2024-01-25'), 'backward', { min, max })).toBe('2024-01-20');
    expect(findNearestEnabledDate(d('2024-01-25'), 'forward', { min, max })).toBeNull();

    // start before min with min itself disabled -> next day
    expect(
      findNearestEnabledDate(d('2024-01-01'), 'forward', { min, max, disabled: [min] }),
    ).toBe('2024-01-11');
  });

  it('returns null when every date up to the bound is disabled and does not mutate inputs', () => {
    const max = d('2024-01-20');
    const min = d('2024-01-10');
    const disabled = [d('2024-01-19'), d('2024-01-20')];
    const snapshot = [...disabled];
    const constraints = { min, max, disabled };

    expect(findNearestEnabledDate(d('2024-01-19'), 'forward', constraints)).toBeNull();
    expect(
      findNearestEnabledDate(d('2024-01-12'), 'backward', {
        min,
        disabled: [d('2024-01-12'), d('2024-01-11'), d('2024-01-10')],
      }),
    ).toBeNull();

    expect(disabled).toEqual(snapshot);
    expect(constraints.min).toBe(min);
    expect(constraints.max).toBe(max);
  });
});