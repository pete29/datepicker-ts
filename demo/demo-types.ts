import type {
  CalendarDate,
  Clock,
  LocaleCode,
  RangeSelectionState,
  SelectionMode,
  SingleSelectionState,
} from "../src/index.js";

/**
 * The languages the demo can be displayed in.
 */
export type DemoLanguage = Extract<LocaleCode, "pl" | "en">;

/**
 * The complete state of the demo at a point in time.
 */
export interface DemoState {
  /** The year of the month currently shown. */
  readonly viewYear: number;
  /** The month currently shown, 1 (January) through 12 (December). */
  readonly viewMonth: number;
  /** Whether the demo selects a single date or a range. */
  readonly mode: SelectionMode;
  /** The current selection; its shape matches the selection mode. */
  readonly selection: SingleSelectionState | RangeSelectionState;
  /** The date that currently holds keyboard focus. */
  readonly focused: CalendarDate;
  /** The language the demo is displayed in. */
  readonly language: DemoLanguage;
}

/**
 * Options for mounting the demo.
 */
export interface DemoOptions {
  /** The injected source of the current date. */
  readonly clock: Clock;
  /** The initial language; the demo chooses a default when omitted. */
  readonly initialLanguage?: DemoLanguage;
}

/**
 * The handle returned when the demo is mounted.
 */
export interface DemoController {
  /** Returns the current demo state. */
  getState(): DemoState;
  /** Shows the month before the viewed one. */
  goToPreviousMonth(): void;
  /** Shows the month after the viewed one. */
  goToNextMonth(): void;
  /** Switches the selection mode. */
  setMode(mode: SelectionMode): void;
  /** Selects the given date according to the current mode. */
  selectDate(date: CalendarDate): void;
  /** Handles a keyboard key (a `KeyboardEvent.key` value). */
  handleKey(key: string): void;
  /** Changes the display language. */
  setLanguage(language: DemoLanguage): void;
  /** Unmounts the demo and releases its resources. */
  destroy(): void;
}