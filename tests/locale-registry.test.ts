import { describe, it, expect } from 'vitest';
import { availableLocales, isSupportedLocale, getLocale } from '../src/locale-registry';

describe('locale-registry', () => {
  it('exposes the supported locale codes as a frozen list and recognises them via isSupportedLocale', () => {
    expect([...availableLocales].sort()).toEqual(['en', 'pl']);
    expect(Object.isFrozen(availableLocales)).toBe(true);

    expect(isSupportedLocale('pl')).toBe(true);
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('de')).toBe(false);
    expect(isSupportedLocale('EN')).toBe(false);
    expect(isSupportedLocale('')).toBe(false);
    expect(isSupportedLocale(undefined)).toBe(false);
    expect(isSupportedLocale(null)).toBe(false);
    expect(isSupportedLocale(42)).toBe(false);
    expect(isSupportedLocale({})).toBe(false);
    // inherited object properties must not count as locales
    expect(isSupportedLocale('toString')).toBe(false);
    expect(isSupportedLocale('constructor')).toBe(false);
    expect(isSupportedLocale('__proto__')).toBe(false);
  });

  it('getLocale returns the locale matching the code, consistently', () => {
    const pl = getLocale('pl');
    const en = getLocale('en');
    expect(pl.code).toBe('pl');
    expect(en.code).toBe('en');
    expect(pl).not.toBe(en);
    expect(getLocale('pl')).toBe(pl);
    expect(getLocale('en')).toBe(en);
  });

  it('getLocale throws UnsupportedLocaleError carrying the input and supported codes', () => {
    let caught: any;
    try {
      getLocale('fr');
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(Error);
    expect(caught.name).toBe('UnsupportedLocaleError');
    expect(caught.locale).toBe('fr');
    expect([...caught.supported].sort()).toEqual(['en', 'pl']);
    expect(caught.message).toContain('"fr"');

    expect(() => getLocale('toString')).toThrow(/Unsupported locale/);
    expect(() => getLocale('')).toThrow(/Unsupported locale/);
  });
});