import { describe, it, expect } from 'vitest';
import { selectRange } from '../src/range-selection';

type Date_ = Parameters<typeof selectRange>[1];
type State = Parameters<typeof selectRange>[0];

const d = (s: string): Date_ => s as unknown as Date_;

describe('selectRange', () => {
  it('starts a new range when state is empty or already complete, without mutating input', () => {
    const empty: State = { start: null, end: null };
    expect(selectRange(empty, d('2024-01-10'))).toEqual({
      start: d('2024-01-10'),
      end: null,
    });

    const complete: State = { start: d('2024-01-01'), end: d('2024-01-05') };
    const snapshot = { ...complete };
    const result = selectRange(complete, d('2024-02-01'));
    expect(result).toEqual({ start: d('2024-02-01'), end: null });
    expect(complete).toEqual(snapshot);
  });

  it('sets the end when only a start exists, swapping if earlier and allowing same day', () => {
    const state: State = { start: d('2024-01-10'), end: null };
    expect(selectRange(state, d('2024-01-20'))).toEqual({
      start: d('2024-01-10'),
      end: d('2024-01-20'),
    });
    expect(selectRange(state, d('2024-01-05'))).toEqual({
      start: d('2024-01-05'),
      end: d('2024-01-10'),
    });
    expect(selectRange(state, d('2024-01-10'))).toEqual({
      start: d('2024-01-10'),
      end: d('2024-01-10'),
    });
    expect(state).toEqual({ start: d('2024-01-10'), end: null });
  });

  it('returns the same state for disabled dates and selects allowed ones under constraints', () => {
    const state: State = { start: d('2024-01-10'), end: null };

    expect(selectRange(state, d('2024-01-01'), { min: d('2024-01-05') })).toBe(state);
    expect(selectRange(state, d('2024-01-30'), { max: d('2024-01-20') })).toBe(state);
    expect(
      selectRange(state, d('2024-01-15'), { disabled: [d('2024-01-15')] }),
    ).toBe(state);
    expect(
      selectRange(state, d('2024-01-16'), { disabled: (x) => x === d('2024-01-16') }),
    ).toBe(state);

    expect(
      selectRange(state, d('2024-01-15'), {
        min: d('2024-01-05'),
        max: d('2024-01-20'),
        disabled: [d('2024-01-14')],
      }),
    ).toEqual({ start: d('2024-01-10'), end: d('2024-01-15') });
  });
});