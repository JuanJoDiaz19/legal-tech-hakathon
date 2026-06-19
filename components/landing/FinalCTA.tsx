export function FinalCTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-accent px-6 md:px-12 xl:px-24 py-20 md:py-28 xl:py-32"
    >
      <div className="max-w-[920px] mx-auto text-center">
        <h2
          id="cta-heading"
          className="text-[2rem] md:text-[2.75rem] lg:text-[3.25rem] font-bold leading-[1.12] tracking-[-0.025em] text-fg"
        >
          Empiece el análisis de su próximo caso hoy
        </h2>
        <p className="mt-5 mx-auto max-w-[620px] text-base md:text-lg leading-relaxed text-fg/80">
          Acceso por invitación. Disponible para abogados de HGD y clientes corporativos
          autorizados.
        </p>
      </div>
    </section>
  );
}
