import { formatMonthHeading, getWeekdayNames } from "./locale-format.js";

/**
 * Builds a <caption> element holding the localized month heading
 * (for example "March 2024" or "marzec 2024").
 *
 * @throws UnsupportedLocaleError when `locale` is not supported.
 * @throws InvalidDateError when `year` or `month` is not valid.
 */
export function createGridCaption(
  document: Document,
  year: number,
  month: number,
  locale: string,
): HTMLTableCaptionElement {
  const heading = formatMonthHeading(year, month, locale);
  const caption = document.createElement("caption");
  caption.textContent = heading;
  return caption;
}

/**
 * Builds a <thead> with a single row of <th scope="col"> cells holding the
 * localized short weekday names, Monday first.
 *
 * @throws UnsupportedLocaleError when `locale` is not supported.
 */
export function createWeekdayHeader(
  document: Document,
  locale: string,
): HTMLTableSectionElement {
  const names = getWeekdayNames(locale, "short");
  const thead = document.createElement("thead");
  const row = document.createElement("tr");

  for (const name of names) {
    const cell = document.createElement("th");
    cell.setAttribute("scope", "col");
    cell.textContent = name;
    row.appendChild(cell);
  }

  thead.appendChild(row);
  return thead;
}