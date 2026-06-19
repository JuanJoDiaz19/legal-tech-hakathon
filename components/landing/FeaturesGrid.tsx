import type { ReactNode } from 'react';

interface Feature {
  icon: ReactNode;
  title: string;
  desc: string;
}

const ICON_PROPS = {
  width: 20,
  height: 20,
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
  },
] as const;

export function FeaturesGrid() {
  return (
    <section
      id="analisis"
      aria-labelledby="features-heading"
      className="px-6 md:px-12 xl:px-24 py-16 md:py-24 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto">
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
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="group bg-surface border border-line rounded-[var(--radius-card)] p-7 transition-colors hover:border-l-2 hover:border-l-accent hover:pl-[27px]"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 text-accent bg-accent-soft rounded mb-5">
                {f.icon}
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-fg mb-2.5">{f.title}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-fg-muted">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
