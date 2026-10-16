export type { CalendarDate, Clock, Weekday } from "./types.js";

export { InvalidDateError, UnsupportedLocaleError } from "./errors.js";

export {
  daysInMonth,
  fromDayNumber,
  isLeapYear,
  isValidDate,
  parseDate,
  toDayNumber,
} from "./parse.js";

export { addDays, daysBetween, subtractDays } from "./days.js";

export { addMonths, subtractMonths } from "./months.js";

export {
  clampDate,
  compareDates,
  isAfter,
  isBefore,
  isEqual,
} from "./compare.js";
export type { ClampBounds } from "./compare.js";

export { getWeekday, startOfWeek } from "./weekday.js";

export { fixedClock, systemClock } from "./clock.js";
export type { SystemClockOptions } from "./clock.js";

export type {
  DateConstraints,
  DisabledDates,
  RangeSelectionState,
  SelectionMode,
  SingleSelectionState,
} from "./selection-types.js";
export {
  createEmptyRangeSelection,
  createEmptySingleSelection,
} from "./selection-types.js";

export { isDateDisabled } from "./constraints.js";

export { selectSingle } from "./single-selection.js";

export { selectRange } from "./range-selection.js";

export { getMonthGrid } from "./month-grid.js";
export type {
  MonthGridDay,
  MonthGridOptions,
  MonthGridWeek,
} from "./month-grid-types.js";

export { renderMonthGrid } from "./dom-render.js";
export type { RenderMonthGridOptions } from "./dom-render-types.js";

export { moveFocus } from "./keyboard-navigation.js";
export type {
  FocusMoveFunction,
  NavigationKey,
  SearchDirection,
} from "./keyboard-types.js";
export type { KeyboardTarget } from "./keyboard-target.js";

export type { CalendarLocale, LocaleCode } from "./locale-types.js";

export { pl } from "./locales/pl.js";
export { en } from "./locales/en.js";

export {
  availableLocales,
  getLocale,
  isSupportedLocale,
} from "./locale-registry.js";

export {
  formatFullDate,
  formatMonthHeading,
  getMonthNames,
  getWeekdayNames,
} from "./locale-format.js";