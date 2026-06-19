'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { takeDraft } from '@/lib/draftStore';
import {
  analizarCaso,
  descargarFichaHechos,
  descargarMemoPdf,
  type AnalisisHechos,
  type AnalisisJuridico,
} from '@/lib/api';
import { MemoSection } from './sections/MemoSection';
import { HechosSection } from './sections/HechosSection';
import { AnalisisSection } from './sections/AnalisisSection';
import { FuentesSection } from './sections/FuentesSection';
import { ConsultaSection } from './sections/ConsultaSection';
import { CaseHeader } from './sections/CaseHeader';
import { DocumentosSection } from './sections/DocumentosSection';

export type CasoRow = {
  id: string;
  title: string;
  client: string | null;
  status: string;
  analysis_status: 'pending' | 'done' | 'error';
  analysis: {
    hechos?: AnalisisHechos;
    analisis?: AnalisisJuridico | null;
    archivos_por_categoria?: Record<string, string[]>;
  } | null;
  memo_markdown: string | null;
  analysis_error: string | null;
  created_at: string;
};

export type CaseDocument = {
  id: string;
  categoria: 'demanda' | 'pruebas' | 'anexos' | 'poderes';
  storage_path: string;
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
  uploaded_by: string;
};

type Estado =
  | { kind: 'inicial' }
  | { kind: 'procesando'; mensaje: string }
  | { kind: 'listo'; hechos?: AnalisisHechos; analisis?: AnalisisJuridico | null; memo: string | null }
  | { kind: 'error'; mensaje: string }
  | { kind: 'interrumpido' };

const TABS = ['memo', 'hechos', 'analisis', 'documentos', 'fuentes', 'consulta'] as const;
type Tab = (typeof TABS)[number];

