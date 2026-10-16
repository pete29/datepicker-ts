import { describe, it, expect } from 'vitest';
import { getKeyboardTarget } from '../src/keyboard-target';

import type { CalendarDate } from '../src/types';
import type { NavigationKey } from '../src/keyboard-types';

const d = (s: string): CalendarDate => s as CalendarDate;

describe('getKeyboardTarget', () => {
  it('maps each key to the expected target and search direction', () => {
    // 2024-05-15 is a Wednesday; its week runs 2024-05-13 (Mon) to 2024-05-19 (Sun)
    const focused = d('2024-05-15');
    const cases: Array<[NavigationKey, string, 'backward' | 'forward']> = [
      ['ArrowLeft', '2024-05-14', 'backward'],
      ['ArrowRight', '2024-05-16', 'forward'],
      ['ArrowUp', '2024-05-08', 'backward'],
      ['ArrowDown', '2024-05-22', 'forward'],
      ['PageUp', '2024-04-15', 'backward'],
      ['PageDown', '2024-06-15', 'forward'],
      ['Home', '2024-05-13', 'backward'],
      ['End', '2024-05-19', 'forward'],
    ];
    for (const [key, target, direction] of cases) {
      const result = getKeyboardTarget(focused, key);
      expect(result).toEqual({ target, direction });
    }
  });

  it('handles month clamping, boundaries, and Home/End on week edges', () => {
    expect(getKeyboardTarget(d('2024-03-31'), 'PageUp').target).toBe('2024-02-29');
    expect(getKeyboardTarget(d('2023-01-31'), 'PageDown').target).toBe('2023-02-28');
    expect(getKeyboardTarget(d('2024-01-15'), 'PageUp').target).toBe('2023-12-15');
    expect(getKeyboardTarget(d('2023-12-31'), 'ArrowRight').target).toBe('2024-01-01');
    expect(getKeyboardTarget(d('2024-03-01'), 'ArrowLeft').target).toBe('2024-02-29');
    // Monday: Home stays, End is +6
    expect(getKeyboardTarget(d('2024-05-13'), 'Home').target).toBe('2024-05-13');
    expect(getKeyboardTarget(d('2024-05-13'), 'End').target).toBe('2024-05-19');
    // Sunday: Home goes back 6, End stays
    expect(getKeyboardTarget(d('2024-05-19'), 'Home').target).toBe('2024-05-13');
    expect(getKeyboardTarget(d('2024-05-19'), 'End').target).toBe('2024-05-19');
    // Week spanning a year boundary
    expect(getKeyboardTarget(d('2024-01-01'), 'Home').target).toBe('2024-01-01');
    expect(getKeyboardTarget(d('2025-01-01'), 'Home').target).toBe('2024-12-30');
    expect(getKeyboardTarget(d('2025-01-01'), 'End').target).toBe('2025-01-05');
  });

  it('throws on unsupported keys and does not mutate input', () => {
    expect(() =>
      getKeyboardTarget(d('2024-05-15'), 'Enter' as unknown as NavigationKey),
    ).toThrow(RangeError);

    const focused = d('2024-05-15');
    const result = getKeyboardTarget(focused, 'ArrowDown');
    expect(focused).toBe('2024-05-15');
    expect(result.target).not.toBe(focused);
  });
});