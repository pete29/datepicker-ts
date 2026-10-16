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