import type { Clock } from "./types.js";
import type { CalendarLocale, LocaleCode } from "./locale-types.js";
import type { MonthGridOptions } from "./month-grid-types.js";

/**
 * Options for rendering a month grid into a DOM container.
 *
 * The target month (`year`, `month`), the optional `selection` (single or
 * range state) and the optional `constraints` reuse the exact field types of
 * MonthGridOptions, so the renderer can pass them straight to getMonthGrid.
 */
export interface RenderMonthGridOptions {
  /** The full year of the target month, e.g. 2024. */
  readonly year: MonthGridOptions["year"];
  /** The target month number, 1 (January) through 12 (December). */
  readonly month: MonthGridOptions["month"];
  /** Optional selection state, in single or range mode. */
  readonly selection?: MonthGridOptions["selection"];
  /** Optional constraints restricting which dates are enabled. */
  readonly constraints?: MonthGridOptions["constraints"];
  /** A locale code or a full locale object used for headings and weekday names. */
  readonly locale: LocaleCode | CalendarLocale;
  /** Optional source of today's date; the renderer falls back to the system clock. */
  readonly clock?: Clock;
}

/**
 * Signature of the function that renders a month grid into a container element.
 */
export type RenderMonthGrid = (
  container: HTMLElement,
  options: RenderMonthGridOptions,
) => void;

/** Name of the attribute holding a day cell's calendar date ("YYYY-MM-DD"). */
export const DATE_ATTRIBUTE = "data-date" as const;

/** Name of the attribute marking day cells outside the displayed month. */
export const OUTSIDE_MONTH_ATTRIBUTE = "data-outside-month" as const;

/** Name of the ARIA role attribute. */
export const ROLE_ATTRIBUTE = "role" as const;

/** Value of the ARIA role applied to the grid element. */
export const GRID_ROLE = "grid" as const;

/**
 * Attribute names and role value used by the DOM month grid renderer.
 */
export const DOM_RENDER_ATTRIBUTES = {
  date: DATE_ATTRIBUTE,
  outsideMonth: OUTSIDE_MONTH_ATTRIBUTE,
  role: ROLE_ATTRIBUTE,
  gridRole: GRID_ROLE,
} as const;