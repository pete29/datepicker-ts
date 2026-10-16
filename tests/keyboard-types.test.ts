import { describe, it, expect } from 'vitest';
import { isNavigationKey } from '../src/keyboard-types';

describe('isNavigationKey', () => {
  it('returns true for every supported navigation key', () => {
    const keys = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'PageUp',
      'PageDown',
      'Home',
      'End',
    ];
    for (const key of keys) {
      expect(isNavigationKey(key)).toBe(true);
    }
  });

  it('returns false for unsupported strings, including case and whitespace variants', () => {
    const keys = [
      '',
      'Enter',
      ' ',
      'Escape',
      'Tab',
      'a',
      'arrowleft',
      'ARROWLEFT',
      'home',
      'Home ',
      ' End',
      'PageUp\n',
      'Arrow',
    ];
    for (const key of keys) {
      expect(isNavigationKey(key)).toBe(false);
    }
  });

  it('returns false for non-string values without throwing', () => {
    const values: unknown[] = [
      undefined,
      null,
      0,
      1,
      true,
      false,
      {},
      [],
      ['Home'],
      { toString: () => 'Home' },
      Symbol('Home'),
      () => 'Home',
      new String('Home'),
    ];
    for (const value of values) {
      expect(isNavigationKey(value)).toBe(false);
    }
  });
});