type Fuente = { fuente: string; pagina?: number | string; categoria?: string };

type GroupKey =
  | 'jurisprudencia'
  | 'ley'
  | 'doctrina'
  | 'acto_admin'
  | 'perjuicios'
  | 'otro';

type GroupConfig = {
  label: string;
  description: string;
  prefix: string;
  accent: string;
  iconBg: string;
  icon: React.ReactNode;
};

const GROUP_ORDER: GroupKey[] = [
  'jurisprudencia',
  'ley',
  'doctrina',
  'acto_admin',
  'perjuicios',
  'otro',
];

const GROUPS: Record<GroupKey, GroupConfig> = {
  jurisprudencia: {
    label: 'Jurisprudencia',
    description: 'Sentencias y precedentes citados',
    prefix: 'J',
    accent: 'text-blue-300 border-blue-500/30 bg-blue-500/5',
    iconBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    icon: <GavelIcon />,
  },
  ley: {
    label: 'Ley',
    description: 'Normas y artículos del ordenamiento',
    prefix: 'L',
    accent: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/5',
    iconBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    icon: <ScaleIcon />,
  },
  doctrina: {
    label: 'Doctrina',
    description: 'Tratadistas y obras de referencia',
    prefix: 'D',
    accent: 'text-purple-300 border-purple-500/30 bg-purple-500/5',
    iconBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    icon: <BookIcon />,
  },
  acto_admin: {
    label: 'Actos administrativos',
    description: 'Conceptos y resoluciones regulatorias',
    prefix: 'A',
    accent: 'text-amber-300 border-amber-500/30 bg-amber-500/5',
    iconBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    icon: <StampIcon />,
  },
  perjuicios: {
    label: 'Perjuicios',
    description: 'Topes y criterios de tasación',
    prefix: 'P',
    accent: 'text-rose-300 border-rose-500/30 bg-rose-500/5',
    iconBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    icon: <CoinsIcon />,
  },
  otro: {
    label: 'Otras fuentes',
    description: 'Material adicional citado',
    prefix: '',
    accent: 'text-fg-muted border-line bg-bg',
    iconBg: 'bg-bg text-fg-muted border-line',
    icon: <FileIcon />,
  },
};

function classifyEntry(id: string, fuente: Fuente): GroupKey {
  const cat = (fuente.categoria ?? '').toLowerCase().replace(/\s+/g, '_');
  if (cat in GROUPS) return cat as GroupKey;
  const first = id.replace(/[^A-Za-z]/g, '').charAt(0).toUpperCase();
  for (const key of GROUP_ORDER) {
    if (GROUPS[key].prefix && GROUPS[key].prefix === first) return key;
  }
  return 'otro';
}

export function FuentesSection({ fuentes }: { fuentes?: Record<string, Fuente> }) {
  const entries = Object.entries(fuentes ?? {});

  if (entries.length === 0) {
    return (
      <div className="bg-bg border border-line rounded-[var(--radius-card)] p-8 text-center flex flex-col items-center gap-3">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-line text-fg-faint">
          <FileIcon />
        </span>
        <p className="text-sm text-fg-muted max-w-md">
          El análisis no incluyó citas trazables. El motor de RAG no devolvió
          fuentes para este caso.
        </p>
      </div>
    );
  }

  const groups = new Map<GroupKey, Array<[string, Fuente]>>();
  for (const [id, f] of entries) {
    const key = classifyEntry(id, f);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push([id, f]);
  }

  const orderedGroups = GROUP_ORDER.filter((k) => groups.has(k)).map(
    (k) => [k, groups.get(k)!] as const,
  );

  return (
    <div className="flex flex-col gap-8">
      <SummaryHeader total={entries.length} groups={orderedGroups} />

      {orderedGroups.map(([key, items]) => (
        <GroupBlock key={key} groupKey={key} items={items} />
      ))}
    </div>
  );
}

