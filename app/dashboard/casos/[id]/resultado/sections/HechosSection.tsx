import {
  Sparkles,
  Tag,
  Users,
  ClipboardList,
  AlertOctagon,
  FileSearch,
  Microscope,
  Wallet,
  AlertTriangle,
  Calendar,
  FileText,
  Image as ImageIcon,
  Mic,
  UserCircle2,
  FileQuestion,
  Hash,
  type LucideIcon,
} from 'lucide-react';
import type { AnalisisHechos } from '@/lib/api';

type Hecho = { hecho?: string; descripcion?: string; fecha?: string | null; fuente?: string };
type Prueba = { tipo?: string; descripcion?: string; fuente?: string };
type Peritaje = { materia?: string; conclusion?: string; fuente?: string };
type Dano = { tipo?: string; descripcion?: string; fuente?: string };
type Partes = { demandantes?: string[]; demandados_potenciales?: string[] };
type TipoCaso = { categoria?: string; subtipo?: string; fundamento?: string };
type Rubro = { rubro?: string; monto?: string | null; soporte?: string | null };
type Cuantia = { monto_total?: string | null; rubros?: Rubro[] };

const PRUEBA_TIPO_LABEL: Record<string, string> = {
  documento: 'Documento',
  peritaje: 'Peritaje',
  testimonio: 'Testimonio',
  audiovisual: 'Audiovisual',
  otro: 'Otro',
};

const PRUEBA_TIPO_ICON: Record<string, LucideIcon> = {
  documento: FileText,
  peritaje: Microscope,
  testimonio: UserCircle2,
  audiovisual: ImageIcon,
  audio: Mic,
  otro: FileQuestion,
};

const RUBRO_LABEL: Record<string, string> = {
  dano_emergente: 'Daño emergente',
  lucro_cesante: 'Lucro cesante',
  dano_moral: 'Daño moral',
  otro: 'Otro',
};