export function ResultadoView({
  caso,
  documents,
}: {
  caso: CasoRow;
  documents: CaseDocument[];
}) {
  const [estado, setEstado] = useState<Estado>(() => {
    if (caso.analysis_status === 'done' && caso.analysis) {
      return {
        kind: 'listo',
        hechos: caso.analysis.hechos,
        analisis: caso.analysis.analisis,
        memo: caso.memo_markdown,
      };
    }
    if (caso.analysis_status === 'error') {
      return { kind: 'error', mensaje: caso.analysis_error ?? 'Error desconocido.' };
    }
    return { kind: 'inicial' };
  });
  const [tab, setTab] = useState<Tab>('memo');
  const ranRef = useRef(false);

  useEffect(() => {
    if (caso.analysis_status !== 'pending') return;
    if (ranRef.current) return;
    ranRef.current = true;

    const draft = takeDraft(caso.id);
    if (!draft) {
      setEstado({ kind: 'interrumpido' });
      return;
    }

    setEstado({ kind: 'procesando', mensaje: 'Analizando documentos…' });

    (async () => {
      try {
        const resp = await analizarCaso(draft);
        const supabase = createClient();
        const memo = resp.memo ?? resp.analisis?.memo_markdown ?? null;
        const { error } = await supabase
          .from('cases')
          .update({
            analysis_status: 'done',
            analysis: {
              hechos: resp.hechos,
              analisis: resp.analisis,
              archivos_por_categoria: resp.archivos_por_categoria,
            },
            memo_markdown: memo,
            analysis_error: null,
          })
          .eq('id', caso.id);
        if (error) {
          throw new Error(`Análisis OK pero falló al guardar: ${error.message}`);
        }
        setEstado({ kind: 'listo', hechos: resp.hechos, analisis: resp.analisis, memo });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Error desconocido.';
        const supabase = createClient();
        await supabase
          .from('cases')
          .update({ analysis_status: 'error', analysis_error: msg })
          .eq('id', caso.id);
        setEstado({ kind: 'error', mensaje: msg });
      }
    })();
  }, [caso.id, caso.analysis_status]);

  const hechosActuales = estado.kind === 'listo' ? estado.hechos : caso.analysis?.hechos;

  return (
    <div className="flex flex-col gap-10">
      <CaseHeader
        initialTitle={caso.title}
        client={caso.client}
        initialStatus={caso.status}
        createdAt={caso.created_at}
        hechos={hechosActuales}
        topRight={<EstadoBadge estado={estado} />}
      />

      {estado.kind === 'listo' && (
        <DescargarPdfsBotones
          hechos={estado.hechos}
          analisis={estado.analisis}
          title={caso.title}
        />
      )}

      {estado.kind === 'procesando' && <ProcessingPanel mensaje={estado.mensaje} />}

      {estado.kind !== 'listo' && documents.length > 0 && (
        <div className="bg-surface border border-line rounded-[var(--radius-card)] p-6 md:p-8">
          <DocumentosSection documents={documents} />
        </div>
      )}

      {estado.kind === 'interrumpido' && (
        <div className="bg-surface border border-line rounded-[var(--radius-card)] p-6">
          <h2 className="text-lg font-semibold text-fg mb-2">Análisis interrumpido</h2>
          <p className="text-sm text-fg-muted mb-4">
            El análisis no llegó a iniciarse o se perdió el contexto (por ejemplo,
            refrescaste la página antes de que terminara). Crea el caso de nuevo
            para volver a procesar los documentos.
          </p>
          <Link
            href="/dashboard/casos/nuevo"
            className="inline-flex items-center h-9 px-4 bg-accent text-fg border border-accent rounded-[var(--radius-button)] text-sm font-semibold hover:bg-accent-hover"
          >
            Crear caso de nuevo
          </Link>
        </div>
      )}

      {estado.kind === 'error' && (
        <div className="bg-surface border border-red-500/40 rounded-[var(--radius-card)] p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-2">
            El análisis falló
          </h2>
          <pre className="text-xs text-fg-muted whitespace-pre-wrap break-words">
            {estado.mensaje}
          </pre>
          <Link
            href="/dashboard/casos/nuevo"
            className="mt-4 inline-flex items-center h-9 px-4 bg-accent text-fg border border-accent rounded-[var(--radius-button)] text-sm font-semibold hover:bg-accent-hover"
          >
            Reintentar con un caso nuevo
          </Link>
        </div>
      )}

      {estado.kind === 'listo' && (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <aside className="md:w-64 md:shrink-0 w-full md:sticky md:top-24">
            <nav
              aria-label="Secciones del caso"
              className="bg-surface border border-line rounded-[var(--radius-card)] p-2.5 flex flex-col gap-1.5"
            >
              {TABS.map((t) => {
                const active = tab === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`group text-left rounded-[var(--radius-button)] px-4 py-4 transition-colors border flex items-center gap-3 ${
                      active
                        ? 'bg-accent-soft border-accent-line'
                        : 'bg-transparent border-transparent hover:bg-bg hover:border-line'
                    }`}
                  >
                    <span
                      className={`shrink-0 ${
                        active ? 'text-accent' : 'text-fg-muted group-hover:text-fg'
                      }`}
                    >
                      {tabIcon(t)}
                    </span>
                    <span
                      className={`text-[15px] font-semibold ${
                        active ? 'text-fg' : 'text-fg-muted group-hover:text-fg'
                      }`}
                    >
                      {tabLabel(t)}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            <div className="bg-surface border border-line rounded-[var(--radius-card)] p-6 md:p-10">
              {tab === 'memo' && <MemoSection markdown={estado.memo} />}
              {tab === 'hechos' && <HechosSection hechos={estado.hechos} />}
              {tab === 'analisis' && <AnalisisSection analisis={estado.analisis} />}
              {tab === 'documentos' && <DocumentosSection documents={documents} />}
              {tab === 'fuentes' && (
                <FuentesSection fuentes={estado.analisis?.fuentes} />
              )}
              {tab === 'consulta' && (
                <ConsultaSection
                  hechos={estado.hechos}
                  analisis={estado.analisis}
                  caseTitle={caso.title}
                />
              )}
            </div>
            {estado.analisis?.disclaimer && (
              <p className="text-xs text-fg-faint italic">
                {estado.analisis.disclaimer}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function tabLabel(t: Tab): string {
  switch (t) {
    case 'memo':
      return 'Memorando';
    case 'hechos':
      return 'Hechos';
    case 'analisis':
      return 'Análisis jurídico';
    case 'documentos':
      return 'Documentos';
    case 'fuentes':
      return 'Fuentes';
    case 'consulta':
      return 'Consultar análisis';
  }
}

function tabIcon(t: Tab) {
  const props = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (t) {
    case 'memo':
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8M8 17h5" />
        </svg>
      );
    case 'hechos':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'analisis':
      return (
        <svg {...props}>
          <path d="M12 3v18" />
          <path d="M5 9l-2 4 2 4 2-4z" />
          <path d="M19 9l-2 4 2 4 2-4z" />
          <path d="M5 7h14" />
        </svg>
      );
    case 'documentos':
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" />
          <line x1="9" y1="18" x2="13" y2="18" />
        </svg>
      );
    case 'fuentes':
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 'consulta':
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10h.01M12 10h.01M16 10h.01" />
        </svg>
      );
  }
}

function EstadoBadge({ estado }: { estado: Estado }) {
  const map: Record<Estado['kind'], { label: string; className: string }> = {
    inicial: { label: 'Inicializando', className: 'bg-bg text-fg-muted border-line' },
    procesando: {
      label: 'Procesando',
      className: 'bg-accent-soft text-fg border-accent-line',
    },
    listo: { label: 'Análisis listo', className: 'bg-bg text-fg border-line' },
    error: {
      label: 'Error',
      className: 'bg-red-500/10 text-red-400 border-red-500/40',
    },
    interrumpido: {
      label: 'Interrumpido',
      className: 'bg-bg text-fg-muted border-line',
    },
  };
  const { label, className } = map[estado.kind];
  return (
    <span
      className={`inline-flex items-center px-2.5 h-6 text-[11px] font-semibold uppercase tracking-wide border rounded-[var(--radius-button)] ${className}`}
    >
      {label}
    </span>
  );
}

const PROCESSING_STEPS = [
  'Procesando expediente…',
  'Identificando hechos relevantes…',
  'Analizando fuentes jurídicas…',
  'Construyendo matriz de riesgos…',
  'Cuantificando perjuicios…',
  'Generando insumos estratégicos…',
] as const;

function ProcessingPanel({ mensaje }: { mensaje: string }) {
  const [stepIdx, setStepIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx((i) => (i + 1) % PROCESSING_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-surface to-bg/80 border border-line rounded-[var(--radius-card)] p-10 flex flex-col items-center gap-5 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(128,24,23,0.18),transparent_70%)] pointer-events-none"
      />
      <div className="relative">
        <div className="w-14 h-14 border-2 border-line border-t-accent rounded-full animate-spin" />
        <div className="absolute inset-1 border border-accent/30 rounded-full animate-pulse" />
      </div>
      <div className="relative flex flex-col items-center gap-2 min-h-[64px]">
        <p className="text-sm font-semibold text-fg">{mensaje}</p>
        <p
          key={stepIdx}
          className="text-[13px] text-accent transition-opacity duration-500"
          style={{ animation: 'fadeIn 500ms ease' }}
        >
          {PROCESSING_STEPS[stepIdx]}
        </p>
      </div>
      <div className="relative w-full max-w-sm flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-3 bg-bg border border-line rounded overflow-hidden relative"
          >
            <span
              className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-[shimmer_1.6s_infinite]"
              style={{
                animation: `shimmer 1.6s ${i * 0.2}s infinite linear`,
              }}
            />
          </div>
        ))}
      </div>
      <p className="relative text-xs text-fg-faint text-center max-w-md">
        Esto puede tardar entre 20 y 60 segundos según el tamaño de los archivos.
        No cierres la pestaña.
      </p>
    </div>
  );
}

function DescargarPdfsBotones({
  hechos,
  analisis,
  title,
}: {
  hechos?: AnalisisHechos;
  analisis?: AnalisisJuridico | null;
  title: string;
}) {
  const [busy, setBusy] = useState<'ficha' | 'memo' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const safeName = title.replace(/[^a-z0-9\-_]+/gi, '_').slice(0, 60) || 'caso';

  async function handleClick(tipo: 'ficha' | 'memo') {
    if (busy) return;
    setError(null);
    setBusy(tipo);
    try {
      if (tipo === 'ficha') {
        if (!hechos) throw new Error('No hay hechos para generar el PDF.');
        await descargarFichaHechos(hechos, `${safeName}__ficha.pdf`);
      } else {
        if (!analisis) throw new Error('No hay análisis para generar el memorando.');
        await descargarMemoPdf(analisis, `${safeName}__memorando.pdf`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al generar el PDF.';
      setError(msg);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center gap-4">
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent to-accent-line" />
        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.32em] text-fg-muted">
          <span aria-hidden className="text-accent">§</span>
          Anexos exportables
          <span aria-hidden className="text-accent">§</span>
        </span>
        <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-line" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ExportCard
          onClick={() => handleClick('ficha')}
          loading={busy === 'ficha'}
          disabled={!hechos || busy !== null}
          numeral="I"
          title="Ficha del caso"
          description="Resumen ejecutivo · hechos, partes y daños alegados."
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="13" y2="17" />
            </svg>
          }
        />
        <ExportCard
          onClick={() => handleClick('memo')}
          loading={busy === 'memo'}
          disabled={!analisis || busy !== null}
          numeral="II"
          title="Memorando"
          description="Análisis jurídico estructurado · estrategia defensiva."
          primary
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m14.5 12.5-8 8a2.12 2.12 0 1 1-3-3l8-8" />
              <path d="m16 16 6-6" />
              <path d="m8 8 6-6" />
              <path d="m9 7 8 8" />
              <path d="m21 11-8-8" />
            </svg>
          }
        />
      </div>

      {error && (
        <span className="text-[11px] text-rose-400" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

function ExportCard({
  onClick,
  loading,
  disabled,
  numeral,
  title,
  description,
  icon,
  primary,
}: {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  numeral: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex items-stretch text-left rounded-[var(--radius-card)] border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        primary
          ? 'bg-accent-soft border-accent-line hover:border-accent enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_24px_rgba(128,24,23,0.35)]'
          : 'bg-surface/60 border-line hover:border-accent-line enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_24px_rgba(0,0,0,0.3)]'
      }`}
    >
      {/* Sello del icono */}
      <div className="shrink-0 flex items-center pl-4 pr-3 py-4">
        <span
          className={`inline-flex items-center justify-center w-11 h-11 rounded-full border transition-transform duration-300 ${
            primary
              ? 'bg-accent text-fg border-accent'
              : 'bg-bg text-fg border-accent-line'
          } ${disabled ? '' : 'group-hover:rotate-[-4deg]'}`}
          aria-hidden
        >
          {icon}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-4 pr-4">
        <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-accent">
          Anexo · {numeral}
        </span>
        <h4 className="text-[1rem] font-semibold leading-tight text-fg mt-1 tracking-tight">
          {title}
        </h4>
        <p className="text-[11.5px] leading-snug text-fg-muted mt-1.5">{description}</p>
      </div>

      {/* Botón circular de descarga */}
      <div className="shrink-0 flex items-center pr-4">
        <span
          className={`inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 ${
            primary
              ? 'bg-bg/40 text-fg border-fg/20 group-hover:bg-fg group-hover:text-accent group-hover:border-fg'
              : 'bg-transparent text-fg-muted border-line group-hover:bg-accent group-hover:text-fg group-hover:border-accent'
          } ${disabled ? '' : 'group-hover:translate-y-0.5'}`}
          aria-hidden
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v13" />
              <polyline points="7 11 12 16 17 11" />
              <line x1="5" y1="21" x2="19" y2="21" />
            </svg>
          )}
        </span>
      </div>
    </button>
  );
}
