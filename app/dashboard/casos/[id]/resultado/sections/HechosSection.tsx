import type { AnalisisHechos } from '@/lib/api';

type Hecho = { hecho?: string; descripcion?: string; fecha?: string | null; fuente?: string };
type Prueba = { tipo?: string; descripcion?: string; fuente?: string };
type Peritaje = { materia?: string; conclusion?: string; fuente?: string };
type Dano = { tipo?: string; descripcion?: string; fuente?: string };
type Partes = { demandantes?: string[]; demandados_potenciales?: string[] };
type TipoCaso = { categoria?: string; subtipo?: string; fundamento?: string };
type Rubro = { rubro?: string; monto?: string | null; soporte?: string | null };
type Cuantia = { monto_total?: string | null; rubros?: Rubro[] };

const TIPO_CASO_TONE: Record<string, string> = {
  transito: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  actividad_peligrosa: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  medica: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  producto: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  otro: 'bg-bg text-fg-muted border-line',
};

const PRUEBA_TIPO_LABEL: Record<string, string> = {
  documento: 'Documento',
  peritaje: 'Peritaje',
  testimonio: 'Testimonio',
  audiovisual: 'Audiovisual',
  otro: 'Otro',
};

const RUBRO_LABEL: Record<string, string> = {
  dano_emergente: 'Daño emergente',
  lucro_cesante: 'Lucro cesante',
  dano_moral: 'Daño moral',
  otro: 'Otro',
};

