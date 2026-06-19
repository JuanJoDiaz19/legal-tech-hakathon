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
  Activo: 'bg-accent-soft text-fg border-accent-line',
  'En revisión': 'bg-surface text-fg-muted border-line',
  Archivado: 'bg-transparent text-fg-faint border-line',
};

const ANALYSIS_STATUS: Record<string, { label: string; className: string }> = {
  done: {
    label: 'Análisis listo',
    className: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  pending: {
    label: 'Procesando',
    className: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  error: {
    label: 'Error',
    className: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
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

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cases.map((c, idx) => {
        const badgeClass = STATUS_STYLES[c.status] ?? STATUS_STYLES.Activo;
        const analysis = c.analysis_status ? ANALYSIS_STATUS[c.analysis_status] : null;
        return (
          <li
            key={c.id}
            style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
            className="animate-file-in"
          >
            <Link
              href={`/dashboard/casos/${c.id}/resultado`}
              className="group relative block h-full bg-surface border border-line rounded-[var(--radius-card)] p-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-fg-muted hover:-translate-y-0.5"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-4 bottom-4 w-px bg-accent origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
              />
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-semibold text-fg leading-snug line-clamp-2">
                  {c.title}
                </h3>
                <span
                  className={`shrink-0 inline-flex items-center px-2 h-6 text-[11px] font-medium border rounded-[var(--radius-button)] ${badgeClass}`}
                >
                  {c.status}
                </span>
              </div>

              {c.client && (
                <p className="text-sm text-fg-muted mb-3">
                  <span className="text-fg-faint">Cliente · </span>
                  {c.client}
                </p>
              )}

              {c.description && (
                <p className="text-sm text-fg-muted line-clamp-3 mb-4">{c.description}</p>
              )}

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-line">
                <span className="text-xs text-fg-faint">{formatDate(c.created_at)}</span>
                {analysis && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 h-5 text-[10px] font-semibold uppercase tracking-wide border rounded-[var(--radius-button)] ${analysis.className}`}
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
  );
}
