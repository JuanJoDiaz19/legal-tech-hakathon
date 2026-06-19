import Image from 'next/image';
import { AnimatedCounter } from './AnimatedCounter';

interface Stat {
  to: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const STATS: readonly Stat[] = [
  { to: 80, prefix: '−', suffix: '%', label: 'tiempo de análisis inicial del expediente' },
  { to: 20, prefix: '+', suffix: ' años', label: 'de criterio jurídico incorporado' },
  { to: 4, suffix: ' tipos', label: 'de responsabilidad civil cubiertos' },
] as const;

export function TrustSection() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="relative px-6 md:px-12 xl:px-24 py-16 md:py-24 border-t border-line overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[480px] h-[280px] bg-accent/10 blur-3xl pointer-events-none"
      />
      <div className="relative max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center mb-14">
          <div className="max-w-[640px]">
            <span className="block mb-4 text-xs font-semibold tracking-[0.15em] uppercase text-accent">
              Respaldo institucional
            </span>
            <h2
              id="trust-heading"
              className="text-[1.75rem] md:text-4xl font-bold leading-tight tracking-tight text-fg"
            >
              Desarrollado por Hurtado Gandini
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-fg-muted text-justify">
              Más de 20 años litigando responsabilidad civil extracontractual respaldan la lógica
              de análisis de Elenchos.
            </p>
          </div>

          <figure className="relative aspect-[16/11] rounded-[var(--radius-card)] overflow-hidden border border-line shadow-[0_20px_60px_rgba(0,0,0,0.45)] group">
            <Image
              src="/foto-handshake.webp"
              alt="Apretón de manos entre abogado y cliente — relación de confianza profesional"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-tr from-bg/70 via-transparent to-transparent"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fg/90">
                Confianza · Estrategia · Resultados
              </span>
            </figcaption>
          </figure>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="group relative p-8 md:p-10 bg-surface/40 border border-line rounded-[var(--radius-card)] backdrop-blur-sm transition-all duration-300 ease-out hover:border-accent-line hover:-translate-y-0.5 hover:bg-surface/70"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-6 bottom-6 w-px bg-accent origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100"
              />
              <AnimatedCounter
                to={s.to}
                prefix={s.prefix}
                suffix={s.suffix}
                className="block text-[2.5rem] md:text-[3.25rem] font-bold leading-none tracking-[-0.03em] bg-gradient-to-b from-fg to-fg/60 bg-clip-text text-transparent tabular-nums"
              />
              <p className="mt-3.5 text-sm leading-snug text-fg-muted max-w-[260px] text-justify">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
