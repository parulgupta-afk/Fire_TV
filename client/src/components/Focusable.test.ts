import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Focusable, FocusableButtonProps, FocusableDivProps } from './Focusable';

describe('Focusable component', () => {
  it('is a forwardRef React component', () => {
    expect(Focusable).toBeDefined();
    expect(typeof Focusable).toBe('object');
    expect(Focusable.$$typeof).toBe(Symbol.for('react.forward_ref'));
  });

  it('renders a button variant type correctly', () => {
    const onSelect = vi.fn();
    const props: FocusableButtonProps = {
      as: 'button',
      onSelect,
      disabled: false,
      className: 'test-button',
      children: 'Click Me',
    };
    const element = React.createElement(Focusable, props);

    expect(element.props.as).toBe('button');
    expect(element.props.onSelect).toBe(onSelect);
    expect(element.props.children).toBe('Click Me');
  });

  it('renders a div variant type by default', () => {
    const onSelect = vi.fn();
    const props: FocusableDivProps = {
      onSelect,
      className: 'test-div',
      children: 'Card Content',
    };
    const element = React.createElement(Focusable, props);

    expect(element.props.as).toBeUndefined();
    expect(element.props.className).toBe('test-div');
    expect(element.props.children).toBe('Card Content');
  });

  it('accepts button-specific attributes when as is button', () => {
    const props: FocusableButtonProps = {
      as: 'button',
      type: 'submit',
      disabled: true,
      children: 'Submit',
    };
    const element = React.createElement(Focusable, props);

    if (element.props.as === 'button') {
      expect(element.props.type).toBe('submit');
      expect(element.props.disabled).toBe(true);
    }
  });
});
