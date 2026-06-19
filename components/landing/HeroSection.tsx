import Image from 'next/image';

export function HeroSection() {
  return (
    <section id="top" className="px-6 md:px-12 xl:px-24 pt-16 md:pt-24 xl:pt-32 pb-20 md:pb-28 xl:pb-32">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-18 items-center">
        <div className="flex flex-col items-start">
          <span className="text-[0.6875rem] md:text-xs font-semibold tracking-[0.15em] uppercase text-accent mb-6">
            Responsabilidad civil extracontractual · Defensa estratégica
          </span>
          <h1 className="text-[2rem] md:text-[2.5rem] lg:text-5xl font-bold leading-[1.08] tracking-[-0.025em] text-fg max-w-[600px]">
            Del expediente a la <em className="not-italic text-accent italic">estrategia defensiva</em> en
            minutos
          </h1>
          <p className="mt-6 text-base md:text-lg leading-[1.65] text-fg-muted max-w-[600px]">
            Mobius analiza demandas de responsabilidad civil extracontractual, identifica el
            régimen de responsabilidad aplicable, detecta causales de exoneración y cuestiona la
            valoración del perjuicio — antes de que el abogado abra el primer folio.
          </p>
          <div className="flex flex-wrap gap-3 mt-10">
            <button
              type="button"
              className="h-[52px] inline-flex items-center px-7 bg-accent text-fg border border-accent rounded-[var(--radius-button)] text-base font-semibold transition-colors hover:bg-accent-hover hover:border-accent-hover"
            >
              Solicitar acceso
            </button>
            <button
              type="button"
              className="h-[52px] inline-flex items-center px-7 bg-transparent text-fg border border-fg/20 rounded-[var(--radius-button)] text-base font-medium transition-colors hover:border-fg/45 hover:bg-fg/5"
            >
              Ver demostración
            </button>
          </div>
        </div>

        <div className="relative aspect-[1024/710] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
          <Image
            src="/hero.png"
            alt="Portafolio jurídico en cuero color oxblood sobre escritorio de madera oscura"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
