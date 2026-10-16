import { describe, it, expect } from 'vitest';
import { compareDates, isBefore, isAfter, isEqual, clampDate } from '../src/compare';

describe('compare', () => {
  it('compares dates and exposes boolean helpers', () => {
    expect(compareDates('2020-01-01', '2020-01-02')).toBe(-1);
    expect(compareDates('2020-01-02', '2020-01-01')).toBe(1);
    expect(compareDates('2020-02-29', '2020-02-29')).toBe(0);
    expect(compareDates('1969-12-31', '1970-01-01')).toBe(-1);
    expect(compareDates('0000-01-01', '9999-12-31')).toBe(-1);
    expect(isBefore('2020-01-01', '2020-01-02')).toBe(true);
    expect(isBefore('2020-01-01', '2020-01-01')).toBe(false);
    expect(isAfter('2021-01-01', '2020-12-31')).toBe(true);
    expect(isAfter('2020-01-01', '2020-01-01')).toBe(false);
    expect(isEqual('2020-01-01', '2020-01-01')).toBe(true);
    expect(isEqual('2020-01-01', '2020-01-02')).toBe(false);
  });

  it('clamps dates within inclusive bounds', () => {
    const bounds = { min: '2020-01-10', max: '2020-01-20' };
    expect(clampDate('2020-01-05', bounds)).toBe('2020-01-10');
    expect(clampDate('2020-01-25', bounds)).toBe('2020-01-20');
    expect(clampDate('2020-01-15', bounds)).toBe('2020-01-15');
    expect(clampDate('2020-01-10', bounds)).toBe('2020-01-10');
    expect(clampDate('2020-01-20', bounds)).toBe('2020-01-20');
    expect(clampDate('2020-01-05', { max: '2020-01-20' })).toBe('2020-01-05');
    expect(clampDate('2020-01-25', { min: '2020-01-10' })).toBe('2020-01-25');
    expect(clampDate('2020-01-25')).toBe('2020-01-25');
    expect(clampDate('2020-01-25', { min: '2020-01-30', max: '2020-01-30' })).toBe('2020-01-30');
  });

  it('throws on invalid inputs and inverted bounds', () => {
    expect(() => compareDates('2020-02-30', '2020-01-01')).toThrow();
    expect(() => compareDates('2020-01-01', 'bad')).toThrow();
    expect(() => isEqual('2020-1-1', '2020-01-01')).toThrow();
    expect(() => clampDate('nope', {})).toThrow();
    expect(() => clampDate('2020-01-01', { min: 'nope' })).toThrow();
    expect(() => clampDate('2020-01-01', { max: '2020-13-01' })).toThrow();
    expect(() => clampDate('2020-01-15', { min: '2020-02-01', max: '2020-01-01' })).toThrow(RangeError);
  });
});