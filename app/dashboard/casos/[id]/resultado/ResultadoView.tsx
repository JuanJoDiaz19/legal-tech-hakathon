'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { takeDraft } from '@/lib/draftStore';
import {
  analizarCaso,
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
        <EstadoBadge estado={estado} />
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
        <>
          <nav className="flex items-center gap-1 border-b border-line">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`h-10 px-4 text-sm font-medium transition-colors -mb-px border-b-2 ${
                  tab === t
                    ? 'text-fg border-accent'
                    : 'text-fg-muted border-transparent hover:text-fg'
                }`}
              >
                {tabLabel(t)}
              </button>
            ))}
          </nav>

          <div className="bg-surface border border-line rounded-[var(--radius-card)] p-6 md:p-10">
            {tab === 'memo' && <MemoSection markdown={estado.memo} />}
            {tab === 'hechos' && <HechosSection hechos={estado.hechos} />}
            {tab === 'analisis' && <AnalisisSection analisis={estado.analisis} />}
            {tab === 'fuentes' && (
              <FuentesSection fuentes={estado.analisis?.fuentes} />
            )}
          </div>

          {estado.analisis?.disclaimer && (
            <p className="text-xs text-fg-faint italic">{estado.analisis.disclaimer}</p>
          )}
        </>
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
