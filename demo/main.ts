import {
  addMonths,
  createEmptyRangeSelection,
  createEmptySingleSelection,
  formatFullDate,
  isDateDisabled,
  isValidDate,
  moveFocus,
  renderMonthGrid,
  selectRange,
  selectSingle,
  subtractMonths,
} from "../src/index.js";
import type {
  CalendarDate,
  DateConstraints,
  RangeSelectionState,
  SelectionMode,
  SingleSelectionState,
} from "../src/index.js";
import { systemClock } from "../src/index.js";
import {
  DATE_ATTRIBUTE,
  OUTSIDE_MONTH_ATTRIBUTE,
} from "../src/dom-render-types.js";
import { isNavigationKey } from "../src/keyboard-types.js";
import type {
  DemoController,
  DemoLanguage,
  DemoOptions,
  DemoState,
} from "./demo-types.js";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const LANGUAGES: readonly DemoLanguage[] = ["pl", "en"];

const LABELS: Record<
  DemoLanguage,
  {
    previous: string;
    next: string;
    none: string;
    selected: string;
    mode: string;
    single: string;
    range: string;
    from: string;
    language: string;
  }
> = {
  en: {
    previous: "Previous",
    next: "Next",
    none: "No date selected",
    selected: "Selected",
    mode: "Mode",
    single: "Single",
    range: "Range",
    from: "Range start",
    language: "Language",
  },
  pl: {
    previous: "Poprzedni",
    next: "Następny",
    none: "Nie wybrano daty",
    selected: "Wybrano",
    mode: "Tryb",
    single: "Pojedynczy",
    range: "Zakres",
    from: "Początek zakresu",
    language: "Język",
  },
};

type AnySelection = SingleSelectionState | RangeSelectionState;

type SelectFunction = (
  state: unknown,
  date: CalendarDate,
  constraints?: DateConstraints,
) => AnySelection;

function pad(value: number, width: number): string {
  return String(value).padStart(width, "0");
}

function firstOfMonth(year: number, month: number): CalendarDate {
  return `${pad(year, 4)}-${pad(month, 2)}-01` as CalendarDate;
}

function yearOf(date: CalendarDate): number {
  return Number((date as string).slice(0, 4));
}

function monthOf(date: CalendarDate): number {
  return Number((date as string).slice(5, 7));
}

function emptySelection(mode: SelectionMode): AnySelection {
  return mode === "range"
    ? createEmptyRangeSelection()
    : createEmptySingleSelection();
}

function describeSelection(selection: AnySelection, language: DemoLanguage): string {
  const labels = LABELS[language];
  if ("selected" in selection) {
    if (selection.selected === null) {
      return labels.none;
    }
    return `${labels.selected}: ${formatFullDate(selection.selected, language)}`;
  }
  const { start, end } = selection;
  if (start === null) {
    return labels.none;
  }
  if (end === null) {
    return `${labels.from}: ${formatFullDate(start, language)}`;
  }
  return `${labels.selected}: ${formatFullDate(start, language)} – ${formatFullDate(end, language)}`;
}

