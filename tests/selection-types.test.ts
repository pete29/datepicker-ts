import { describe, it, expect } from 'vitest';
import { createEmptySingleSelection, createEmptyRangeSelection } from '../src/selection-types';

describe('selection-types', () => {
  it('createEmptySingleSelection returns a state with selected set to null', () => {
    const state = createEmptySingleSelection();
    expect(state).toEqual({ selected: null });
    expect(state.selected).toBeNull();
  });

  it('createEmptyRangeSelection returns a state with start and end set to null', () => {
    const state = createEmptyRangeSelection();
    expect(state).toEqual({ start: null, end: null });
    expect(state.start).toBeNull();
    expect(state.end).toBeNull();
  });

  it('returns a fresh object on every call', () => {
    expect(createEmptySingleSelection()).not.toBe(createEmptySingleSelection());
    expect(createEmptyRangeSelection()).not.toBe(createEmptyRangeSelection());
  });
});