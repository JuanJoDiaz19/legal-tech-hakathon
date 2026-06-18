import React from 'react';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  src?: string;
  name?: string;
  size?: number;
  ring?: boolean;
  square?: boolean;
}

export function Avatar({
  src,
  name = '',
  size = 44,
  ring = false,
  square = false,
  style,
  ...rest
}: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const common: React.CSSProperties = {
    width: size,
    height: size,
    flex: '0 0 auto',
    borderRadius: square ? 'var(--radius)' : 'var(--radius-pill)',
    border: ring ? '1px solid var(--maroon-line)' : '1px solid var(--border)',
    overflow: 'hidden',
    ...style,
  };

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} style={{ ...common, objectFit: 'cover', display: 'block' }} />
    );
  }

  return (
    <div
      style={{
        ...common,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--charcoal-2)',
        color: 'var(--accent)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--fw-semibold)' as unknown as number,
        fontSize: Math.max(11, size * 0.38),
        letterSpacing: '0.02em',
      }}
      {...rest}
    >
      {initials || '—'}
    </div>
  );
}
