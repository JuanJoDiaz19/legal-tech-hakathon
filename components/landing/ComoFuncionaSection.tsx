'use client';

import { useEffect, useRef, useState } from 'react';
import { FileUp, Layers, Gavel, AlertTriangle, FileCheck } from 'lucide-react';

const STEPS = [
  {
    icon: FileUp,
    title: 'Carga del expediente o demanda',
    desc: 'Sube la demanda, anexos, peritajes y pruebas. Elenchos acepta múltiples formatos y mantiene la trazabilidad de cada documento.',
  },
  {
    icon: Layers,
    title: 'Extracción y organización de información',
    desc: 'Identifica partes procesales, fechas, hechos, pretensiones y categoriza la prueba documental para un análisis ordenado.',
  },
  {
    icon: Gavel,
    title: 'Análisis jurídico, fáctico y probatorio',
    desc: 'Determina el régimen aplicable, evalúa la carga de la prueba, contrasta hechos con normas vigentes y construye la matriz defensiva.',
  },
  {
    icon: AlertTriangle,
    title: 'Identificación de riesgos, cuantía, fuentes y viabilidad',
    desc: 'Cuestiona la liquidación de perjuicios, detecta causales de exoneración y entrega un indicador de viabilidad con su justificación.',
  },
  {
    icon: FileCheck,
    title: 'Generación de insumos estratégicos',
    desc: 'Produce un memorando ejecutivo, ficha de hechos y recomendaciones accionables para que el abogado decida la estrategia.',
  },
] as const;

export function ComoFuncionaSection() {
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            setVisibleSteps((prev) => {
              if (prev.has(idx)) return prev;
              const next = new Set(prev);
              next.add(idx);
              return next;
            });
          }
        }
      },
      { threshold: 0.2 },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="como-funciona"
      aria-labelledby="cf-heading"
      className="relative px-6 md:px-12 xl:px-24 py-16 md:py-24 border-t border-line overflow-hidden scroll-mt-[80px]"
    >
      <div
        aria-hidden
        className="absolute -top-32 left-1/3 w-[600px] h-[300px] bg-accent/8 blur-3xl pointer-events-none"
      />
      <div className="relative max-w-[1280px] mx-auto">
        <div className="mb-14 max-w-[720px]">
          <span className="block mb-4 text-xs font-semibold tracking-[0.15em] uppercase text-accent">
            Cómo funciona
          </span>
          <h2
            id="cf-heading"
            className="text-[1.75rem] md:text-4xl font-bold leading-tight tracking-tight text-fg"
          >
            Del documento crudo al insumo estratégico, en cinco pasos
          </h2>
        </div>

        <ol className="relative flex flex-col gap-6 md:gap-8">
          <span
            aria-hidden
            className="hidden md:block absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-line to-transparent"
          />
          {STEPS.map(({ icon: Icon, title, desc }, idx) => {
            const visible = visibleSteps.has(idx);
            return (
              <li
                key={title}
                ref={(el) => {
                  refs.current[idx] = el;
                }}
                data-idx={idx}
                className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-6 transition-all duration-700 ease-out"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${idx * 80}ms`,
                }}
              >
                <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-2 md:w-[56px] shrink-0">
                  <span className="relative inline-flex items-center justify-center w-[56px] h-[56px] rounded-full bg-bg border border-accent-line text-accent shadow-[0_0_0_4px_var(--color-bg),0_0_0_5px_var(--color-line)]">
                    <Icon className="w-5 h-5" strokeWidth={1.6} />
                  </span>
                </div>

                <div className="flex-1 pb-2 md:pt-2">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent tabular-nums">
                      Paso {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold tracking-tight text-fg mb-2">
                    {title}
                  </h3>
                  <p className="text-[0.9375rem] leading-relaxed text-fg-muted max-w-[680px] text-justify">
                    {desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
