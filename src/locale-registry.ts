import type { CalendarLocale, LocaleCode } from "./locale-types.js";
import { UnsupportedLocaleError } from "./errors.js";
import { en } from "./locales/en.js";
import { pl } from "./locales/pl.js";

const registry: Readonly<Record<LocaleCode, CalendarLocale>> = Object.freeze({
  pl,
  en,
});

/**
 * The locale codes supported by the calendar.
 */
export const availableLocales: readonly LocaleCode[] = Object.freeze([
  "pl",
  "en",
] as LocaleCode[]);

/**
 * Type guard: true when `code` is a supported locale code.
 */
export function isSupportedLocale(code: unknown): code is LocaleCode {
  return (
    typeof code === "string" &&
    Object.prototype.hasOwnProperty.call(registry, code)
  );
}

/**
 * Returns the locale registered for `code`.
 *
 * @throws UnsupportedLocaleError when `code` is not a supported locale.
 */
export function getLocale(code: string): CalendarLocale {
  if (!isSupportedLocale(code)) {
    throw new UnsupportedLocaleError(code, availableLocales);
  }
  return registry[code];
}