function SummaryHeader({
  total,
  groups,
}: {
  total: number;
  groups: ReadonlyArray<readonly [GroupKey, Array<[string, Fuente]>]>;
}) {
  return (
    <header className="bg-bg/50 border border-line rounded-[var(--radius-card)] p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
          Bibliografía consultada
        </h3>
        <p className="text-[11px] text-fg-faint">
          {total} {total === 1 ? 'cita' : 'citas'} en total
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {groups.map(([key, items]) => {
          const cfg = GROUPS[key];
          return (
            <a
              key={key}
              href={`#fuentes-${key}`}
              className="bg-surface border border-line rounded-[var(--radius-button)] px-3 py-2.5 flex items-center gap-2.5 hover:border-fg-muted transition-colors"
            >
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full border ${cfg.iconBg}`}
              >
                {cfg.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-fg-faint truncate">
                  {cfg.label}
                </p>
                <p className="text-base font-semibold text-fg tabular-nums leading-none mt-0.5">
                  {items.length}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </header>
  );
}

function GroupBlock({
  groupKey,
  items,
}: {
  groupKey: GroupKey;
  items: Array<[string, Fuente]>;
}) {
  const cfg = GROUPS[groupKey];
  return (
    <section id={`fuentes-${groupKey}`} className="flex flex-col gap-3">
      <header className="flex items-center gap-3">
        <span
          className={`inline-flex items-center justify-center w-9 h-9 rounded-[var(--radius-button)] border ${cfg.iconBg}`}
        >
          {cfg.icon}
        </span>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-fg leading-tight">
            {cfg.label}
          </h3>
          <p className="text-[11px] text-fg-faint mt-0.5">{cfg.description}</p>
        </div>
        <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 text-[11px] font-semibold text-fg-muted bg-surface border border-line rounded-full">
          {items.length}
        </span>
      </header>

      <ul className="flex flex-col gap-2 pl-12">
        {items.map(([id, fuente]) => (
          <FuenteCard key={id} id={id} fuente={fuente} accent={cfg.accent} />
        ))}
      </ul>
    </section>
  );
}

function FuenteCard({
  id,
  fuente,
  accent,
}: {
  id: string;
  fuente: Fuente;
  accent: string;
}) {
  return (
    <li className="bg-bg border border-line rounded-[var(--radius-card)] p-4 flex gap-3 hover:border-fg-muted transition-colors">
      <span
        className={`shrink-0 inline-flex items-center justify-center min-w-10 h-7 px-2 text-[11px] font-mono font-semibold border rounded-[var(--radius-button)] ${accent}`}
      >
        {id.replace(/^\[|\]$/g, '')}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] leading-6 text-fg break-words">{fuente.fuente}</p>
        {fuente.pagina !== undefined && fuente.pagina !== null && fuente.pagina !== '' && (
          <p className="text-[11px] text-fg-faint mt-1.5 inline-flex items-center gap-1">
            <PageIcon />
            <span>
              {typeof fuente.pagina === 'number' ? 'Página' : 'Sección'}{' '}
              {fuente.pagina}
            </span>
          </p>
        )}
      </div>
    </li>
  );
}

// =============================================================================
// Iconos
// =============================================================================

const ICON_PROPS = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function GavelIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="m14.5 12.5-8 8a2.12 2.12 0 1 1-3-3l8-8" />
      <path d="m16 16 6-6" />
      <path d="m8 8 6-6" />
      <path d="m9 7 8 8" />
      <path d="m21 11-8-8" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 3v18" />
      <path d="M5 21h14" />
      <path d="m5 9-2 4h4z" />
      <path d="m19 9-2 4h4z" />
      <path d="M5 9c0-1 .5-2 2-2h10c1.5 0 2 1 2 2" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function StampIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M5 22h14" />
      <path d="M19 14v-2a2 2 0 0 0-2-2h-2a2 2 0 0 1-2-2V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H7a2 2 0 0 0-2 2v2" />
      <rect x="3" y="14" width="18" height="4" rx="1" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function PageIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
