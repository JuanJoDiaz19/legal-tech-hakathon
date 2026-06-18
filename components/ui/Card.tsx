'use client';

import React from 'react';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  interactive?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: string;
  children?: React.ReactNode;
}

export function Card({
  interactive = false,
  header,
  footer,
  padding = 'var(--space-6)',
  onClick,
  children,
  style,
  ...rest
}: CardProps) {
  const [hover, setHover] = React.useState(false);
  const lift = interactive && hover;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--charcoal)',
        border: `1px solid ${lift ? 'var(--maroon-line)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        boxShadow: lift ? 'var(--shadow)' : 'none',
        transform: lift ? 'translateY(-2px)' : 'none',
        cursor: interactive ? 'pointer' : 'default',
        transition:
          'transform var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      {header && <div style={{ padding, borderBottom: '1px solid var(--border)' }}>{header}</div>}
      <div style={{ padding }}>{children}</div>
      {footer && <div style={{ padding, borderTop: '1px solid var(--border)' }}>{footer}</div>}
    </div>
  );
}