export function HechosSection({ hechos }: { hechos?: AnalisisHechos }) {
  if (!hechos) {
    return (
      <div className="bg-bg/40 border border-dashed border-line rounded-[var(--radius-card)] p-10 text-center text-sm text-fg-muted">
        No hay hechos extraídos.
      </div>
    );
  }

  const partes = hechos.partes as Partes | undefined;
  const tipoCaso = hechos.tipo_caso as TipoCaso | undefined;
  const listaHechos = (hechos.hechos as Hecho[] | undefined) ?? [];
  const pruebas = (hechos.pruebas_aportadas as Prueba[] | undefined) ?? [];
  const peritajes = (hechos.peritajes as Peritaje[] | undefined) ?? [];
  const danos = (hechos.danos_alegados as Dano[] | undefined) ?? [];
  const cuantia = hechos.cuantia as Cuantia | string | number | undefined;
  const vacios = (hechos.vacios_o_dudas as (string | Record<string, unknown>)[] | undefined) ?? [];

  const totalPartes =
    (partes?.demandantes?.length ?? 0) + (partes?.demandados_potenciales?.length ?? 0);
  const montoTotal =
    typeof cuantia === 'object' && cuantia !== null && cuantia.monto_total
      ? cuantia.monto_total
      : typeof cuantia === 'string' || typeof cuantia === 'number'
      ? String(cuantia)
      : null;

  return (
    <div className="flex flex-col gap-10">
      {hechos.resumen_factico && <ResumenHero text={hechos.resumen_factico} />}

      <StatsBar
        items={[
          { icon: ClipboardList, label: 'Hechos', value: listaHechos.length },
          { icon: AlertOctagon, label: 'Daños', value: danos.length },
          { icon: FileSearch, label: 'Pruebas', value: pruebas.length },
          { icon: Users, label: 'Partes', value: totalPartes },
        ]}
        montoTotal={montoTotal}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {tipoCaso && (tipoCaso.categoria || tipoCaso.fundamento) && (
          <div className="lg:col-span-2">
            <Card title="Tipo de caso" icon={Tag}>
              <div className="flex flex-col gap-4">
                {tipoCaso.categoria && (
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoriaBadge categoria={tipoCaso.categoria} />
                    {tipoCaso.subtipo && (
                      <span className="text-sm text-fg-muted">{tipoCaso.subtipo}</span>
                    )}
                  </div>
                )}
                {tipoCaso.fundamento && (
                  <blockquote className="relative text-[13px] leading-7 text-fg-muted italic pl-4 text-justify">
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent rounded"
                    />
                    {tipoCaso.fundamento}
                  </blockquote>
                )}
              </div>
            </Card>
          </div>
        )}

        {partes && (partes.demandantes?.length || partes.demandados_potenciales?.length) ? (
          <div className="lg:col-span-3">
            <Card title="Partes procesales" icon={Users}>
              <PartesDuelo
                demandantes={partes.demandantes ?? []}
                demandados={partes.demandados_potenciales ?? []}
              />
            </Card>
          </div>
        ) : null}
      </div>

      {listaHechos.length > 0 && (
        <Card title="Hechos relevantes" icon={ClipboardList} counter={listaHechos.length}>
          <Timeline hechos={listaHechos} />
        </Card>
      )}

      {danos.length > 0 && (
        <Card title="Daños alegados" icon={AlertOctagon} counter={danos.length}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {danos.map((d, idx) => (
              <DanoCard key={idx} dano={d} />
            ))}
          </div>
        </Card>
      )}

      {pruebas.length > 0 && (
        <Card title="Pruebas aportadas" icon={FileSearch} counter={pruebas.length}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pruebas.map((p, idx) => (
              <PruebaCard key={idx} prueba={p} />
            ))}
          </div>
        </Card>
      )}

      {peritajes.length > 0 && (
        <Card title="Peritajes" icon={Microscope} counter={peritajes.length}>
          <div className="flex flex-col gap-3">
            {peritajes.map((p, idx) => (
              <PeritajeCard key={idx} peritaje={p} />
            ))}
          </div>
        </Card>
      )}

      {cuantia !== undefined && cuantia !== null && (
        <Card title="Cuantía" icon={Wallet}>
          <CuantiaBlock cuantia={cuantia} />
        </Card>
      )}

      {vacios.length > 0 && (
        <Card title="Vacíos o dudas" icon={AlertTriangle} tone="warning">
          <ul className="flex flex-col gap-2.5">
            {vacios.map((v, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm leading-6 text-fg bg-amber-500/5 border border-amber-500/20 rounded-[var(--radius-button)] p-3"
              >
                <AlertTriangle
                  className="w-4 h-4 mt-0.5 text-amber-300 shrink-0"
                  strokeWidth={1.8}
                />
                <span className="text-justify">
                  {typeof v === 'string' ? v : JSON.stringify(v)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

// =============================================================================
// Hero — Resumen fáctico
// =============================================================================

function ResumenHero({ text }: { text: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-surface/80 via-bg/40 to-bg border border-line rounded-[var(--radius-card)] p-6 md:p-8">
      <div
        aria-hidden
        className="absolute -top-12 -right-12 w-[280px] h-[280px] bg-accent/10 blur-3xl pointer-events-none"
      />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-transparent border border-accent-line text-fg">
            <Sparkles className="w-4 h-4" strokeWidth={1.8} />
          </span>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-fg">
            Resumen fáctico
          </h2>
        </div>
        <p className="text-[16px] md:text-[17px] leading-[1.8] text-fg text-justify">
          {text}
        </p>
      </div>
    </section>
  );
}

// =============================================================================
// Stats bar
// =============================================================================

function StatsBar({
  items,
  montoTotal,
}: {
  items: Array<{ icon: LucideIcon; label: string; value: number }>;
  montoTotal: string | null;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5 bg-bg/40 border border-line rounded-[var(--radius-card)] p-2.5">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-button)] transition-colors hover:bg-surface/60"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded bg-accent-soft border border-accent-line text-accent">
            <Icon className="w-4 h-4" strokeWidth={1.8} />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold text-fg tabular-nums">{value}</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-fg-faint mt-1">
              {label}
            </span>
          </div>
        </div>
      ))}
      {montoTotal && (
        <div className="col-span-2 md:col-span-4 lg:col-span-1 flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-button)] bg-accent-soft/60 border border-accent-line">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded bg-accent text-fg">
            <Wallet className="w-4 h-4" strokeWidth={1.8} />
          </span>
          <div className="flex flex-col leading-none min-w-0">
            <span
              className="text-sm font-bold text-fg tabular-nums truncate"
              title={montoTotal}
            >
              {montoTotal}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-fg-faint mt-1">
              Cuantía total
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Card wrapper con icono
// =============================================================================

function Card({
  title,
  icon: Icon,
  children,
  counter,
  tone,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  counter?: number;
  tone?: 'warning';
}) {
  const border = tone === 'warning' ? 'border-amber-500/30' : 'border-line';
  return (
    <section
      className={`relative bg-gradient-to-b from-surface/40 to-bg/30 border ${border} rounded-[var(--radius-card)] p-5 md:p-6 transition-colors hover:border-accent-line/60`}
    >
      <header
        className={`flex items-center justify-between gap-2 mb-5 pb-4 border-b ${
          tone === 'warning' ? 'border-amber-500/40' : 'border-accent-line'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded border ${
              tone === 'warning'
                ? 'bg-transparent text-amber-300 border-amber-500/40'
                : 'bg-transparent text-fg border-accent-line'
            }`}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
          </span>
          <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-fg truncate">
            {title}
          </h3>
        </div>
        {counter !== undefined && (
          <span className="inline-flex items-center justify-center min-w-7 h-6 px-2 text-[11px] font-bold tabular-nums text-fg bg-transparent border border-accent-line rounded-full">
            {counter}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

// =============================================================================
// Categoria badge
// =============================================================================

function CategoriaBadge({ categoria }: { categoria: string }) {
  const label = categoria.replace(/_/g, ' ');
  return (
    <span className="inline-flex items-center gap-1.5 px-3 h-7 text-[12px] font-semibold uppercase tracking-wide bg-accent-soft text-accent border border-accent-line rounded-full">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
      {label}
    </span>
  );
}

// =============================================================================
// Partes — duelo demandante vs demandado
// =============================================================================

function PartesDuelo({
  demandantes,
  demandados,
}: {
  demandantes: string[];
  demandados: string[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 items-stretch">
      <PartesColumn label="Demandantes" items={demandantes} />
      <div className="hidden md:flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-fg-faint">vs</span>
      </div>
      <div className="md:hidden flex items-center justify-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-fg-faint">vs</span>
      </div>
      <PartesColumn label="Demandados" items={demandados} />
    </div>
  );
}

function PartesColumn({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-fg-faint">{label}</h4>
      {items.length === 0 ? (
        <p className="text-xs text-fg-faint italic">No identificados</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 min-w-0 bg-bg border border-line rounded-full transition-colors hover:border-accent-line"
            >
              <UserCircle2 className="w-3.5 h-3.5 text-accent shrink-0" strokeWidth={1.6} />
              <span className="text-[13px] text-fg truncate min-w-0" title={item}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// =============================================================================
// Timeline de hechos
// =============================================================================

function Timeline({ hechos }: { hechos: Hecho[] }) {
  return (
    <ol className="relative flex flex-col gap-0">
      <span
        aria-hidden
        className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-accent via-line to-transparent"
      />
      {hechos.map((h, idx) => (
        <HechoItem
          key={idx}
          hecho={h}
          index={idx + 1}
          isLast={idx === hechos.length - 1}
        />
      ))}
    </ol>
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
    <li className="relative flex gap-4">
      <span
        className="relative z-10 shrink-0 w-6 h-6 mt-0.5 flex items-center justify-center text-[10px] font-bold text-accent bg-bg border-2 border-accent-line rounded-full tabular-nums"
        aria-hidden
      >
        {index}
      </span>
      <div className={`flex-1 min-w-0 ${isLast ? 'pb-0' : 'pb-6'}`}>
        <p className="text-[15px] leading-7 text-fg text-justify">{texto}</p>
        {(hecho.fecha || hecho.fuente) && (
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            {hecho.fecha && (
              <span className="inline-flex items-center gap-1.5 px-2 h-6 text-[11px] font-semibold text-fg bg-accent-soft border border-accent-line rounded-full">
                <Calendar className="w-3 h-3" strokeWidth={2} />
                {hecho.fecha}
              </span>
            )}
            {hecho.fuente && <SourceBadge fuente={hecho.fuente} />}
          </div>
        )}
      </div>
    </li>
  );
}

// =============================================================================
// Daño card
// =============================================================================

function DanoCard({ dano }: { dano: Dano }) {
  return (
    <div className="group bg-bg border border-line rounded-[var(--radius-card)] p-4 flex flex-col gap-2 transition-all duration-200 hover:border-accent-line hover:-translate-y-0.5">
      {dano.tipo && (
        <span className="inline-flex items-center gap-1.5 self-start px-2 h-5 text-[10px] font-bold uppercase tracking-wide text-accent bg-accent-soft border border-accent-line rounded-full">
          <AlertOctagon className="w-3 h-3" strokeWidth={2} />
          {dano.tipo}
        </span>
      )}
      <p className="text-[14px] leading-6 text-fg text-justify">{dano.descripcion ?? '—'}</p>
      {dano.fuente && <SourceBadge fuente={dano.fuente} />}
    </div>
  );
}

// =============================================================================
// Prueba card
// =============================================================================

function PruebaCard({ prueba }: { prueba: Prueba }) {
  const tipoKey = (prueba.tipo ?? 'otro').toLowerCase();
  const Icon = PRUEBA_TIPO_ICON[tipoKey] ?? FileQuestion;
  const tipoLabel = PRUEBA_TIPO_LABEL[tipoKey] ?? prueba.tipo ?? 'Otro';

  return (
    <div className="group flex gap-3 bg-bg border border-line rounded-[var(--radius-card)] p-4 transition-all duration-200 hover:border-accent-line hover:-translate-y-0.5">
      <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded bg-accent-soft text-accent border border-accent-line">
        <Icon className="w-4 h-4" strokeWidth={1.8} />
      </span>
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-fg-faint">
          {tipoLabel}
        </span>
        <p className="text-[14px] leading-6 text-fg text-justify">{prueba.descripcion ?? '—'}</p>
        {prueba.fuente && <SourceBadge fuente={prueba.fuente} />}
      </div>
    </div>
  );
}

// =============================================================================
// Peritaje card
// =============================================================================

function PeritajeCard({ peritaje }: { peritaje: Peritaje }) {
  return (
    <div className="group bg-bg border border-line rounded-[var(--radius-card)] p-4 transition-all duration-200 hover:border-accent-line">
      <div className="flex items-start gap-3">
        <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded bg-accent-soft text-accent border border-accent-line">
          <Microscope className="w-4 h-4" strokeWidth={1.8} />
        </span>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {peritaje.materia && (
            <h4 className="text-[14px] font-semibold text-fg leading-tight">{peritaje.materia}</h4>
          )}
          {peritaje.conclusion && (
            <p className="text-[13px] leading-6 text-fg-muted text-justify">{peritaje.conclusion}</p>
          )}
          {peritaje.fuente && <SourceBadge fuente={peritaje.fuente} />}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Source con página detectada
// =============================================================================

function parseFuente(fuente: string): { documento: string; pagina: string | null } {
  // Patrones: "demanda.pdf, p. 4", "demanda.pdf p.4", "demanda página 4", "fol. 12"
  const patterns = [
    /^(.+?)[,;\s]+(?:p(?:ág)?(?:ina)?\.?|fol(?:io)?\.?|hoja)\s*([\d-]+)\s*$/i,
    /^(.+?)\s*[-—–]\s*p(?:ág)?(?:ina)?\.?\s*([\d-]+)\s*$/i,
    /^(.+?)\s+#\s*([\d-]+)\s*$/,
  ];
  const trimmed = fuente.trim();
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) {
      return { documento: m[1].trim(), pagina: m[2].trim() };
    }
  }
  return { documento: trimmed, pagina: null };
}

function SourceBadge({ fuente }: { fuente: string }) {
  const { documento, pagina } = parseFuente(fuente);
  return (
    <span className="inline-flex items-center gap-1.5 self-start max-w-full bg-bg border border-line rounded-full pl-2 pr-1 py-0.5 text-[11px] text-fg-muted transition-colors hover:border-fg-muted">
      <FileText className="w-3 h-3 text-fg-faint shrink-0" strokeWidth={1.8} />
      <span className="truncate max-w-[220px] text-fg-muted" title={documento}>
        {documento}
      </span>
      {pagina && (
        <span className="inline-flex items-center gap-0.5 px-1.5 h-5 rounded-full bg-accent-soft text-accent border border-accent-line font-bold tabular-nums">
          <Hash className="w-2.5 h-2.5" strokeWidth={2.5} />
          {pagina}
        </span>
      )}
    </span>
  );
}

// =============================================================================
// Cuantía (sin cambios estructurales mayores)
// =============================================================================

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

type SoporteVariant = 'positive' | 'caution' | 'negative';

const SOPORTE_TONE: Record<string, { label: string; variant: SoporteVariant }> = {
  si: { label: 'Soportado', variant: 'positive' },
  soportado: { label: 'Soportado', variant: 'positive' },
  parcial: { label: 'Parcial', variant: 'caution' },
  discutible: { label: 'Discutible', variant: 'caution' },
  no: { label: 'Sin soporte', variant: 'negative' },
};

const SOPORTE_VARIANT_STYLES: Record<SoporteVariant, string> = {
  positive: 'bg-emerald-500/10 text-emerald-300',
  caution: 'bg-amber-500/10 text-amber-300',
  negative: 'bg-rose-500/10 text-rose-300',
};

function SoporteChip({ soporte }: { soporte: string | null | undefined }) {
  const key = (soporte ?? '').toLowerCase();
  const cfg = SOPORTE_TONE[key];
  if (!cfg) {
    if (soporte) return <span className="text-[13px] text-fg-muted">{soporte}</span>;
    return <span className="text-[13px] text-fg-faint">—</span>;
  }
  const dotClass =
    cfg.variant === 'positive'
      ? 'bg-emerald-400'
      : cfg.variant === 'caution'
      ? 'bg-amber-400'
      : 'bg-rose-400';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 h-6 text-[10px] font-bold uppercase tracking-wide rounded-full ${SOPORTE_VARIANT_STYLES[cfg.variant]}`}
    >
      <span aria-hidden className={`inline-block w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {cfg.label}
    </span>
  );
}

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
  const cuantificados = rubros.filter((r) => parseMonto(r.monto) !== null).length;

  return (
    <div className="flex flex-col gap-5">
      {cuantia.monto_total && (
        <div className="relative overflow-hidden bg-gradient-to-br from-accent-soft via-accent-soft/60 to-bg/30 border border-accent-line rounded-[var(--radius-card)] p-5 md:p-6">
          <div
            aria-hidden
            className="absolute -top-12 -right-12 w-[220px] h-[220px] bg-accent/15 blur-3xl pointer-events-none"
          />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-2 min-w-0">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                <Wallet className="w-3.5 h-3.5" strokeWidth={2} />
                Monto total reclamado
              </span>
              <span className="text-[2rem] md:text-[2.5rem] font-bold leading-none text-fg tabular-nums tracking-tight">
                {(() => {
                  const n = parseMonto(cuantia.monto_total);
                  return n !== null ? formatCOP(n) : cuantia.monto_total;
                })()}
              </span>
            </div>
            {rubros.length > 0 && (
              <div className="flex flex-col items-end gap-1 text-right shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-fg-faint">
                  Conceptos
                </span>
                <span className="text-[1.25rem] font-bold leading-none text-fg tabular-nums">
                  {rubros.length}
                </span>
                <span className="text-[11px] text-fg-muted">
                  {cuantificados} cuantificado{cuantificados === 1 ? '' : 's'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {rubros.length > 0 && (
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line bg-bg/40">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-line bg-surface/40">
                <th className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-fg-faint px-4 py-3">
                  Concepto
                </th>
                <th className="text-right text-[10px] font-bold uppercase tracking-[0.14em] text-fg-faint px-4 py-3 w-48">
                  Valor reclamado
                </th>
                <th className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-fg-faint px-4 py-3 w-36">
                  Soporte
                </th>
                <th className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-fg-faint px-4 py-3">
                  Observación
                </th>
              </tr>
            </thead>
            <tbody>
              {rubros.map((r, idx) => {
                const n = parseMonto(r.monto);
                return (
                  <tr
                    key={idx}
                    className="group relative border-b border-line/60 last:border-b-0 transition-colors hover:bg-accent-soft/30"
                  >
                    <td className="px-4 py-3.5 text-[14px] text-fg font-medium relative">
                      <span
                        aria-hidden
                        className="absolute left-0 top-2 bottom-2 w-px bg-accent origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
                      />
                      <span className="inline-flex items-center gap-2">
                        <span aria-hidden className="inline-block w-1 h-1 rounded-full bg-accent/60" />
                        {RUBRO_LABEL[r.rubro ?? ''] ?? r.rubro ?? '—'}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3.5 text-right tabular-nums font-bold ${
                        n !== null ? 'text-fg text-[15px]' : 'text-fg-faint text-[13px] italic'
                      }`}
                    >
                      {n !== null ? formatCOP(n) : r.monto ?? '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <SoporteChip soporte={r.soporte} />
                    </td>
                    <td className="px-4 py-3.5 text-[12.5px] text-fg-muted leading-snug">
                      {!n ? (
                        <span className="inline-flex items-center gap-1.5">
                          <AlertTriangle
                            className="w-3 h-3 text-amber-300 shrink-0"
                            strokeWidth={2}
                          />
                          Sin cuantificar en la demanda
                        </span>
                      ) : (
                        <span className="text-fg-faint">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {showSubtotal && (
                <tr className="bg-gradient-to-r from-accent-soft/70 via-accent-soft/30 to-transparent border-t-2 border-accent-line">
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                      <span aria-hidden className="h-px w-4 bg-accent" />
                      Subtotal calculado
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-[1.125rem] text-fg tabular-nums font-bold">
                    {formatCOP(subtotal)}
                  </td>
                  <td className="px-4 py-4" colSpan={2}>
                    <span className="text-[11px] text-fg-muted italic leading-snug">
                      Suma de los rubros con valor identificado · verificable por el abogado.
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
