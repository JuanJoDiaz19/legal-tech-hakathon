import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const I: React.FC<IconProps & { d?: string; children?: React.ReactNode }> = ({
  d,
  size = 20,
  children,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {d ? <path d={d} /> : children}
  </svg>
);

export const IconArrowRight: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </I>
);

export const IconSend: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </I>
);

export const IconCheck: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M20 6 9 17l-5-5" />
  </I>
);
