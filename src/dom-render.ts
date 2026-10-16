import { systemClock } from "./clock";
import { createDayButton } from "./dom-day-button";
import { createGridCaption, createWeekdayHeader } from "./dom-grid-header";
import { GRID_ROLE, ROLE_ATTRIBUTE } from "./dom-render-types";
import type { RenderMonthGridOptions } from "./dom-render-types";
import { getLocale } from "./locale-registry";
import { getMonthGrid } from "./month-grid";

/**
 * Renders a month grid as a <table role="grid"> into the container,
 * replacing any previous content.
 */
export function renderMonthGrid(
  container: HTMLElement,
  options: RenderMonthGridOptions,
): void {
  const { year, month, selection, constraints } = options;
  const clock = options.clock ?? systemClock();
  const localeCode = options.locale as string;

  // Resolve the locale first so unsupported codes throw before any DOM work.
  getLocale(localeCode);

  const weeks = getMonthGrid({ year, month, clock, selection, constraints });

  // Use the real (global) document, as provided by jsdom in tests.
  const table = document.createElement("table");
  table.setAttribute(ROLE_ATTRIBUTE, GRID_ROLE);

  table.appendChild(createGridCaption(document, year, month, localeCode));
  table.appendChild(createWeekdayHeader(document, localeCode));

  const tbody = document.createElement("tbody");
  const context = { clock, selection, constraints };

  for (const week of weeks) {
    const row = document.createElement("tr");
    for (const day of week) {
      row.appendChild(createDayButton(document, day, localeCode, context));
    }
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  container.replaceChildren(table);
}