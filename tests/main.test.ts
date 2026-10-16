// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { mountDemo } from '../demo/main';
import { fixedClock } from '../src/index';

function setup(language?: 'pl' | 'en') {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const clock = fixedClock('2024-05-15' as never);
  const controller = mountDemo(root, {
    clock,
    ...(language ? { initialLanguage: language } : {}),
  } as never);
  return { root, controller };
}

describe('mountDemo', () => {
  it('renders initial state, labels, and navigates months', () => {
    const { root, controller } = setup();
    const state = controller.getState();
    expect(state.viewYear).toBe(2024);
    expect(state.viewMonth).toBe(5);
    expect(state.mode).toBe('single');
    expect(state.language).toBe('en');
    expect(root.querySelector('[data-demo="previous"]')!.textContent).toBe('Previous');
    expect(root.querySelector('[data-demo="next"]')!.textContent).toBe('Next');
    expect(root.querySelector('[data-demo="selection"]')!.textContent).toBe('No date selected');

    (root.querySelector('[data-demo="next"]') as HTMLElement).click();
    expect(controller.getState().viewMonth).toBe(6);
    controller.goToPreviousMonth();
    controller.goToPreviousMonth();
    expect(controller.getState().viewMonth).toBe(4);

    controller.setLanguage('pl');
    expect(root.querySelector('[data-demo="previous"]')!.textContent).toBe('Poprzedni');
    expect(root.querySelector('[data-demo="language-pl"]')!.getAttribute('aria-pressed')).toBe('true');
    controller.destroy();
    expect(root.children.length).toBe(0);
  });

  it('selects dates in single and range modes and ignores disabled dates', () => {
    const { root, controller } = setup();
    controller.selectDate('2024-05-10' as never);
    expect((controller.getState().selection as { selected: unknown }).selected).toBeNull();

    controller.selectDate('2024-05-20' as never);
    expect((controller.getState().selection as { selected: unknown }).selected).toBe('2024-05-20');
    expect(controller.getState().focused).toBe('2024-05-20');
    expect(root.querySelector('[data-demo="selection"]')!.textContent).toContain('Selected');

    controller.setMode('range');
    expect(controller.getState().mode).toBe('range');
    expect(controller.getState().selection).toEqual({ start: null, end: null });
    controller.selectDate('2024-05-20' as never);
    expect(root.querySelector('[data-demo="selection"]')!.textContent).toContain('Range start');
    controller.selectDate('2024-05-25' as never);
    expect(controller.getState().selection).toEqual({ start: '2024-05-20', end: '2024-05-25' });
    controller.destroy();
  });

  it('handles keyboard navigation and selection', () => {
    const { root, controller } = setup('pl');
    expect(controller.getState().language).toBe('pl');
    controller.handleKey('ArrowRight');
    expect(controller.getState().focused).toBe('2024-05-16');
    controller.handleKey('Enter');
    expect((controller.getState().selection as { selected: unknown }).selected).toBe('2024-05-16');
    expect(root.querySelector('[data-demo="selection"]')!.textContent).toContain('Wybrano');

    const grid = root.querySelector('[data-demo="grid"]') as HTMLElement;
    const ev = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
    grid.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(controller.getState().focused).toBe('2024-05-17');

    const ctrl = new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true, bubbles: true, cancelable: true });
    grid.dispatchEvent(ctrl);
    expect(ctrl.defaultPrevented).toBe(false);
    expect(controller.getState().focused).toBe('2024-05-17');
    controller.destroy();
  });
});