export function HechosSection({ hechos }: { hechos?: AnalisisHechos }) {
  if (!hechos) {
    return <p className="text-sm text-fg-muted">No hay hechos extraídos.</p>;
  }

  const partes = hechos.partes as Partes | undefined;
  const tipoCaso = hechos.tipo_caso as TipoCaso | undefined;
  const listaHechos = (hechos.hechos as Hecho[] | undefined) ?? [];
  const pruebas = (hechos.pruebas_aportadas as Prueba[] | undefined) ?? [];
  const peritajes = (hechos.peritajes as Peritaje[] | undefined) ?? [];
  const danos = (hechos.danos_alegados as Dano[] | undefined) ?? [];
  const cuantia = hechos.cuantia as Cuantia | string | number | undefined;
  const vacios = (hechos.vacios_o_dudas as (string | Record<string, unknown>)[] | undefined) ?? [];

  return (
    <div className="flex flex-col gap-8">
      {hechos.resumen_factico && (
        <Card title="Resumen fáctico">
          <p className="text-[15px] leading-7 text-fg text-justify">{hechos.resumen_factico}</p>
        </Card>
      )}

      {tipoCaso && (tipoCaso.categoria || tipoCaso.fundamento) && (
        <Card title="Tipo de caso">
          <div className="flex flex-col gap-3">
            {tipoCaso.categoria && (
              <div className="flex flex-wrap items-center gap-2">
                <CategoriaBadge categoria={tipoCaso.categoria} />
                {tipoCaso.subtipo && (
                  <span className="text-sm text-fg-muted">{tipoCaso.subtipo}</span>
                )}
              </div>
            )}
            {tipoCaso.fundamento && (
              <blockquote className="text-sm leading-6 text-fg-muted italic border-l-2 border-accent pl-3 py-1">
                {tipoCaso.fundamento}
              </blockquote>
            )}
          </div>
        </Card>
      )}

      {partes && (partes.demandantes?.length || partes.demandados_potenciales?.length) ? (
        <Card title="Partes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <PartesColumn
              label="Demandantes"
              items={partes.demandantes ?? []}
              tone="emerald"
            />
            <PartesColumn
              label="Demandados potenciales"
              items={partes.demandados_potenciales ?? []}
              tone="rose"
            />
          </div>
        </Card>
      ) : null}

      {listaHechos.length > 0 && (
        <Card
          title="Hechos relevantes"
          counter={listaHechos.length}
        >
          <ol className="flex flex-col gap-0">
            {listaHechos.map((h, idx) => (
              <HechoItem key={idx} hecho={h} index={idx + 1} isLast={idx === listaHechos.length - 1} />
            ))}
          </ol>
        </Card>
      )}

      {danos.length > 0 && (
        <Card title="Daños alegados" counter={danos.length}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {danos.map((d, idx) => (
              <div
                key={idx}
                className="bg-bg border border-line rounded-[var(--radius-button)] p-3 flex flex-col gap-1.5"
              >
                {d.tipo && (
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-fg-faint">
                    {d.tipo}
                  </span>
                )}
                <p className="text-sm leading-6 text-fg">
                  {d.descripcion ?? '—'}
                </p>
                {d.fuente && <Source fuente={d.fuente} />}
              </div>
            ))}
          </div>
        </Card>
      )}

      {pruebas.length > 0 && (
        <Card title="Pruebas aportadas" counter={pruebas.length}>
          <div className="overflow-hidden rounded-[var(--radius-button)] border border-line">
            <table className="w-full text-sm">
              <thead className="bg-bg">
                <tr>
                  <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-fg-muted px-3 py-2 w-32">
                    Tipo
                  </th>
                  <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-fg-muted px-3 py-2">
                    Descripción
                  </th>
                  <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-fg-muted px-3 py-2 w-48">
                    Fuente
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pruebas.map((p, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2.5 align-top">
                      <span className="inline-flex items-center px-2 h-5 text-[10px] font-semibold uppercase tracking-wide border border-line rounded-[var(--radius-button)] text-fg-muted">
                        {PRUEBA_TIPO_LABEL[p.tipo ?? ''] ?? p.tipo ?? 'Otro'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 align-top text-[14px] leading-6 text-fg">
                      {p.descripcion ?? '—'}
                    </td>
                    <td className="px-3 py-2.5 align-top text-[12px] text-fg-faint break-all">
                      {p.fuente ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {peritajes.length > 0 && (
        <Card title="Peritajes" counter={peritajes.length}>
          <div className="flex flex-col gap-3">
            {peritajes.map((p, idx) => (
              <div
                key={idx}
                className="bg-bg border border-line rounded-[var(--radius-button)] p-4 flex flex-col gap-2"
              >
                {p.materia && (
                  <h4 className="text-sm font-semibold text-fg">{p.materia}</h4>
                )}
                {p.conclusion && (
                  <p className="text-sm leading-6 text-fg-muted">{p.conclusion}</p>
                )}
                {p.fuente && <Source fuente={p.fuente} />}
              </div>
            ))}
          </div>
        </Card>
      )}

      {cuantia !== undefined && cuantia !== null && (
        <Card title="Cuantía">
          <CuantiaBlock cuantia={cuantia} />
        </Card>
      )}

      {vacios.length > 0 && (
        <Card title="Vacíos o dudas" tone="warning">
          <ul className="flex flex-col gap-2">
            {vacios.map((v, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm leading-6 text-fg">
                <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>{typeof v === 'string' ? v : JSON.stringify(v)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function Card({
  title,
  children,
  counter,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  counter?: number;
  tone?: 'warning';
}) {
  const border = tone === 'warning' ? 'border-amber-500/30' : 'border-line';
  return (
    <section
      className={`bg-bg/50 border ${border} rounded-[var(--radius-card)] p-5 md:p-6`}
    >
      <header className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
          {title}
        </h3>
        {counter !== undefined && (
          <span className="inline-flex items-center justify-center min-w-6 h-5 px-1.5 text-[11px] font-semibold text-fg-muted bg-surface border border-line rounded-full">
            {counter}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

function CategoriaBadge({ categoria }: { categoria: string }) {
  const tone = TIPO_CASO_TONE[categoria] ?? TIPO_CASO_TONE.otro;
  const label = categoria.replace(/_/g, ' ');
  return (
    <span
      className={`inline-flex items-center px-2.5 h-6 text-[11px] font-semibold uppercase tracking-wide border rounded-[var(--radius-button)] ${tone}`}
    >
      {label}
    </span>
  );
}

function PartesColumn({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: 'emerald' | 'rose';
}) {
  const dot = tone === 'emerald' ? 'bg-emerald-400' : 'bg-rose-400';
  return (
    <div className="bg-surface border border-line rounded-[var(--radius-button)] p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted">
          {label}
        </h4>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-fg-faint italic">No identificados</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm text-fg">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HechoItem({
  hecho,
  index,
  isLast,
}: {
  hecho: Hecho;
  index: number;
  isLast: boolean;
}) {
  const texto = hecho.hecho ?? hecho.descripcion ?? '—';
  return (
    <li className="flex gap-3 relative">
      <div className="flex flex-col items-center shrink-0">
        <span className="w-6 h-6 mt-0.5 flex items-center justify-center text-[11px] font-semibold text-fg bg-surface border border-line rounded-full">
          {index}
        </span>
        {!isLast && <span className="flex-1 w-px bg-line my-1" />}
      </div>
      <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-5'}`}>
        <p className="text-[15px] leading-7 text-fg text-justify">{texto}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
          {hecho.fecha && (
            <span className="inline-flex items-center gap-1 text-[11px] text-fg-muted">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {hecho.fecha}
            </span>
          )}
          {hecho.fuente && <Source fuente={hecho.fuente} />}
        </div>
      </div>
    </li>
  );
}

function Source({ fuente }: { fuente: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-fg-faint">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
      <span className="truncate max-w-[220px]">{fuente}</span>
    </span>
  );
}

function parseMonto(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  const digits = value.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function formatCOP(n: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);
}

const SOPORTE_TONE: Record<string, { label: string; className: string }> = {
  si: { label: 'Soportado', className: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  soportado: { label: 'Soportado', className: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  parcial: { label: 'Parcial', className: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  discutible: { label: 'Discutible', className: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  no: { label: 'Sin soporte', className: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
};

function CuantiaBlock({ cuantia }: { cuantia: Cuantia | string | number }) {
  if (typeof cuantia === 'string' || typeof cuantia === 'number') {
    return <p className="text-lg font-semibold text-fg">{String(cuantia)}</p>;
  }
  const rubros = cuantia.rubros ?? [];
  const subtotal = rubros.reduce((acc, r) => {
    const n = parseMonto(r.monto);
    return n ? acc + n : acc;
  }, 0);
  const showSubtotal = subtotal > 0;

  return (
    <div className="flex flex-col gap-4">
      {cuantia.monto_total && (
        <div className="flex items-baseline gap-3 bg-accent-soft border border-accent-line rounded-[var(--radius-button)] px-4 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted">
            Monto total reclamado
          </span>
          <span className="text-2xl font-bold text-fg tabular-nums">
            {(() => {
              const n = parseMonto(cuantia.monto_total);
              return n !== null ? formatCOP(n) : cuantia.monto_total;
            })()}
          </span>
        </div>
      )}
      {rubros.length > 0 && (
        <div className="overflow-x-auto rounded-[var(--radius-button)] border border-line">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-bg">
              <tr>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-fg-muted px-3 py-2.5">
                  Concepto
                </th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wide text-fg-muted px-3 py-2.5 w-44">
                  Valor reclamado
                </th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-fg-muted px-3 py-2.5 w-36">
                  Soporte
                </th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-fg-muted px-3 py-2.5">
                  Observación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rubros.map((r, idx) => {
                const n = parseMonto(r.monto);
                const soporteKey = (r.soporte ?? '').toLowerCase();
                const soporte = SOPORTE_TONE[soporteKey];
                return (
                  <tr key={idx} className="hover:bg-bg/40 transition-colors">
                    <td className="px-3 py-3 text-[14px] text-fg font-medium">
                      {RUBRO_LABEL[r.rubro ?? ''] ?? r.rubro ?? '—'}
                    </td>
                    <td className="px-3 py-3 text-right text-[14px] text-fg tabular-nums font-semibold">
                      {n !== null ? formatCOP(n) : r.monto ?? '—'}
                    </td>
                    <td className="px-3 py-3">
                      {soporte ? (
                        <span
                          className={`inline-flex items-center px-2 h-6 text-[10px] font-semibold uppercase tracking-wide border rounded-[var(--radius-button)] ${soporte.className}`}
                        >
                          {soporte.label}
                        </span>
                      ) : r.soporte ? (
                        <span className="text-[13px] text-fg-muted">{r.soporte}</span>
                      ) : (
                        <span className="text-[13px] text-fg-faint">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-[13px] text-fg-muted leading-snug text-justify">
                      {!n ? 'Valor sin cuantificar en la demanda' : '—'}
                    </td>
                  </tr>
                );
              })}
              {showSubtotal && (
                <tr className="bg-bg/60">
                  <td className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-fg-muted">
                    Subtotal calculado
                  </td>
                  <td className="px-3 py-3 text-right text-[14px] text-fg tabular-nums font-bold">
                    {formatCOP(subtotal)}
                  </td>
                  <td className="px-3 py-3" colSpan={2}>
                    <span className="text-[11px] text-fg-faint italic">
                      Suma de los rubros con valor identificado; verificable por el abogado.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
