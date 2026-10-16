import { describe, it, expect } from 'vitest';
import { createGridCaption, createWeekdayHeader } from '../src/dom-grid-header';

function makeDoc(): Document {
  const make = (tag: string) => {
    const el: any = {
      tagName: tag.toUpperCase(),
      children: [] as any[],
      attributes: {} as Record<string, string>,
      textContent: "",
      setAttribute(name: string, value: string) {
        this.attributes[name] = value;
      },
      getAttribute(name: string) {
        return this.attributes[name];
      },
      appendChild(child: any) {
        this.children.push(child);
        return child;
      },
    };
    return el;
  };
  return { createElement: make } as unknown as Document;
}

describe('dom-grid-header', () => {
  it('createGridCaption builds a caption element containing a heading with the year', () => {
    const doc = makeDoc();
    const caption: any = createGridCaption(doc, 2024, 3, 'en');
    expect(caption.tagName).toBe('CAPTION');
    expect(typeof caption.textContent).toBe('string');
    expect(caption.textContent).toContain('2024');
  });

  it('createWeekdayHeader builds a thead with a single row of th scope=col cells', () => {
    const doc = makeDoc();
    const thead: any = createWeekdayHeader(doc, 'en');
    expect(thead.tagName).toBe('THEAD');
    expect(thead.children).toHaveLength(1);
    const row = thead.children[0];
    expect(row.tagName).toBe('TR');
    expect(row.children).toHaveLength(7);
    for (const cell of row.children) {
      expect(cell.tagName).toBe('TH');
      expect(cell.getAttribute('scope')).toBe('col');
      expect(cell.textContent.length).toBeGreaterThan(0);
    }
  });

  it('propagates errors for unsupported locales and invalid months', () => {
    const doc = makeDoc();
    expect(() => createWeekdayHeader(doc, 'xx-not-a-locale')).toThrow();
    expect(() => createGridCaption(doc, 2024, 3, 'xx-not-a-locale')).toThrow();
    expect(() => createGridCaption(doc, 2024, 13, 'en')).toThrow();
  });
});