export function mountDemo(root: HTMLElement, options: DemoOptions): DemoController {
  const { clock } = options;
  const doc = root.ownerDocument;

  const today = clock.today();
  // Dates before today are disabled.
  const constraints: DateConstraints = { min: today };

  let state: DemoState = {
    viewYear: yearOf(today),
    viewMonth: monthOf(today),
    mode: "single" as SelectionMode,
    selection: emptySelection("single"),
    focused: today,
    language: options.initialLanguage ?? "en",
  };

  const nav = doc.createElement("div");
  nav.setAttribute("data-demo", "nav");

  const previousButton = doc.createElement("button");
  previousButton.type = "button";
  previousButton.setAttribute("data-demo", "previous");

  const nextButton = doc.createElement("button");
  nextButton.type = "button";
  nextButton.setAttribute("data-demo", "next");

  const modeSelect = doc.createElement("select");
  modeSelect.setAttribute("data-demo", "mode");
  const singleOption = doc.createElement("option");
  singleOption.value = "single";
  const rangeOption = doc.createElement("option");
  rangeOption.value = "range";
  modeSelect.append(singleOption, rangeOption);

  const languageGroup = doc.createElement("div");
  languageGroup.setAttribute("data-demo", "language");
  languageGroup.setAttribute("role", "group");

  const languageButtons = new Map<DemoLanguage, HTMLButtonElement>();
  for (const code of LANGUAGES) {
    const button = doc.createElement("button");
    button.type = "button";
    button.setAttribute("data-demo", `language-${code}`);
    button.setAttribute("data-language", code);
    button.setAttribute("lang", code);
    button.textContent = code.toUpperCase();
    languageButtons.set(code, button);
    languageGroup.append(button);
  }

  nav.append(previousButton, nextButton, modeSelect, languageGroup);

  const gridContainer = doc.createElement("div");
  gridContainer.setAttribute("data-demo", "grid");

  const selectionText = doc.createElement("p");
  selectionText.setAttribute("data-demo", "selection");
  selectionText.setAttribute("aria-live", "polite");

  root.replaceChildren(nav, gridContainer, selectionText);

  function render(): void {
    const labels = LABELS[state.language];
    previousButton.textContent = labels.previous;
    nextButton.textContent = labels.next;
    singleOption.textContent = labels.single;
    rangeOption.textContent = labels.range;
    modeSelect.setAttribute("aria-label", labels.mode);
    modeSelect.value = state.mode;
    languageGroup.setAttribute("aria-label", labels.language);
    for (const [code, button] of languageButtons) {
      button.setAttribute("aria-pressed", code === state.language ? "true" : "false");
    }
    renderMonthGrid(gridContainer, {
      year: state.viewYear,
      month: state.viewMonth,
      clock,
      locale: state.language,
      selection: state.selection,
      constraints,
    } as Parameters<typeof renderMonthGrid>[1]);
    selectionText.textContent = describeSelection(state.selection, state.language);
  }

  function focusFocusedCell(): void {
    const matches = Array.from(
      gridContainer.querySelectorAll(`[${DATE_ATTRIBUTE}="${state.focused as string}"]`),
    );
    if (matches.length === 0) {
      return;
    }
    const inMonth = matches.find((element) => {
      const outside = element.getAttribute(OUTSIDE_MONTH_ATTRIBUTE);
      return outside === null || outside === "false";
    });
    const cell = (inMonth ?? matches[0]) as HTMLElement;
    const focusable = cell.matches("button")
      ? cell
      : ((cell.querySelector("button") as HTMLElement | null) ?? cell);
    focusable.focus();
  }

  function showMonthOf(date: CalendarDate): void {
    state = { ...state, viewYear: yearOf(date), viewMonth: monthOf(date) };
  }

  function goToPreviousMonth(): void {
    const target = subtractMonths(firstOfMonth(state.viewYear, state.viewMonth), 1);
    showMonthOf(target);
    render();
  }

  function goToNextMonth(): void {
    const target = addMonths(firstOfMonth(state.viewYear, state.viewMonth), 1);
    showMonthOf(target);
    render();
  }

  function selectDate(date: CalendarDate): void {
    if (isDateDisabled(date, constraints)) {
      return;
    }
    const select = (state.mode === "range" ? selectRange : selectSingle) as unknown as SelectFunction;
    const next = select(state.selection, date, constraints);
    state = {
      ...state,
      selection: next,
      focused: date,
      viewYear: yearOf(date),
      viewMonth: monthOf(date),
    };
    render();
  }

  function moveFocusByKey(key: string): void {
    const next = moveFocus(state.focused, key, constraints);
    const leavesMonth =
      yearOf(next) !== state.viewYear || monthOf(next) !== state.viewMonth;
    state = { ...state, focused: next };
    if (leavesMonth) {
      showMonthOf(next);
    }
    render();
    focusFocusedCell();
  }

  function isHandledKey(key: string): boolean {
    return isNavigationKey(key) || key === "Enter" || key === " ";
  }

  function handleKey(key: string): void {
    if (key === "Enter" || key === " ") {
      selectDate(state.focused);
      focusFocusedCell();
      return;
    }
    if (isNavigationKey(key)) {
      moveFocusByKey(key);
    }
  }

  function setMode(mode: SelectionMode): void {
    if (mode === state.mode) {
      return;
    }
    state = { ...state, mode, selection: emptySelection(mode) };
    render();
  }

  function setLanguage(language: DemoLanguage): void {
    if (language === state.language) {
      return;
    }
    // Re-rendering replaces the grid cells, so remember whether the focus
    // was inside the grid and put it back on the same date afterwards.
    const active = doc.activeElement;
    const hadGridFocus = active !== null && gridContainer.contains(active);
    state = { ...state, language };
    render();
    if (hadGridFocus) {
      focusFocusedCell();
    }
  }

  const onPrevious = (): void => goToPreviousMonth();
  const onNext = (): void => goToNextMonth();
  const onModeChange = (): void => {
    setMode(modeSelect.value === "range" ? "range" : "single");
  };
  const onLanguageClick = (event: Event): void => {
    const target = event.target as Element | null;
    const button = target?.closest?.("[data-language]");
    const value = button?.getAttribute("data-language");
    if (value === "pl" || value === "en") {
      setLanguage(value);
    }
  };
  const onGridClick = (event: Event): void => {
    const target = event.target as Element | null;
    const cell = target?.closest?.(`[${DATE_ATTRIBUTE}]`);
    const value = cell?.getAttribute(DATE_ATTRIBUTE);
    if (value && DATE_PATTERN.test(value)) {
      const date = value as CalendarDate;
      if (!isValidDate(date) || isDateDisabled(date, constraints)) {
        return;
      }
      selectDate(date);
    }
  };
  const onGridKeyDown = (event: KeyboardEvent): void => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (!isHandledKey(event.key)) {
      return;
    }
    event.preventDefault();
    handleKey(event.key);
  };

  previousButton.addEventListener("click", onPrevious);
  nextButton.addEventListener("click", onNext);
  modeSelect.addEventListener("change", onModeChange);
  languageGroup.addEventListener("click", onLanguageClick);
  gridContainer.addEventListener("click", onGridClick);
  gridContainer.addEventListener("keydown", onGridKeyDown);

  render();

  return {
    getState(): DemoState {
      return state;
    },
    goToPreviousMonth,
    goToNextMonth,
    setMode,
    selectDate,
    handleKey,
    setLanguage,
    destroy(): void {
      previousButton.removeEventListener("click", onPrevious);
      nextButton.removeEventListener("click", onNext);
      modeSelect.removeEventListener("change", onModeChange);
      languageGroup.removeEventListener("click", onLanguageClick);
      gridContainer.removeEventListener("click", onGridClick);
      gridContainer.removeEventListener("keydown", onGridKeyDown);
      root.replaceChildren();
    },
  };
}

if (typeof document !== "undefined") {
  const appRoot = document.getElementById("app");
  if (appRoot) {
    mountDemo(appRoot, { clock: systemClock() });
  }
}