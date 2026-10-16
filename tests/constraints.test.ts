import { describe, it, expect } from 'vitest';
import { isDateDisabled } from '../src/constraints';

type D = Parameters<typeof isDateDisabled>[0];
const d = (s: string) => s as D;

describe('isDateDisabled', () => {
  it('applies inclusive min/max bounds and imposes no restriction when constraints are missing', () => {
    expect(isDateDisabled(d('2024-01-15'))).toBe(false);
    expect(isDateDisabled(d('2024-01-15'), {})).toBe(false);

    const constraints = { min: d('2024-01-10'), max: d('2024-01-20') };
    expect(isDateDisabled(d('2024-01-09'), constraints)).toBe(true);
    expect(isDateDisabled(d('2024-01-10'), constraints)).toBe(false);
    expect(isDateDisabled(d('2024-01-15'), constraints)).toBe(false);
    expect(isDateDisabled(d('2024-01-20'), constraints)).toBe(false);
    expect(isDateDisabled(d('2024-01-21'), constraints)).toBe(true);

    expect(isDateDisabled(d('2023-01-01'), { max: d('2024-01-01') })).toBe(false);
    expect(isDateDisabled(d('2025-01-01'), { min: d('2024-01-01') })).toBe(false);
  });

  it('disables dates listed in a disabled array', () => {
    const constraints = { disabled: [d('2024-02-01'), d('2024-02-14')] };
    expect(isDateDisabled(d('2024-02-01'), constraints)).toBe(true);
    expect(isDateDisabled(d('2024-02-14'), constraints)).toBe(true);
    expect(isDateDisabled(d('2024-02-02'), constraints)).toBe(false);
    expect(isDateDisabled(d('2024-02-02'), { disabled: [] })).toBe(false);

    // array combined with bounds: either condition disables
    const combined = { min: d('2024-02-01'), disabled: [d('2024-02-14')] };
    expect(isDateDisabled(d('2024-01-31'), combined)).toBe(true);
    expect(isDateDisabled(d('2024-02-14'), combined)).toBe(true);
    expect(isDateDisabled(d('2024-02-15'), combined)).toBe(false);
  });

  it('uses a disabled predicate, only treating a true result as disabled, and skips it when out of bounds', () => {
    const received: string[] = [];
    const predicate = (date: D) => {
      received.push(date);
      return date === d('2024-03-05');
    };

    expect(isDateDisabled(d('2024-03-05'), { disabled: predicate })).toBe(true);
    expect(isDateDisabled(d('2024-03-06'), { disabled: predicate })).toBe(false);
    expect(received).toEqual(['2024-03-05', '2024-03-06']);

    // truthy non-true values do not disable
    const truthy = (() => 1) as unknown as (date: D) => boolean;
    expect(isDateDisabled(d('2024-03-05'), { disabled: truthy })).toBe(false);

    // out-of-range dates are disabled without consulting the predicate
    received.length = 0;
    const result = isDateDisabled(d('2024-03-01'), {
      min: d('2024-03-02'),
      disabled: predicate,
    });
    expect(result).toBe(true);
    expect(received).toEqual([]);
  });
});