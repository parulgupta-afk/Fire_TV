// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { createRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Focusable, FocusableElement } from './Focusable';

describe('Focusable component behavioral tests', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    root.unmount();
    container.remove();
  });

  const render = (element: React.ReactElement): Promise<void> => {
    return new Promise((resolve) => {
      root.render(element);
      setTimeout(resolve, 10);
    });
  };

  it('renders a native div element with role="button" and tabIndex=0 by default', async () => {
    await render(<Focusable className="card-item">Card Text</Focusable>);
    const el = container.firstElementChild as HTMLDivElement;

    expect(el).not.toBeNull();
    expect(el.tagName).toBe('DIV');
    expect(el.getAttribute('role')).toBe('button');
    expect(el.tabIndex).toBe(0);
    expect(el.className).toContain('focusable');
    expect(el.className).toContain('card-item');
    expect(el.textContent).toBe('Card Text');
  });

  it('renders a native button element when as="button"', async () => {
    await render(
      <Focusable as="button" className="btn-item">
        Action
      </Focusable>
    );
    const el = container.firstElementChild as HTMLButtonElement;

    expect(el).not.toBeNull();
    expect(el.tagName).toBe('BUTTON');
    expect(el.type).toBe('button');
    expect(el.className).toContain('focusable');
    expect(el.className).toContain('btn-item');
    expect(el.textContent).toBe('Action');
  });

  it('forwards ref to actual underlying HTMLButtonElement and HTMLDivElement', async () => {
    const buttonRef = createRef<FocusableElement>();
    await render(
      <Focusable ref={buttonRef} as="button">
        Button Ref Test
      </Focusable>
    );
    expect(buttonRef.current).toBeInstanceOf(window.HTMLButtonElement);

    const divRef = createRef<FocusableElement>();
    await render(
      <Focusable ref={divRef}>
        Div Ref Test
      </Focusable>
    );
    expect(divRef.current).toBeInstanceOf(window.HTMLDivElement);
  });

  it('triggers onSelect when clicking on div variant', async () => {
    const onSelect = vi.fn();
    await render(<Focusable onSelect={onSelect}>Clickable Div</Focusable>);
    const el = container.firstElementChild as HTMLDivElement;

    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('triggers onSelect on Enter and Space keydown events', async () => {
    const onSelect = vi.fn();
    await render(<Focusable onSelect={onSelect}>Key Target</Focusable>);
    const el = container.firstElementChild as HTMLDivElement;

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onSelect).toHaveBeenCalledTimes(1);

    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onSelect).toHaveBeenCalledTimes(2);

    // Arrow keys for D-pad navigation should not trigger onSelect
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('handles disabled buttons correctly', async () => {
    const onSelect = vi.fn();
    await render(
      <Focusable as="button" disabled onSelect={onSelect}>
        Disabled Button
      </Focusable>
    );
    const btn = container.firstElementChild as HTMLButtonElement;

    expect(btn.disabled).toBe(true);
    expect(btn.tabIndex).toBe(-1);

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('calls custom onClick and onKeyDown handlers', async () => {
    const customClick = vi.fn();
    const customKeyDown = vi.fn();
    const onSelect = vi.fn();

    await render(
      <Focusable
        as="button"
        onClick={customClick}
        onKeyDown={customKeyDown}
        onSelect={onSelect}
      >
        Custom Handlers
      </Focusable>
    );
    const btn = container.firstElementChild as HTMLButtonElement;

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(customClick).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);

    btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(customKeyDown).toHaveBeenCalledTimes(1);
    // ArrowRight should not call onSelect
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('supports autoFocus property to focus element on mount', async () => {
    await render(
      <Focusable as="button" autoFocus>
        Auto Focused
      </Focusable>
    );
    const btn = container.firstElementChild as HTMLButtonElement;
    expect(document.activeElement).toBe(btn);
  });
});
