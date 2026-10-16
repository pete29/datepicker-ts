import { describe, it, expect } from 'vitest';
import { InvalidDateError } from '../src/errors';

describe('InvalidDateError', () => {
  it('is an Error subclass with correct name, input, and prototype chain', () => {
    const input = { y: 2024 };
    const err = new InvalidDateError(input);
    expect(err).toBeInstanceOf(InvalidDateError);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('InvalidDateError');
    expect(err.input).toBe(input);
    expect(typeof err.stack).toBe('string');
  });

  it('builds default messages describing different input types', () => {
    expect(new InvalidDateError('2024-13-01').message).toBe('Invalid calendar date: "2024-13-01"');
    expect(new InvalidDateError(Symbol('x')).message).toBe('Invalid calendar date: Symbol(x)');
    expect(new InvalidDateError(10n).message).toBe('Invalid calendar date: 10n');
    expect(new InvalidDateError(null).message).toBe('Invalid calendar date: null');
    expect(new InvalidDateError(undefined).message).toBe('Invalid calendar date: undefined');
    expect(new InvalidDateError(NaN).message).toBe('Invalid calendar date: NaN');
    expect(new InvalidDateError({ a: 1 }).message).toBe('Invalid calendar date: {"a":1}');
    expect(new InvalidDateError([1, 2]).message).toBe('Invalid calendar date: [1,2]');

    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(new InvalidDateError(circular).message).toBe('Invalid calendar date: [object Object]');
  });

  it('uses a custom message when provided and keeps input untouched', () => {
    const err = new InvalidDateError('bad', 'custom message');
    expect(err.message).toBe('custom message');
    expect(err.input).toBe('bad');

    const empty = new InvalidDateError('bad', '');
    expect(empty.message).toBe('');
  });
});