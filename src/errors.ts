import type { LocaleCode } from "./locale-types.js";

export class InvalidDateError extends Error {
  /** The value that was rejected, kept exactly as it was received. */
  readonly input: unknown;

  constructor(input: unknown, message?: string) {
    super(message ?? `Invalid calendar date: ${describeInput(input)}`);
    this.name = "InvalidDateError";
    this.input = input;
    // Keep `instanceof` working when compiled to older targets.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const DEFAULT_SUPPORTED_LOCALES: readonly LocaleCode[] = ["pl", "en"];

export class UnsupportedLocaleError extends Error {
  /** The locale that was requested, kept exactly as it was received. */
  readonly locale: unknown;

  /** The locale codes that are supported. */
  readonly supported: readonly string[];

  constructor(
    locale: unknown,
    supported: readonly string[] = DEFAULT_SUPPORTED_LOCALES,
  ) {
    super(
      `Unsupported locale: ${describeInput(locale)}. Supported locales: ${supported
        .map((code) => JSON.stringify(code))
        .join(", ")}.`,
    );
    this.name = "UnsupportedLocaleError";
    this.locale = locale;
    this.supported = [...supported];
    // Keep `instanceof` working when compiled to older targets.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function describeInput(input: unknown): string {
  if (typeof input === "string") {
    return JSON.stringify(input);
  }
  if (typeof input === "symbol") {
    return input.toString();
  }
  if (typeof input === "bigint") {
    return `${input.toString()}n`;
  }
  if (typeof input === "object" && input !== null) {
    try {
      const json = JSON.stringify(input);
      return json === undefined ? Object.prototype.toString.call(input) : json;
    } catch {
      return Object.prototype.toString.call(input);
    }
  }
  return String(input);
}