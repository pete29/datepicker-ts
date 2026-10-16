import { describe, it, expect } from 'vitest';
import { selectSingle } from '../src/single-selection';

type Date_ = Parameters<typeof selectSingle>[1];
const d = (s: string): Date_ => s as unknown as Date_;

describe('selectSingle', () => {
  it('selects the date, replacing an earlier selection, without mutating input', () => {
    const empty = { selected: null };
    const first = selectSingle(empty, d('2024-05-10'));
    expect(first).toEqual({ selected: '2024-05-10' });
    expect(empty).toEqual({ selected: null });

    const prev = { selected: d('2024-05-01') };
    const next = selectSingle(prev, d('2024-05-10'), {});
    expect(next).toEqual({ selected: '2024-05-10' });
    expect(next).not.toBe(prev);
    expect(prev.selected).toBe('2024-05-01');
  });

  it('returns the same state reference when the date is disabled', () => {
    const state = { selected: d('2024-05-15') };

    expect(selectSingle(state, d('2024-05-01'), { min: d('2024-05-05') })).toBe(state);
    expect(selectSingle(state, d('2024-05-20'), { max: d('2024-05-19') })).toBe(state);
    expect(selectSingle(state, d('2024-05-10'), { disabled: [d('2024-05-10')] })).toBe(state);

    const seen: unknown[] = [];
    const result = selectSingle(state, d('2024-05-11'), {
      disabled: (x) => {
        seen.push(x);
        return true;
      },
    });
    expect(result).toBe(state);
    expect(seen).toEqual(['2024-05-11']);
  });

  it('selects allowed dates, including inclusive min/max boundaries', () => {
    const state = { selected: null };
    const constraints = {
      min: d('2024-05-05'),
      max: d('2024-05-20'),
      disabled: [d('2024-05-10')],
    };

    expect(selectSingle(state, d('2024-05-05'), constraints)).toEqual({ selected: '2024-05-05' });
    expect(selectSingle(state, d('2024-05-20'), constraints)).toEqual({ selected: '2024-05-20' });
    expect(selectSingle(state, d('2024-05-12'), constraints)).toEqual({ selected: '2024-05-12' });
    expect(selectSingle(state, d('2024-05-12'), { disabled: () => false })).toEqual({
      selected: '2024-05-12',
    });
  });
});