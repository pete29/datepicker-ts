import type { CalendarDate } from "./types";
import type { DateConstraints } from "./selection-types";

/**
 * The keys that move focus within a calendar grid.
 */
export type NavigationKey =
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "ArrowDown"
  | "PageUp"
  | "PageDown"
  | "Home"
  | "End";

/**
 * The direction in which to search for the nearest enabled date.
 */
export type SearchDirection = "backward" | "forward";

/**
 * Signature of a function that computes the next focused date for a key press.
 * The key is a plain string so that unknown keys can be passed in and handled.
 */
export type FocusMoveFunction = (
  focused: CalendarDate,
  key: string,
  constraints: DateConstraints,
) => CalendarDate;

const NAVIGATION_KEYS: readonly NavigationKey[] = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
];

/**
 * Type guard: returns true when the given value is a supported navigation key.
 */
export function isNavigationKey(key: unknown): key is NavigationKey {
  return (
    typeof key === "string" &&
    (NAVIGATION_KEYS as readonly string[]).includes(key)
  );
}