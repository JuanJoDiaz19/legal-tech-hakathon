interface Stat {
  value: string;
  label: string;
}

const STATS: readonly Stat[] = [
  { value: '−80%', label: 'tiempo de análisis inicial del expediente' },
  { value: '+20 años', label: 'de criterio jurídico incorporado' },
  { value: '4 tipos', label: 'de responsabilidad civil cubiertos' },
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
        <div className="max-w-[720px] mb-14">
          <span className="block mb-4 text-xs font-semibold tracking-[0.15em] uppercase text-accent">
            Respaldo institucional
          </span>
          <h2
            id="trust-heading"
            className="text-[1.75rem] md:text-4xl font-bold leading-tight tracking-tight text-fg"
          >
            Desarrollado por Hurtado Gandini Davalos
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-fg-muted max-w-[640px]">
            Más de 20 años litigando responsabilidad civil extracontractual respaldan la lógica de
            análisis de Mobius.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-line rounded-[var(--radius-card)] overflow-hidden">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`p-8 md:p-10 ${i < STATS.length - 1 ? 'border-b border-line md:border-b-0 md:border-r md:border-r-accent' : ''}`}
            >
              <div className="text-[2.5rem] md:text-[3.25rem] font-bold leading-none tracking-[-0.03em] bg-gradient-to-b from-fg to-fg/70 bg-clip-text text-transparent">
                {s.value}
              </div>
              <p className="mt-3.5 text-sm leading-snug text-fg-muted max-w-[260px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
