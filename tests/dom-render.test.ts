// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderMonthGrid } from '../src/dom-render';
import { fixedClock } from '../src/clock';

describe('renderMonthGrid', () => {
  it('renders a grid table with caption, weekday header and day cells, replacing prior content', () => {
    const container = document.createElement('div');
    container.innerHTML = '<p id="old">old</p><span>x</span>';
    document.body.appendChild(container);

    renderMonthGrid(container, {
      year: 2024,
      month: 3,
      locale: 'en',
      clock: fixedClock('2024-03-15'),
    });

    expect(container.children.length).toBe(1);
    expect(container.querySelector('#old')).toBeNull();

    const table = container.firstElementChild as HTMLElement;
    expect(table.tagName).toBe('TABLE');
    expect(table.getAttribute('role')).toBe('grid');
    expect(table.querySelector('caption')?.textContent).toContain('2024');
    expect(table.querySelectorAll('thead th[scope="col"]').length).toBe(7);

    const rows = table.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThanOrEqual(4);
    rows.forEach((row) => {
      expect(row.querySelectorAll('td[role="gridcell"]').length).toBe(7);
    });

    const march1 = table.querySelector('button[data-date="2024-03-01"]');
    expect(march1).not.toBeNull();
    expect(march1?.textContent).toBe('1');
    expect(march1?.hasAttribute('data-outside-month')).toBe(false);

    const today = table.querySelectorAll('button[aria-current="date"]');
    expect(today.length).toBe(1);
    expect(today[0].getAttribute('data-date')).toBe('2024-03-15');

    document.body.removeChild(container);
  });

  it('marks days outside the month and re-rendering replaces the previous table', () => {
    const container = document.createElement('div');
    const clock = fixedClock('2024-03-15');

    renderMonthGrid(container, { year: 2024, month: 3, locale: 'en', clock });
    renderMonthGrid(container, { year: 2024, month: 4, locale: 'en', clock });

    expect(container.querySelectorAll('table').length).toBe(1);

    const outside = container.querySelectorAll('button[data-outside-month="true"]');
    expect(outside.length).toBeGreaterThan(0);

    const inMonth = Array.from(container.querySelectorAll('button[data-date]')).filter(
      (b) => !b.hasAttribute('data-outside-month'),
    );
    expect(inMonth.length).toBe(30);
    inMonth.forEach((b) => {
      expect(b.getAttribute('data-date')!.startsWith('2024-04-')).toBe(true);
    });
  });

  it('throws for an unsupported locale without touching the container', () => {
    const container = document.createElement('div');
    container.innerHTML = '<p>keep</p>';

    expect(() =>
      renderMonthGrid(container, {
        year: 2024,
        month: 3,
        locale: 'xx' as never,
        clock: fixedClock('2024-03-15'),
      }),
    ).toThrow();

    expect(container.innerHTML).toBe('<p>keep</p>');
  });
});