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

type Estado =
  | { kind: 'inicial' }
  | { kind: 'procesando'; mensaje: string }
  | { kind: 'listo'; hechos?: AnalisisHechos; analisis?: AnalisisJuridico | null; memo: string | null }
  | { kind: 'error'; mensaje: string }
  | { kind: 'interrumpido' };

const TABS = ['memo', 'hechos', 'analisis', 'fuentes'] as const;
type Tab = (typeof TABS)[number];

export function ResultadoView({ caso }: { caso: CasoRow }) {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-fg mb-1">
            {caso.title}
          </h1>
          <p className="text-sm text-fg-muted">
            {caso.client ? `Cliente: ${caso.client} · ` : ''}
            Estado: {caso.status} · Creado{' '}
            {new Date(caso.created_at).toLocaleDateString('es-CO')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {estado.kind === 'listo' && (
            <DescargarPdfsBotones
              hechos={estado.hechos}
              analisis={estado.analisis}
              title={caso.title}
            />
          )}
          <EstadoBadge estado={estado} />
        </div>
      </div>

      {estado.kind === 'procesando' && <ProcessingPanel mensaje={estado.mensaje} />}

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
              {tab === 'fuentes' && (
                <FuentesSection fuentes={estado.analisis?.fuentes} />
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
    case 'fuentes':
      return 'Fuentes';
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
    case 'fuentes':
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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

function ProcessingPanel({ mensaje }: { mensaje: string }) {
  return (
    <div className="bg-surface border border-line rounded-[var(--radius-card)] p-8 flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-line border-t-accent rounded-full animate-spin" />
      <p className="text-sm text-fg-muted">{mensaje}</p>
      <p className="text-xs text-fg-faint text-center max-w-md">
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
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <PdfButton
          onClick={() => handleClick('ficha')}
          loading={busy === 'ficha'}
          disabled={!hechos || busy !== null}
          label="Ficha del caso"
        />
        <PdfButton
          onClick={() => handleClick('memo')}
          loading={busy === 'memo'}
          disabled={!analisis || busy !== null}
          label="Memorando"
          primary
        />
      </div>
      {error && (
        <span className="text-[11px] text-red-400 max-w-xs text-right">{error}</span>
      )}
    </div>
  );
}

function PdfButton({
  onClick,
  loading,
  disabled,
  label,
  primary,
}: {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  label: string;
  primary?: boolean;
}) {
  const base =
    'h-9 inline-flex items-center gap-2 px-3 text-sm font-semibold border rounded-[var(--radius-button)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const styles = primary
    ? 'bg-accent text-fg border-accent hover:bg-accent-hover hover:border-accent-hover'
    : 'bg-transparent text-fg-muted border-line hover:text-fg hover:border-fg-muted';
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )}
      {label}
    </button>
  );
}
