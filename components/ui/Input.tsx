'use client';

import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: React.ReactNode;
}

export function Input({
  label,
  hint,
  error,
  disabled = false,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  onChange,
  iconLeft = null,
  id,
  style,
  ...rest
}: InputProps) {
  const [focus, setFocus] = React.useState(false);
  const reactId = React.useId();
  const inputId = id || reactId;

  const borderColor = error
    ? 'var(--error)'
    : focus
      ? 'var(--accent)'
      : 'var(--border)';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        width: '100%',
        ...style,
      }}
    >
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--fw-medium)' as unknown as number,
            color: 'var(--text-secondary)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {iconLeft && (
          <span
            style={{
              position: 'absolute',
              left: 'var(--space-3)',
              display: 'flex',
              color: 'var(--text-secondary)',
              pointerEvents: 'none',
            }}
          >
            {iconLeft}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: '100%',
            height: 44,
            padding: iconLeft ? '0 var(--space-3) 0 var(--space-8)' : '0 var(--space-3)',
            background: disabled ? 'var(--charcoal-2)' : 'var(--charcoal)',
            color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
            border: `1px solid ${borderColor}`,
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-base)',
            outline: 'none',
            boxShadow: focus && !error ? 'var(--ring-shadow)' : 'none',
            transition:
              'border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
            cursor: disabled ? 'not-allowed' : 'text',
          }}
          {...rest}
        />
      </div>
      {error && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--error)' }}>{error}</span>}
      {hint && !error && (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{hint}</span>
      )}
    </div>
  );
}
