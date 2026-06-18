'use client';

import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  type = 'button',
  onClick,
  children,
  style,
  ...rest
}: ButtonProps) {
  const sizes: Record<Size, { padding: string; height: number; font: string }> = {
    sm: { padding: '0 var(--space-3)', height: 34, font: 'var(--text-sm)' },
    md: { padding: '0 var(--space-6)', height: 44, font: 'var(--text-sm)' },
    lg: { padding: '0 var(--space-8)', height: 52, font: 'var(--text-base)' },
  };
  const s = sizes[size];

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    height: s.height,
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-sans)',
    fontSize: s.font,
    fontWeight: 'var(--fw-semibold)' as unknown as number,
    letterSpacing: '0.01em',
    border: '1px solid transparent',
    borderRadius: 'var(--radius)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition:
      'background var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out), color var(--dur) var(--ease-out)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const variants: Record<Variant, React.CSSProperties> = {
    primary: {
      background: 'var(--accent-strong)',
      color: 'var(--on-accent)',
      borderColor: 'var(--accent-strong)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--accent)',
      borderColor: 'var(--accent)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      borderColor: 'var(--border)',
    },
    danger: {
      background: 'transparent',
      color: 'var(--error)',
      borderColor: 'var(--error)',
    },
  };

  const disabledStyle: React.CSSProperties = {
    background: 'var(--charcoal)',
    color: 'var(--text-disabled)',
    borderColor: 'var(--border)',
    cursor: 'not-allowed',
  };

  const [hover, setHover] = React.useState(false);
  const hoverMap: Record<Variant, React.CSSProperties> = {
    primary: { background: 'var(--maroon-deep)', borderColor: 'var(--maroon-deep)' },
    secondary: { background: 'var(--maroon-soft)' },
    ghost: { borderColor: 'var(--border-strong)', background: 'var(--charcoal)' },
    danger: { background: 'rgba(176,74,74,0.12)' },
  };
  const hoverStyle = !disabled && hover ? hoverMap[variant] : {};

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...(disabled ? disabledStyle : variants[variant]), ...hoverStyle, ...style }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
