import { describe, it, expect } from 'vitest';
import { createDayButton } from '../src/dom-day-button';

class FakeElement {
  tagName: string;
  attrs = new Map<string, string>();
  children: FakeElement[] = [];
  textContent = '';
  constructor(tag: string) {
    this.tagName = tag.toUpperCase();
  }
  setAttribute(name: string, value: string) {
    this.attrs.set(name, value);
  }
  getAttribute(name: string) {
    return this.attrs.has(name) ? this.attrs.get(name)! : null;
  }
  hasAttribute(name: string) {
    return this.attrs.has(name);
  }
  appendChild(child: FakeElement) {
    this.children.push(child);
    return child;
  }
}

const fakeDocument = {
  createElement: (tag: string) => new FakeElement(tag),
} as any;

function build(day: Record<string, unknown>, context: Record<string, unknown>) {
  const cell = createDayButton(
    fakeDocument,
    day as any,
    'en',
    context as any,
  ) as unknown as FakeElement;
  return { cell, button: cell.children[0] };
}

const clock = (d: string) => ({ today: () => d });

const plainDay = {
  date: '2024-03-05',
  isInMonth: true,
  isToday: false,
  isSelected: false,
  isDisabled: false,
};

describe('createDayButton', () => {
  it('builds a gridcell td containing a typed button with date, label and day number', () => {
    const { cell, button } = build(plainDay, { clock: clock('2024-01-01') });
    expect(cell.tagName).toBe('TD');
    expect(cell.getAttribute('role')).toBe('gridcell');
    expect(cell.children).toHaveLength(1);
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('data-date')).toBe('2024-03-05');
    expect(button.textContent).toBe('5');
    expect(typeof button.getAttribute('aria-label')).toBe('string');
    expect(button.getAttribute('aria-label')!.length).toBeGreaterThan(0);
    expect(button.hasAttribute('aria-selected')).toBe(false);
    expect(button.hasAttribute('aria-current')).toBe(false);
    expect(button.hasAttribute('disabled')).toBe(false);
    expect(button.hasAttribute('aria-disabled')).toBe(false);
    expect(button.hasAttribute('data-outside-month')).toBe(false);
  });

  it('applies state attributes from the day flags', () => {
    const { button } = build(
      {
        date: '2024-02-29',
        isInMonth: false,
        isToday: true,
        isSelected: true,
        isDisabled: true,
      },
      { clock: clock('2000-01-01') },
    );
    expect(button.textContent).toBe('29');
    expect(button.getAttribute('aria-selected')).toBe('true');
    expect(button.getAttribute('aria-current')).toBe('date');
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('data-outside-month')).toBe('true');
  });

  it('derives selected, current and disabled state from the context when flags are false', () => {
    const { button } = build(plainDay, {
      clock: clock('2024-03-05'),
      selection: { start: '2024-03-01', end: '2024-03-10' },
      constraints: { disabled: ['2024-03-05'] },
    });
    expect(button.getAttribute('aria-selected')).toBe('true');
    expect(button.getAttribute('aria-current')).toBe('date');
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.getAttribute('aria-disabled')).toBe('true');

    const other = build(plainDay, {
      clock: clock('2024-03-06'),
      selection: { selected: '2024-03-07' },
      constraints: { min: '2024-03-01', max: '2024-03-31' },
    }).button;
    expect(other.hasAttribute('aria-selected')).toBe(false);
    expect(other.hasAttribute('aria-current')).toBe(false);
    expect(other.hasAttribute('disabled')).toBe(false);
  });
});