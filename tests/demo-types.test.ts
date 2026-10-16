// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { DemoState, DemoOptions, DemoController, DemoLanguage } from '../demo/demo-types';
import type { CalendarDate, Clock } from '../src/index.js';

const date = (value: string): CalendarDate => value as CalendarDate;

describe('demo-types', () => {
  it('describes a demo state for single and range selections', () => {
    const language: DemoLanguage = 'pl';
    const single: DemoState = {
      viewYear: 2024,
      viewMonth: 2,
      mode: 'single',
      selection: { selected: date('2024-02-29') },
      focused: date('2024-02-29'),
      language,
    };
    const range: DemoState = {
      ...single,
      mode: 'range',
      selection: { start: date('2024-02-10'), end: null },
    };
    expect(single.viewMonth).toBe(2);
    expect('selected' in single.selection).toBe(true);
    expect('start' in range.selection).toBe(true);
    expect(range.language).toBe('pl');
  });

  it('allows options with or without an initial language', () => {
    const clock: Clock = { today: () => date('2024-05-01') };
    const withoutLanguage: DemoOptions = { clock };
    const withLanguage: DemoOptions = { clock, initialLanguage: 'en' };
    expect(withoutLanguage.initialLanguage).toBeUndefined();
    expect(withLanguage.initialLanguage).toBe('en');
    expect(withLanguage.clock.today()).toBe('2024-05-01');
  });

  it('can be implemented as a controller against the real document', () => {
    let state: DemoState = {
      viewYear: 2024,
      viewMonth: 12,
      mode: 'single',
      selection: { selected: null },
      focused: date('2024-12-01'),
      language: 'en',
    };
    const host = document.createElement('div');
    document.body.appendChild(host);
    const controller: DemoController = {
      getState: () => state,
      goToPreviousMonth: () => {
        state = { ...state, viewMonth: state.viewMonth - 1 };
      },
      goToNextMonth: () => {
        state = { ...state, viewYear: state.viewYear + 1, viewMonth: 1 };
      },
      setMode: (mode) => {
        state = {
          ...state,
          mode,
          selection: mode === 'single' ? { selected: null } : { start: null, end: null },
        };
      },
      selectDate: (d) => {
        state = { ...state, selection: { selected: d } };
      },
      handleKey: () => {},
      setLanguage: (language) => {
        state = { ...state, language };
      },
      destroy: () => {
        host.remove();
      },
    };
    controller.goToNextMonth();
    expect(controller.getState().viewYear).toBe(2025);
    expect(controller.getState().viewMonth).toBe(1);
    controller.setMode('range');
    expect(controller.getState().selection).toEqual({ start: null, end: null });
    controller.setLanguage('pl');
    expect(controller.getState().language).toBe('pl');
    controller.destroy();
    expect(document.body.contains(host)).toBe(false);
  });
});