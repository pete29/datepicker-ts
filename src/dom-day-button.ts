import { isEqual } from "./compare";
import { isDateDisabled } from "./constraints";
import { DATE_ATTRIBUTE, OUTSIDE_MONTH_ATTRIBUTE } from "./dom-render-types";
import { formatFullDate } from "./locale-format";
import type { MonthGridDay } from "./month-grid-types";
import { isDateSelected } from "./selection-match";
import type {
  DateConstraints,
  RangeSelectionState,
  SingleSelectionState,
} from "./selection-types";
import type { Clock } from "./types";

/**
 * Rendering context needed to decide the state of a day button.
 */
export interface DayButtonContext {
  /** Source of the current date, used for aria-current. */
  readonly clock: Clock;
  /** Optional selection state, in single or range mode. */
  readonly selection?: SingleSelectionState | RangeSelectionState | null;
  /** Optional constraints used to decide whether the day is disabled. */
  readonly constraints?: DateConstraints;
}

/**
 * Builds a gridcell <td> containing a <button type="button"> for one day.
 */
export function createDayButton(
  document: Document,
  day: MonthGridDay,
  locale: string,
  context: DayButtonContext,
): HTMLTableCellElement {
  const cell = document.createElement("td");
  cell.setAttribute("role", "gridcell");

  const button = document.createElement("button");
  button.setAttribute("type", "button");
  button.setAttribute(DATE_ATTRIBUTE, day.date);
  button.setAttribute("aria-label", formatFullDate(day.date, locale));
  button.textContent = String(Number(day.date.slice(8, 10)));

  const selected =
    day.isSelected === true || isDateSelected(day.date, context.selection);
  if (selected) {
    button.setAttribute("aria-selected", "true");
  }

  const today =
    day.isToday === true || isEqual(day.date, context.clock.today());
  if (today) {
    button.setAttribute("aria-current", "date");
  }

  const disabled =
    day.isDisabled === true || isDateDisabled(day.date, context.constraints);
  if (disabled) {
    button.setAttribute("disabled", "");
    button.setAttribute("aria-disabled", "true");
  }

  if (!day.isInMonth) {
    button.setAttribute(OUTSIDE_MONTH_ATTRIBUTE, "true");
  }

  cell.appendChild(button);
  return cell;
}