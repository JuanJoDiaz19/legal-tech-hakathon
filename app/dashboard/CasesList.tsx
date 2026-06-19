import Link from 'next/link';

export type Case = {
  id: string;
  title: string;
  client: string | null;
  status: string;
  description: string | null;
  created_at: string;
  created_by: string;
  analysis_status?: 'pending' | 'done' | 'error' | null;
};

const STATUS_STYLES: Record<string, string> = {
  Activo: 'text-accent bg-accent-soft',
  'En revisión': 'text-fg-muted bg-bg/60',
  Archivado: 'text-fg-faint bg-bg/60',
};

const ANALYSIS_STATUS: Record<string, { label: string; className: string }> = {
  done: {
    label: 'Análisis listo',
    className: 'text-emerald-300 bg-emerald-500/10',
  },
  pending: {
    label: 'Procesando',
    className: 'text-amber-300 bg-amber-500/10',
  },
  error: {
    label: 'Error',
    className: 'text-rose-300 bg-rose-500/10',
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const MES_LARGO: Record<number, string> = {
  0: 'Enero',
  1: 'Febrero',
  2: 'Marzo',
  3: 'Abril',
  4: 'Mayo',
  5: 'Junio',
  6: 'Julio',
  7: 'Agosto',
  8: 'Septiembre',
  9: 'Octubre',
  10: 'Noviembre',
  11: 'Diciembre',
};

type GroupKey = string;
type Group = { key: GroupKey; label: string; sublabel?: string; cases: Case[] };

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function bucketFor(date: Date, today: Date): { key: GroupKey; label: string; order: number } {
  const day = startOfDay(date);
  const t0 = startOfDay(today);
  const diffDays = Math.round((t0.getTime() - day.getTime()) / 86400000);

  if (diffDays <= 0) return { key: 'hoy', label: 'Hoy', order: 0 };
  if (diffDays === 1) return { key: 'ayer', label: 'Ayer', order: 1 };
  if (diffDays <= 7) return { key: 'semana', label: 'Esta semana', order: 2 };

  const sameMonth = day.getFullYear() === t0.getFullYear() && day.getMonth() === t0.getMonth();
  if (sameMonth) return { key: 'mes-actual', label: 'Este mes', order: 3 };

  const prevMonth = new Date(t0.getFullYear(), t0.getMonth() - 1, 1);
  const sameAsPrev =
    day.getFullYear() === prevMonth.getFullYear() && day.getMonth() === prevMonth.getMonth();
  if (sameAsPrev) return { key: 'mes-anterior', label: 'Mes anterior', order: 4 };

  const y = day.getFullYear();
  const m = day.getMonth();
  const sameYear = y === t0.getFullYear();
  const label = sameYear ? `${MES_LARGO[m]}` : `${MES_LARGO[m]} ${y}`;
  const order = 1000 + (t0.getFullYear() - y) * 12 + (t0.getMonth() - m);
  return { key: `${y}-${String(m).padStart(2, '0')}`, label, order };
}

function groupCases(cases: Case[]): Group[] {
  const now = new Date();
  const map = new Map<GroupKey, { label: string; order: number; cases: Case[] }>();

  for (const c of cases) {
    const d = new Date(c.created_at);
    const bucket = bucketFor(d, now);
    const existing = map.get(bucket.key);
    if (existing) {
      existing.cases.push(c);
    } else {
      map.set(bucket.key, { label: bucket.label, order: bucket.order, cases: [c] });
    }
  }

  return Array.from(map.entries())
    .map(([key, v]) => ({ key, label: v.label, cases: v.cases, order: v.order }))
    .sort((a, b) => a.order - b.order);
}

export function CasesList({ cases }: { cases: Case[] }) {
  if (cases.length === 0) {
    return (
      <div className="border border-line rounded-[var(--radius-card)] py-16 px-6 text-center bg-surface/40">
        <svg
          width="120"
          height="96"
          viewBox="0 0 120 96"
          fill="none"
          aria-hidden
          className="mx-auto mb-6"
        >
          <rect
            x="22"
            y="46"
            width="76"
            height="44"
            rx="3"
            fill="var(--color-surface)"
            stroke="var(--color-line)"
          />
          <rect x="38" y="56" width="44" height="4" rx="1" fill="var(--color-line)" />
          <rect x="38" y="66" width="32" height="3" rx="1" fill="var(--color-line)" />

          <rect
            x="16"
            y="32"
            width="80"
            height="46"
            rx="3"
            fill="var(--color-bg)"
            stroke="var(--color-line)"
          />
          <rect x="32" y="42" width="48" height="4" rx="1" fill="var(--color-line)" />
          <rect x="32" y="52" width="36" height="3" rx="1" fill="var(--color-line)" />

          <rect
            x="12"
            y="18"
            width="84"
            height="50"
            rx="3"
            fill="var(--color-surface)"
            stroke="var(--color-fg-faint)"
            strokeOpacity="0.4"
          />
          <rect x="28" y="28" width="52" height="4" rx="1" fill="var(--color-fg-faint)" />
          <rect x="28" y="38" width="40" height="3" rx="1" fill="var(--color-fg-faint)" />
          <rect x="28" y="46" width="44" height="3" rx="1" fill="var(--color-fg-faint)" />

          <rect x="76" y="10" width="6" height="22" fill="var(--color-accent)" />
          <path
            d="M76 32 L79 28 L82 32 Z"
            fill="var(--color-accent)"
          />
        </svg>

        <h2 className="text-base font-semibold text-fg mb-1">El expediente está vacío</h2>
        <p className="text-sm text-fg-muted max-w-sm mx-auto">
          Aún no hay casos registrados. Crea el primero y empieza el análisis defensivo.
        </p>
      </div>
    );
  }

  const groups = groupCases(cases);

  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <section key={group.key} aria-labelledby={`group-${group.key}`}>
          <header className="flex items-center gap-4 mb-6">
            <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent to-accent-line" />
            <div className="inline-flex items-center gap-2.5">
              <span aria-hidden className="text-accent">§</span>
              <h3
                id={`group-${group.key}`}
                className="font-wordmark italic text-[1.125rem] text-fg leading-none"
              >
                {group.label}
              </h3>
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-semibold tabular-nums text-accent bg-accent-soft border border-accent-line rounded-full">
                {group.cases.length}
              </span>
            </div>
            <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-line" />
          </header>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {group.cases.map((c, idx) => {
              const statusToneClass = STATUS_STYLES[c.status] ?? STATUS_STYLES.Activo;
              const analysis = c.analysis_status ? ANALYSIS_STATUS[c.analysis_status] : null;
              return (
                <li
                  key={c.id}
                  style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
                  className="animate-file-in"
                >
                  <Link
                    href={`/dashboard/casos/${c.id}/resultado`}
                    className="group relative block h-full bg-surface border border-line rounded-[var(--radius-card)] p-5 transition-all duration-200 ease-out hover:border-accent-line hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.3)]"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-base font-semibold leading-snug text-fg tracking-tight line-clamp-2">
                        {c.title}
                      </h3>
                      <span
                        className={`shrink-0 inline-flex items-center px-2 h-5 text-[10px] font-semibold uppercase tracking-wide rounded-full ${statusToneClass}`}
                      >
                        {c.status}
                      </span>
                    </div>

                    {c.client && (
                      <p className="text-[13px] text-fg-muted mb-2">
                        <span className="text-fg-faint">Cliente · </span>
                        {c.client}
                      </p>
                    )}

                    {c.description && (
                      <p className="text-[13px] leading-relaxed text-fg-muted line-clamp-3 mb-4">
                        {c.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-line/60">
                      <span className="text-[11px] text-fg-faint tabular-nums">
                        {formatDate(c.created_at)}
                      </span>
                      {analysis && (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 h-5 text-[10px] font-semibold uppercase tracking-wide rounded-full ${analysis.className}`}
                        >
                          {c.analysis_status === 'pending' && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          )}
                          {analysis.label}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
