'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Feature {
  icon: ReactNode;
  title: string;
  desc: string;
  image: string;
  imageAlt: string;
}

const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const FEATURES: readonly Feature[] = [
  {
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 3v18M7 21h10M5 7l-3 6a3 3 0 0 0 6 0l-3-6zM19 7l-3 6a3 3 0 0 0 6 0l-3-6zM5 7l7-2 7 2" />
      </svg>
    ),
    title: 'Régimen de responsabilidad',
    desc: 'Determina si la demanda fundamenta responsabilidad subjetiva (culpa probada) u objetiva (actividad peligrosa, riesgo creado). Define la carga de la prueba y el estándar defensivo.',
    image: '/features/regimen.png',
    imageAlt: 'Dos páginas de un código legal contrastadas por una IA, con párrafos delimitados y tarjetas de análisis al margen',
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: 'Causales de exoneración',
    desc: 'Identifica indicios de culpa exclusiva de la víctima, fuerza mayor, caso fortuito o hecho determinante de un tercero en los hechos y pruebas aportados con la demanda.',
    image: '/features/exoneracion.png',
    imageAlt: 'Página de una demanda con tres párrafos resaltados y tarjetas flotantes que identifican causales de exoneración',
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M11 8v3M11 14h.01" />
      </svg>
    ),
    title: 'Cuestionamiento del perjuicio',
    desc: 'Revisa daño emergente, lucro cesante, daño moral y daño a la vida de relación. Señala conceptos sobrevalorados, periodos no acreditados o bases de cálculo cuestionables.',
    image: '/features/perjuicio.png',
    imageAlt: 'Tabla de perjuicios con cifras tachadas en tinta oxblood y chips de recalculo conectados por vectores',
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Vinculación de terceros',
    desc: 'Detecta fabricantes, contratistas, empleadores u otras personas que deban ser llamadas en garantía o demandadas conjuntamente.',
    image: '/features/terceros.png',
    imageAlt: 'Dossier central de demanda conectado por hilos a cuatro documentos periféricos que representan terceros vinculables',
  },
] as const;

export function FeaturesGrid() {
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            setVisible((prev) => {
              if (prev.has(idx)) return prev;
              const next = new Set(prev);
              next.add(idx);
              return next;
            });
          }
        }
      },
      { threshold: 0.15 },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="analisis"
      aria-labelledby="features-heading"
      className="relative px-6 md:px-12 xl:px-24 py-16 md:py-24 border-t border-line scroll-mt-[80px] overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute -bottom-32 right-1/4 w-[520px] h-[280px] bg-accent/5 blur-3xl pointer-events-none"
      />
      <div aria-hidden className="hidden md:block absolute inset-0 pointer-events-none">
        <span className="absolute top-0 bottom-0 w-px bg-white/[0.04]" style={{ left: '33%' }} />
        <span className="absolute top-0 bottom-0 w-px bg-white/[0.04]" style={{ left: '66%' }} />
      </div>
      <div className="relative max-w-[1280px] mx-auto">
        <div className="mb-12 max-w-[720px]">
          <span className="block mb-4 text-xs font-semibold tracking-[0.15em] uppercase text-accent">
            Cuatro ejes de análisis
          </span>
          <h2
            id="features-heading"
            className="text-[1.75rem] md:text-4xl font-bold leading-tight tracking-tight text-fg"
          >
            La lógica defensiva, instrumentada
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {FEATURES.map((f, idx) => {
            const isVisible = visible.has(idx);
            return (
              <article
                key={f.title}
                ref={(el) => {
                  refs.current[idx] = el;
                }}
                data-idx={idx}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
                  transitionDelay: `${idx * 90}ms`,
                }}
                className="group relative bg-surface/50 backdrop-blur-sm border border-line rounded-[var(--radius-card)] overflow-hidden transition-all duration-700 ease-out hover:border-accent-line hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.4)] hover:bg-surface/80"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative aspect-[16/9] bg-bg border-b border-line overflow-hidden">
                  <Image
                    src={f.image}
                    alt={f.imageAlt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent"
                  />
                </div>

                <div className="p-7">
                  <span className="inline-flex items-center justify-center w-10 h-10 text-accent bg-accent-soft rounded mb-5 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-fg">
                    {f.icon}
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight text-fg mb-2.5">
                    {f.title}
                  </h3>
                  <p className="text-[0.9375rem] leading-relaxed text-fg-muted text-justify">
                    {f.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
