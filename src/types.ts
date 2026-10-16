declare const calendarDateBrand: unique symbol;

/**
 * A calendar date in "YYYY-MM-DD" form.
 *
 * This is a branded string: a plain `string` is not assignable to it, so
 * values must come from a module that has validated them.
 */
export type CalendarDate = string & { readonly [calendarDateBrand]: "CalendarDate" };

/**
 * ISO 8601 weekday numbering: Monday = 1 through Sunday = 7.
 */
export const Weekday = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
} as const;

export type Weekday = (typeof Weekday)[keyof typeof Weekday];

/**
 * A source of the current calendar date. Injecting a Clock lets callers
 * substitute a fixed date in tests.
 */
export interface Clock {
  today(): CalendarDate;
}