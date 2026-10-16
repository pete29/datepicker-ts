import { describe, it, expect } from 'vitest';
import { InvalidDateError, UnsupportedLocaleError } from '../src/errors';

describe('InvalidDateError', () => {
  it('keeps the raw input, sets name, and stays an Error/InvalidDateError instance', () => {
    const input = { year: 2024, month: 13 };
    const err = new InvalidDateError(input);

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(InvalidDateError);
    expect(err.name).toBe('InvalidDateError');
    expect(err.input).toBe(input);
    expect(err.message).toBe('Invalid calendar date: {"year":2024,"month":13}');

    const custom = new InvalidDateError('x', 'custom message');
    expect(custom.message).toBe('custom message');
    expect(custom.input).toBe('x');
  });

  it('describes different input kinds in the default message', () => {
    expect(new InvalidDateError('2024-02-30').message).toBe('Invalid calendar date: "2024-02-30"');
    expect(new InvalidDateError(undefined).message).toBe('Invalid calendar date: undefined');
    expect(new InvalidDateError(null).message).toBe('Invalid calendar date: null');
    expect(new InvalidDateError(NaN).message).toBe('Invalid calendar date: NaN');
    expect(new InvalidDateError(10n).message).toBe('Invalid calendar date: 10n');
    expect(new InvalidDateError(Symbol('s')).message).toBe('Invalid calendar date: Symbol(s)');

    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(new InvalidDateError(circular).message).toBe('Invalid calendar date: [object Object]');
  });
});

describe('UnsupportedLocaleError', () => {
  it('uses default supported locales, copies custom ones, and keeps the locale', () => {
    const err = new UnsupportedLocaleError('de');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(UnsupportedLocaleError);
    expect(err.name).toBe('UnsupportedLocaleError');
    expect(err.locale).toBe('de');
    expect(err.supported).toEqual(['pl', 'en']);
    expect(err.message).toBe('Unsupported locale: "de". Supported locales: "pl", "en".');

    const list = ['fr', 'es'];
    const custom = new UnsupportedLocaleError(42, list);
    list.push('it');
    expect(custom.locale).toBe(42);
    expect(custom.supported).toEqual(['fr', 'es']);
    expect(custom.supported).not.toBe(list);
    expect(custom.message).toBe('Unsupported locale: 42. Supported locales: "fr", "es".');
  });
});