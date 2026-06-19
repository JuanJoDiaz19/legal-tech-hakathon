'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type {
  AnalisisJuridico,
  RegimenAnalisis,
  ExoneracionAnalisis,
  PerjuicioAnalisis,
  RubroPerjuicio,
  TercerosAnalisis,
  Vinculacion,
} from '@/lib/api';
import { ViabilidadBar } from './ViabilidadBar';

const REGIMEN_LABEL: Record<string, string> = {
  subjetiva_culpa_probada: 'Subjetiva · culpa probada',
  subjetiva_culpa_presunta: 'Subjetiva · culpa presunta',
  actividad_peligrosa: 'Objetiva · actividad peligrosa',
  objetiva_actividad_peligrosa: 'Objetiva · actividad peligrosa',
  objetiva_producto: 'Objetiva · producto',
  medica: 'Responsabilidad médica',
  seguro_soat: 'Seguro SOAT',
  otro: 'Otro',
};

const CAUSAL_LABEL: Record<string, string> = {
  culpa_exclusiva_victima: 'Culpa exclusiva de la víctima',
  hecho_de_tercero: 'Hecho de un tercero',
  fuerza_mayor_caso_fortuito: 'Fuerza mayor / caso fortuito',
};

const RUBRO_LABEL: Record<string, string> = {
  dano_emergente: 'Daño emergente',
  lucro_cesante: 'Lucro cesante',
  dano_moral: 'Daño moral',
  perjuicios_morales: 'Perjuicios morales',
  dano_vida_relacion: 'Daño a la vida de relación',
  dano_a_la_vida_de_relacion: 'Daño a la vida de relación',
  dano_salud: 'Daño a la salud',
  dano_a_la_salud: 'Daño a la salud',
  otro: 'Otro',
};

const VINCULACION_LABEL: Record<string, string> = {
  llamamiento_en_garantia: 'Llamamiento en garantía',
  denuncia_del_pleito: 'Denuncia del pleito',
};

export function AnalisisSection({ analisis }: { analisis?: AnalisisJuridico | null }) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({
    regimen: true,
    exoneracion: true,
    perjuicio: true,
    terceros: true,
  });

  if (!analisis) {
    return <p className="text-sm text-fg-muted">No hay análisis jurídico disponible.</p>;
  }
  if (analisis.error) {
    return (
      <div className="bg-bg border border-red-500/40 rounded-[var(--radius-card)] p-4 text-sm text-red-400">
        Cadena de razonamiento falló: {analisis.error}
      </div>
    );
  }

  const visibleKeys: string[] = [];
  if (analisis.regimen) visibleKeys.push('regimen');
  if (analisis.exoneracion) visibleKeys.push('exoneracion');
  if (analisis.perjuicio) visibleKeys.push('perjuicio');
  if (analisis.terceros) visibleKeys.push('terceros');

  const allOpen = visibleKeys.every((k) => openMap[k]);
  const allClosed = visibleKeys.every((k) => !openMap[k]);

  const toggle = (key: string) =>
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));

  const setAll = (open: boolean) => {
    const next: Record<string, boolean> = { ...openMap };
    for (const k of visibleKeys) next[k] = open;
    setOpenMap(next);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end gap-1.5 -mb-2">
        <button
          type="button"
          onClick={() => setAll(true)}
          disabled={allOpen}
          className="text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-muted hover:text-fg transition-colors disabled:opacity-40 disabled:cursor-default px-2 py-1"
        >
          Expandir todo
        </button>
        <span aria-hidden className="text-fg-faint">·</span>
        <button
          type="button"
          onClick={() => setAll(false)}
          disabled={allClosed}
          className="text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-muted hover:text-fg transition-colors disabled:opacity-40 disabled:cursor-default px-2 py-1"
        >
          Colapsar todo
        </button>
      </div>

      {analisis.regimen && (
        <RegimenCard
          regimen={analisis.regimen}
          open={openMap.regimen}
          onToggle={() => toggle('regimen')}
        />
      )}
      {analisis.exoneracion && (
        <ExoneracionCard
          exoneracion={analisis.exoneracion}
          open={openMap.exoneracion}
          onToggle={() => toggle('exoneracion')}
        />
      )}
      {analisis.perjuicio && (
        <PerjuicioCard
          perjuicio={analisis.perjuicio}
          open={openMap.perjuicio}
          onToggle={() => toggle('perjuicio')}
        />
      )}
      {analisis.terceros && (
        <TercerosCard
          terceros={analisis.terceros}
          open={openMap.terceros}
          onToggle={() => toggle('terceros')}
        />
      )}
    </div>
  );
}

