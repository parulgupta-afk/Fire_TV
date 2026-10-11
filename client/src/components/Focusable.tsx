import React, { useRef, useEffect, KeyboardEvent } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onSelect?: () => void;
  children: React.ReactNode;
  as?: 'div' | 'button';
  autoFocus?: boolean;
}

/**
 * Simple TV focusable wrapper.
 * Handles Enter / Space as Select.
 * Arrow keys are left to the browser / spatial navigation for now.
 */
export function Focusable({
  onSelect,
  children,
  as = 'div',
  autoFocus = false,
  className = '',
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement | HTMLButtonElement>(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.();
    }
  };

  const Comp = as === 'button' ? 'button' : 'div';

  return (
    <Comp
      ref={ref as any}
      tabIndex={0}
      className={`focusable ${className}`}
      onKeyDown={handleKeyDown}
      onClick={onSelect}
      role={as === 'button' ? 'button' : undefined}
      {...rest}
    >
      {children}
    </Comp>
  );
}
