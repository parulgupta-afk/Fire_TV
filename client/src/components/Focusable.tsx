import React, {
  forwardRef,
  useRef,
  useEffect,
  KeyboardEvent,
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react';

export type FocusableBaseProps = {
  onSelect?: () => void;
  children?: ReactNode;
  autoFocus?: boolean;
};

export type FocusableButtonProps = FocusableBaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof FocusableBaseProps | 'as'> & {
    as: 'button';
  };

export type FocusableDivProps = FocusableBaseProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof FocusableBaseProps | 'as'> & {
    as?: 'div';
  };

export type FocusableProps = FocusableButtonProps | FocusableDivProps;

export type FocusableElement = HTMLButtonElement | HTMLDivElement;

/**
 * TV focusable wrapper with discriminated props for button and div elements.
 * Handles Enter / Space as Select, supports D-pad remote focus, ref forwarding,
 * visible focus states, autoFocus, and disabled state for buttons.
 */
export const Focusable = forwardRef<FocusableElement, FocusableProps>(function Focusable(
  props,
  forwardedRef
) {
  const innerRef = useRef<HTMLButtonElement | HTMLDivElement | null>(null);

  const setRef = (node: HTMLButtonElement | HTMLDivElement | null) => {
    innerRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  useEffect(() => {
    if (props.autoFocus && innerRef.current) {
      innerRef.current.focus();
    }
  }, [props.autoFocus]);

  if (props.as === 'button') {
    const {
      onSelect,
      children,
      autoFocus: _autoFocus,
      className = '',
      as: _as,
      disabled,
      onClick,
      onKeyDown,
      type = 'button',
      ...buttonRest
    } = props;

    const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (!e.defaultPrevented && (e.key === 'Enter' || e.key === ' ')) {
        if (onSelect) {
          e.preventDefault();
          if (!disabled) {
            onSelect();
          }
        }
      }
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented && !disabled) {
        onSelect?.();
      }
    };

    return (
      <button
        ref={setRef}
        type={type}
        disabled={disabled}
        tabIndex={disabled ? -1 : (buttonRest.tabIndex ?? 0)}
        className={`focusable ${className}`.trim()}
        onKeyDown={handleButtonKeyDown}
        onClick={handleButtonClick}
        {...buttonRest}
      >
        {children}
      </button>
    );
  }

  const {
    onSelect,
    children,
    autoFocus: _autoFocus,
    className = '',
    as: _as,
    onClick,
    onKeyDown,
    tabIndex = 0,
    role = 'button',
    ...divRest
  } = props;

  const handleDivKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (!e.defaultPrevented && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSelect?.();
    }
  };

  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      onSelect?.();
    }
  };

  return (
    <div
      ref={setRef}
      role={role}
      tabIndex={tabIndex}
      className={`focusable ${className}`.trim()}
      onKeyDown={handleDivKeyDown}
      onClick={handleDivClick}
      {...divRest}
    >
      {children}
    </div>
  );
});
