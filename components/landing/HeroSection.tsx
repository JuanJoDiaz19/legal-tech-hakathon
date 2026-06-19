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
            Del expediente a la{' '}
            <span className="relative inline-block">
              <em className="not-italic text-accent italic">estrategia defensiva</em>
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 -bottom-1 h-[2px] bg-accent origin-left animate-underline-draw"
              />
            </span>{' '}
            en minutos
          </h1>
          <p className="mt-6 text-base md:text-lg leading-[1.65] text-fg-muted max-w-[600px]">
            Mobius analiza demandas de responsabilidad civil extracontractual, identifica el
            régimen de responsabilidad aplicable, detecta causales de exoneración y cuestiona la
            valoración del perjuicio — antes de que el abogado abra el primer folio.
          </p>
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
