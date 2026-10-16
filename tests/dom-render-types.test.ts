import { describe, it, expect } from 'vitest';
import {
  DATE_ATTRIBUTE,
  OUTSIDE_MONTH_ATTRIBUTE,
  ROLE_ATTRIBUTE,
  GRID_ROLE,
  DOM_RENDER_ATTRIBUTES,
} from '../src/dom-render-types';

describe('dom-render-types', () => {
  it('exposes the expected attribute name and role constants', () => {
    expect(DATE_ATTRIBUTE).toBe('data-date');
    expect(OUTSIDE_MONTH_ATTRIBUTE).toBe('data-outside-month');
    expect(ROLE_ATTRIBUTE).toBe('role');
    expect(GRID_ROLE).toBe('grid');
  });

  it('DOM_RENDER_ATTRIBUTES maps keys to the individual constants', () => {
    expect(DOM_RENDER_ATTRIBUTES).toEqual({
      date: DATE_ATTRIBUTE,
      outsideMonth: OUTSIDE_MONTH_ATTRIBUTE,
      role: ROLE_ATTRIBUTE,
      gridRole: GRID_ROLE,
    });
    expect(Object.keys(DOM_RENDER_ATTRIBUTES).sort()).toEqual(
      ['date', 'gridRole', 'outsideMonth', 'role'],
    );
  });

  it('uses valid, distinct HTML attribute names', () => {
    const names = [DATE_ATTRIBUTE, OUTSIDE_MONTH_ATTRIBUTE, ROLE_ATTRIBUTE];
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) {
      expect(name).toMatch(/^[a-z][a-z-]*$/);
    }
  });
});