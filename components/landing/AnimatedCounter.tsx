'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  to: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export function AnimatedCounter({
  to,
  durationMs = 1600,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const step = (now: number) => {
              const t = Math.min(1, (now - start) / durationMs);
              const v = to * ease(t);
              setValue(v);
              if (t < 1) requestAnimationFrame(step);
              else setValue(to);
            };
            requestAnimationFrame(step);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [to, durationMs]);

  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('es-CO');

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
