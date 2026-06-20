const SRC = '/elenchos-manifiesto.mp4';

export function ManifiestoVideo() {
  return (
    <section
      aria-labelledby="manifiesto-heading"
      className="relative px-6 md:px-12 xl:px-24 py-16 md:py-24 border-t border-line overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute -top-20 left-1/4 w-[600px] h-[320px] bg-accent/8 blur-3xl pointer-events-none"
      />
      <div className="relative max-w-[1280px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent to-accent-line" />
          <span className="inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.32em] text-fg-muted">
            <span aria-hidden className="text-accent">§</span>
            Manifiesto
            <span aria-hidden className="text-accent">§</span>
          </span>
          <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-line" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-14 items-center">
          <figure className="relative aspect-video rounded-[var(--radius-card)] overflow-hidden border border-line shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <video
              src={SRC}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-transparent pointer-events-none"
            />

            <div className="absolute bottom-4 left-4">
              <span className="inline-flex items-center gap-2 px-3 h-7 text-[10px] font-bold uppercase tracking-[0.2em] text-fg bg-bg/60 backdrop-blur-md border border-white/10 rounded-full">
                <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Hurtado Gandini · Elenchos
              </span>
            </div>
          </figure>

          <div className="flex flex-col gap-5">
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
              Por qué Elenchos
            </span>
            <h2
              id="manifiesto-heading"
              className="text-[1.875rem] md:text-[2.25rem] font-bold leading-[1.1] tracking-tight text-fg"
            >
              Cada expediente esconde una <em className="not-italic text-accent">defensa</em> esperando ser construida.
            </h2>
            <p className="text-[15px] leading-[1.75] text-fg-muted text-justify">
              Detrás de cada folio hay un régimen aplicable, una causal de exoneración omitida, un
              perjuicio sobredimensionado. Elenchos los encuentra antes de que el abogado abra el
              primer documento.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-line/60">
              <Stat value="+20" label="años de criterio litigante" />
              <span aria-hidden className="hidden md:inline-block w-px h-8 bg-line" />
              <Stat value="−80%" label="tiempo de análisis inicial" />
              <span aria-hidden className="hidden md:inline-block w-px h-8 bg-line" />
              <Stat value="4 ejes" label="defensivos cubiertos" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[1.25rem] font-bold tabular-nums leading-none text-fg">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-fg-faint mt-1">
        {label}
      </span>
    </div>
  );
}
