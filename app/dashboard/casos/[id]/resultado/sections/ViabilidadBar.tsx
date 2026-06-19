'use client';

import { useEffect, useRef, useState } from 'react';

type Nivel = 'alta' | 'media' | 'baja' | string | undefined;

const LEVEL_TO_PCT: Record<string, number> = {
  alta: 85,
  media: 55,
  baja: 25,
};

const LEVEL_STYLES: Record<string, { label: string; bar: string; text: string; ring: string }> = {
  alta: {
    label: 'Viabilidad alta',
    bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    text: 'text-emerald-300',
    ring: 'border-emerald-500/40 bg-emerald-500/10',
  },
  media: {
    label: 'Viabilidad media',
    bar: 'bg-gradient-to-r from-amber-500 to-amber-400',
    text: 'text-amber-300',
    ring: 'border-amber-500/40 bg-amber-500/10',
  },
  baja: {
    label: 'Viabilidad baja',
    bar: 'bg-gradient-to-r from-rose-500 to-rose-400',
    text: 'text-rose-300',
    ring: 'border-rose-500/40 bg-rose-500/10',
  },
};

interface Props {
  nivel: Nivel;
  pct?: number;
  description?: string;
  compact?: boolean;
}

export function ViabilidadBar({ nivel, pct, description, compact }: Props) {
  const key = (nivel ?? '').toLowerCase();
  const styles = LEVEL_STYLES[key];
  const target = pct ?? LEVEL_TO_PCT[key] ?? 0;

  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
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
            const dur = 900;
            const step = (now: number) => {
              const t = Math.min(1, (now - start) / dur);
              const eased = 1 - Math.pow(1 - t, 3);
              setProgress(target * eased);
              if (t < 1) requestAnimationFrame(step);
              else setProgress(target);
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
  }, [target]);

  if (!nivel) return null;

  if (!styles) {
    return (
      <span className="inline-flex items-center px-2 h-6 text-[10px] font-semibold uppercase tracking-wide border border-line bg-bg text-fg-muted rounded-[var(--radius-button)]">
        Viabilidad: {nivel}
      </span>
    );
  }

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-2 ${compact ? 'min-w-[180px]' : 'min-w-[220px] w-full'}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2 h-6 text-[10px] font-semibold uppercase tracking-wide border rounded-[var(--radius-button)] ${styles.ring} ${styles.text}`}
        >
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${styles.text.replace('text-', 'bg-')}`} />
          {styles.label}
        </span>
        <span className={`text-xs font-semibold tabular-nums ${styles.text}`}>
          {Math.round(progress)}%
        </span>
      </div>
      <div className="relative h-1.5 w-full bg-bg border border-line rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${styles.bar} transition-[width] duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {description && (
        <p className="text-[11px] leading-snug text-fg-faint text-justify">{description}</p>
      )}
    </div>
  );
}
