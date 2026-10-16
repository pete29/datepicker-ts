import type { CalendarDate } from "./types";
import type { DateConstraints } from "./selection-types";
import { isNavigationKey } from "./keyboard-types";
import { getKeyboardTarget } from "./keyboard-target";
import { findNearestEnabledDate } from "./focus-search";

/**
 * Moves the focused date in response to a keyboard key.
 *
 * - Unknown keys return the original focused date.
 * - Known keys compute a raw target and a search direction, then resolve the
 *   target to the nearest enabled date under the given constraints.
 * - When no enabled date can be found, the original focused date is returned.
 *
 * Pure: inputs are never mutated.
 */
export function moveFocus(
  focused: CalendarDate,
  key: string,
  constraints: DateConstraints,
): CalendarDate {
  if (!isNavigationKey(key)) {
    return focused;
  }

  const { target, direction } = getKeyboardTarget(focused, key);

  const resolved = findNearestEnabledDate(target, direction, constraints);

  if (resolved === null) {
    return focused;
  }

  return resolved;
}