// =============================================================================
// Régimen
// =============================================================================

function RegimenCard({
  regimen,
  open,
  onToggle,
}: {
  regimen: RegimenAnalisis;
  open: boolean;
  onToggle: () => void;
}) {
  const label =
    regimen.etiqueta_legible ??
    REGIMEN_LABEL[regimen.regimen ?? ''] ??
    regimen.regimen ??
    'No determinado';
  const altLabel = regimen.regimen_alternativo
    ? REGIMEN_LABEL[regimen.regimen_alternativo] ?? regimen.regimen_alternativo
    : null;
  return (
    <StepCard step={1} title="Régimen de responsabilidad" open={open} onToggle={onToggle}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-3 h-8 text-sm font-semibold bg-accent-soft text-fg border border-accent-line rounded-[var(--radius-button)]">
            {label}
          </span>
          {regimen.nivel_confianza && (
            <ConfianzaBadge nivel={regimen.nivel_confianza} />
          )}
          {regimen.clasificacion_contestable && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 h-6 rounded-[var(--radius-button)]">
              <DotIcon />
              Clasificación contestable
            </span>
          )}
        </div>

        {regimen.fundamento_factico && (
          <Field label="Fundamento fáctico">{regimen.fundamento_factico}</Field>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {regimen.carga_de_la_prueba && (
            <KeyValueCard label="Carga de la prueba">
              {regimen.carga_de_la_prueba}
            </KeyValueCard>
          )}
          <KeyValueCard label="¿La diligencia exonera?">
            <BoolPill value={regimen.diligencia_exonera} />
          </KeyValueCard>
        </div>

        {regimen.consecuencia_probatoria && (
          <KeyValueCard label="Consecuencia probatoria" accent>
            {regimen.consecuencia_probatoria}
          </KeyValueCard>
        )}

        {regimen.fundamento_juridico && regimen.fundamento_juridico.length > 0 && (
          <div>
            <SubHeading>Fundamento jurídico</SubHeading>
            <ul className="flex flex-col gap-2">
              {regimen.fundamento_juridico.map((n, idx) => (
                <li
                  key={idx}
                  className="bg-bg border border-line rounded-[var(--radius-button)] p-3 flex items-start justify-between gap-3"
                >
                  <span className="text-sm text-fg">{n.norma ?? '—'}</span>
                  <Citas ids={n.citas} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {(altLabel || regimen.por_que_no_otro_regimen) && (
          <div className="bg-bg border border-line rounded-[var(--radius-card)] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FieldLabel>Régimen alternativo</FieldLabel>
              {altLabel && (
                <span className="inline-flex items-center px-2 h-5 text-[10px] font-semibold uppercase tracking-wide border border-line bg-surface text-fg-muted rounded-[var(--radius-button)]">
                  {altLabel}
                </span>
              )}
            </div>
            {regimen.por_que_no_otro_regimen && (
              <p className="text-sm leading-7 text-fg-muted text-justify">
                {regimen.por_que_no_otro_regimen}
              </p>
            )}
          </div>
        )}

        {regimen.estrategia_reclasificacion && (
          <Callout tone="accent" title="Estrategia de reclasificación">
            {regimen.estrategia_reclasificacion}
          </Callout>
        )}

        <CitasFooter ids={regimen.citas} />
      </div>
    </StepCard>
  );
}

// =============================================================================
// Exoneración
// =============================================================================

function ExoneracionCard({
  exoneracion,
  open,
  onToggle,
}: {
  exoneracion: ExoneracionAnalisis;
  open: boolean;
  onToggle: () => void;
}) {
  const nexo = exoneracion.elementos_nexo;
  const causales = exoneracion.causales_exoneracion ?? [];
  const nexoItems: Array<[string, string | undefined]> = [
    ['Conducta', nexo?.conducta],
    ['Daño', nexo?.dano],
    ['Nexo causal', nexo?.nexo_causal],
    ['Puntos débiles del nexo', nexo?.puntos_debiles_del_nexo],
  ];

  return (
    <StepCard step={2} title="Nexo causal y exoneración" open={open} onToggle={onToggle}>
      <div className="flex flex-col gap-6">
        {nexo && (
          <div>
            <SubHeading>Elementos del nexo</SubHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {nexoItems.map(([label, value]) =>
                value ? (
                  <KeyValueCard
                    key={label}
                    label={label}
                    accent={label === 'Puntos débiles del nexo'}
                  >
                    {value}
                  </KeyValueCard>
                ) : null,
              )}
            </div>
          </div>
        )}

        {causales.length > 0 && (
          <div>
            <SubHeading counter={causales.length}>Causales de exoneración</SubHeading>
            <div className="flex flex-col gap-3">
              {causales.map((c, idx) => (
                <CausalRow key={idx} causal={c} />
              ))}
            </div>
          </div>
        )}

        <CitasFooter ids={exoneracion.citas} />
      </div>
    </StepCard>
  );
}

function CausalRow({
  causal,
}: {
  causal: NonNullable<ExoneracionAnalisis['causales_exoneracion']>[number];
}) {
  const label = CAUSAL_LABEL[causal.causal ?? ''] ?? causal.causal ?? '—';
  return (
    <div className="bg-bg border border-line rounded-[var(--radius-card)] p-4 flex flex-col gap-4 transition-colors hover:border-fg-muted">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h4 className="text-sm font-semibold text-fg pt-1">{label}</h4>
        <ViabilidadBar
          nivel={causal.viabilidad}
          description="Probabilidad estimada de éxito de la causal con base en el material aportado."
          compact
        />
      </div>
      {causal.fundamento_factico && (
        <Field label="Fundamento fáctico">{causal.fundamento_factico}</Field>
      )}
      {causal.que_probar && <Field label="Qué probar">{causal.que_probar}</Field>}
      {causal.citas && causal.citas.length > 0 && (
        <div className="pt-1">
          <Citas ids={causal.citas} />
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Perjuicio
// =============================================================================

function PerjuicioCard({
  perjuicio,
  open,
  onToggle,
}: {
  perjuicio: PerjuicioAnalisis;
  open: boolean;
  onToggle: () => void;
}) {
  const rubros = perjuicio.rubros ?? [];
  return (
    <StepCard step={3} title="Cuestionamiento del perjuicio" open={open} onToggle={onToggle}>
      <div className="flex flex-col gap-5">
        {rubros.length > 0 ? (
          <div className="flex flex-col gap-3">
            {rubros.map((r, idx) => (
              <RubroRow key={idx} rubro={r} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-fg-muted italic">Sin rubros analizados.</p>
        )}

        {perjuicio.objecion_juramento_estimatorio && (
          <Callout tone="warning" title="Objeción al juramento estimatorio (art. 206 CGP)">
            {perjuicio.objecion_juramento_estimatorio}
          </Callout>
        )}

        {perjuicio.recordatorio_carga_prueba && (
          <Callout tone="accent" title="Recordatorio · carga de la prueba (art. 167 CGP)">
            {perjuicio.recordatorio_carga_prueba}
          </Callout>
        )}

        <CitasFooter ids={perjuicio.citas} />
      </div>
    </StepCard>
  );
}

function RubroRow({ rubro }: { rubro: RubroPerjuicio }) {
  const label = RUBRO_LABEL[rubro.rubro ?? ''] ?? rubro.rubro ?? '—';
  const monto = rubro.monto_reclamado && rubro.monto_reclamado !== 'null' ? rubro.monto_reclamado : null;
  return (
    <div className="bg-bg border border-line rounded-[var(--radius-card)] p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-semibold text-fg">{label}</h4>
          {monto && (
            <span className="text-sm text-fg-muted tabular-nums">{monto}</span>
          )}
        </div>
        <SoporteBadge soporte={rubro.soportado} />
      </div>
      {rubro.estandar_probatorio && (
        <Field label="Estándar probatorio">{rubro.estandar_probatorio}</Field>
      )}
      {rubro.deficiencia && <Field label="Deficiencia">{rubro.deficiencia}</Field>}
      {rubro.ataque && (
        <Field label="Ataque" accent>
          {rubro.ataque}
        </Field>
      )}
      {rubro.herramienta_procesal && (
        <Field label="Herramienta procesal">{rubro.herramienta_procesal}</Field>
      )}
      {rubro.pruebas_de_descargo && rubro.pruebas_de_descargo.length > 0 && (
        <div>
          <FieldLabel>Pruebas de descargo</FieldLabel>
          <ul className="flex flex-col gap-1.5">
            {rubro.pruebas_de_descargo.map((p, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-fg leading-6">
                <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {rubro.citas && rubro.citas.length > 0 && (
        <div className="pt-1">
          <Citas ids={rubro.citas} />
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Terceros
// =============================================================================

function TercerosCard({
  terceros,
  open,
  onToggle,
}: {
  terceros: TercerosAnalisis;
  open: boolean;
  onToggle: () => void;
}) {
  const vinculaciones = terceros.vinculaciones ?? [];
  return (
    <StepCard step={4} title="Vinculación de terceros" open={open} onToggle={onToggle}>
      <div className="flex flex-col gap-5">
        {vinculaciones.length > 0 ? (
          <div className="flex flex-col gap-3">
            {vinculaciones.map((v, idx) => (
              <VinculacionRow key={idx} vinculacion={v} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-fg-muted italic">
            No se identificaron terceros para vincular.
          </p>
        )}

        <CitasFooter ids={terceros.citas} />
      </div>
    </StepCard>
  );
}

function VinculacionRow({ vinculacion }: { vinculacion: Vinculacion }) {
  const tipo = VINCULACION_LABEL[vinculacion.tipo ?? ''] ?? vinculacion.tipo ?? '—';
  return (
    <div className="bg-bg border border-line rounded-[var(--radius-card)] p-4 flex flex-col gap-4 transition-colors hover:border-fg-muted">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3 pt-1">
          <span className="inline-flex items-center px-2 h-6 text-[11px] font-semibold uppercase tracking-wide border border-line bg-surface text-fg-muted rounded-[var(--radius-button)]">
            {tipo}
          </span>
          {vinculacion.destinatario && (
            <span className="text-sm font-semibold text-fg">{vinculacion.destinatario}</span>
          )}
        </div>
        <ViabilidadBar
          nivel={vinculacion.viabilidad}
          description="Probabilidad de éxito de la vinculación de este tercero al proceso."
          compact
        />
      </div>
      {vinculacion.justificacion && (
        <Field label="Justificación">{vinculacion.justificacion}</Field>
      )}
      {vinculacion.requisitos && (
        <Field label="Requisitos">{vinculacion.requisitos}</Field>
      )}
      {vinculacion.citas && vinculacion.citas.length > 0 && (
        <div className="pt-1">
          <Citas ids={vinculacion.citas} />
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Helpers compartidos
// =============================================================================

function StepCard({
  step,
  title,
  children,
  open,
  onToggle,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  const contentId = `step-card-${step}`;
  return (
    <section className="relative bg-gradient-to-b from-surface/60 to-bg/50 border border-line rounded-[var(--radius-card)] p-5 md:p-7 transition-colors hover:border-accent-line/60">
      <span
        aria-hidden
        className="absolute left-0 top-6 bottom-6 w-px bg-gradient-to-b from-accent/70 via-line to-transparent"
      />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={contentId}
        className={`w-full group flex items-center gap-3 text-left ${
          open ? 'mb-6 pb-4 border-b border-accent-line' : ''
        }`}
      >
        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold text-fg bg-transparent border border-accent-line rounded-full tabular-nums shrink-0">
          {step}
        </span>
        <h3 className="flex-1 text-base md:text-lg font-semibold text-fg tracking-tight">
          {title}
        </h3>
        <span
          className={`inline-flex items-center justify-center w-7 h-7 text-fg-muted group-hover:text-fg transition-all duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
          aria-hidden
        >
          <ChevronDown className="w-4 h-4" strokeWidth={2} />
        </span>
      </button>
      <div id={contentId} hidden={!open}>
        {children}
      </div>
    </section>
  );
}

function SubHeading({
  children,
  counter,
}: {
  children: React.ReactNode;
  counter?: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-muted">
        {children}
      </h4>
      {counter !== undefined && (
        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-semibold text-fg-muted bg-surface border border-line rounded-full">
          {counter}
        </span>
      )}
    </div>
  );
}

function KeyValueCard({
  label,
  children,
  accent,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  const border = accent ? 'border-accent-line' : 'border-line';
  return (
    <div className={`bg-bg border ${border} rounded-[var(--radius-button)] p-3`}>
      <FieldLabel>{label}</FieldLabel>
      <div className="text-sm leading-6 text-fg">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
  accent,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <p className={`text-sm leading-7 text-justify ${accent ? 'text-fg' : 'text-fg-muted'}`}>
        {children}
      </p>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-fg-faint mb-1">
      {children}
    </p>
  );
}

function Callout({
  tone,
  title,
  children,
}: {
  tone: 'accent' | 'warning';
  title: string;
  children: React.ReactNode;
}) {
  const styles =
    tone === 'warning'
      ? 'bg-amber-500/5 border-amber-500/30'
      : 'bg-accent-soft border-accent-line';
  return (
    <div className={`${styles} border rounded-[var(--radius-button)] p-4`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted mb-1.5">
        {title}
      </p>
      <p className="text-sm leading-7 text-fg text-justify">{children}</p>
    </div>
  );
}

function ConfianzaBadge({ nivel }: { nivel: string }) {
  const map: Record<string, string> = {
    alto: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    medio: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    bajo: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  };
  const tone = map[nivel] ?? 'bg-bg text-fg-muted border-line';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 h-6 text-[10px] font-semibold uppercase tracking-wide border rounded-[var(--radius-button)] ${tone}`}
    >
      Confianza: {nivel}
    </span>
  );
}

function SoporteBadge({ soporte }: { soporte?: string }) {
  if (!soporte) return null;
  const map: Record<string, { tone: string; label: string }> = {
    si: {
      tone: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      label: 'Soportado',
    },
    parcial: {
      tone: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      label: 'Parcial',
    },
    no: {
      tone: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      label: 'Sin soporte',
    },
    no_cuantificado: {
      tone: 'bg-bg text-fg-muted border-line',
      label: 'Sin cuantificar',
    },
  };
  const v = map[soporte] ?? { tone: 'bg-bg text-fg-muted border-line', label: soporte };
  return (
    <span
      className={`inline-flex items-center px-2 h-6 text-[10px] font-semibold uppercase tracking-wide border rounded-[var(--radius-button)] ${v.tone}`}
    >
      {v.label}
    </span>
  );
}

function BoolPill({ value }: { value?: boolean }) {
  if (value === undefined || value === null) {
    return <span className="text-sm text-fg-faint italic">No determinado</span>;
  }
  return value ? (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-300">
      <CheckIcon /> Sí
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-300">
      <XIcon /> No
    </span>
  );
}

function Citas({ ids }: { ids?: string[] }) {
  if (!ids || ids.length === 0) return null;
  return (
    <div className="inline-flex flex-wrap gap-1">
      {ids.map((id) => (
        <span
          key={id}
          className="inline-flex items-center px-1.5 h-5 text-[10px] font-mono font-semibold text-accent bg-accent-soft border border-accent-line rounded"
        >
          {id.replace(/^\[|\]$/g, '')}
        </span>
      ))}
    </div>
  );
}

function CitasFooter({ ids }: { ids?: string[] }) {
  if (!ids || ids.length === 0) return null;
  return (
    <div className="flex items-center gap-2 pt-3 border-t border-line">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-fg-faint">
        Fuentes citadas
      </span>
      <Citas ids={ids} />
    </div>
  );
}

function DotIcon() {
  return <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />;
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
