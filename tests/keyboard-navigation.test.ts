import { describe, it, expect } from 'vitest';
import { moveFocus } from '../src/keyboard-navigation';

type CalendarDate = Parameters<typeof moveFocus>[0];
const d = (s: string) => s as CalendarDate;

describe('moveFocus', () => {
  it('returns the original focused date for unknown keys', () => {
    const focused = d('2024-01-31');
    expect(moveFocus(focused, 'Enter', {})).toBe(focused);
    expect(moveFocus(focused, 'a', {})).toBe(focused);
    expect(moveFocus(focused, 'arrowleft', {})).toBe(focused);
    expect(moveFocus(focused, '', { disabled: [d('2024-01-30')] })).toBe(focused);
  });

  it('moves focus according to each navigation key when unconstrained', () => {
    // 2024-01-31 is a Wednesday
    const focused = d('2024-01-31');
    expect(moveFocus(focused, 'ArrowLeft', {})).toBe('2024-01-30');
    expect(moveFocus(focused, 'ArrowRight', {})).toBe('2024-02-01');
    expect(moveFocus(focused, 'ArrowUp', {})).toBe('2024-01-24');
    expect(moveFocus(focused, 'ArrowDown', {})).toBe('2024-02-07');
    expect(moveFocus(focused, 'PageDown', {})).toBe('2024-02-29');
    expect(moveFocus(focused, 'PageUp', {})).toBe('2023-12-31');
    expect(moveFocus(focused, 'Home', {})).toBe('2024-01-29');
    expect(moveFocus(focused, 'End', {})).toBe('2024-02-04');
  });

  it('resolves to the nearest enabled date or falls back to the focused date', () => {
    const focused = d('2024-01-31');

    // Forward search skips disabled dates
    expect(
      moveFocus(focused, 'ArrowRight', {
        disabled: [d('2024-02-01'), d('2024-02-02')],
      }),
    ).toBe('2024-02-03');

    // Backward search for Home skips a disabled Monday
    expect(
      moveFocus(focused, 'Home', { disabled: (x) => x === '2024-01-29' }),
    ).toBe('2024-01-28');

    // Target beyond bounds in the search direction: focused date is returned
    expect(moveFocus(focused, 'ArrowRight', { max: focused })).toBe(focused);
    expect(moveFocus(focused, 'ArrowLeft', { min: focused })).toBe(focused);

    // Everything within bounds disabled: focused date is returned
    expect(
      moveFocus(focused, 'ArrowRight', {
        max: d('2024-02-02'),
        disabled: () => true,
      }),
    ).toBe(focused);
  });
});