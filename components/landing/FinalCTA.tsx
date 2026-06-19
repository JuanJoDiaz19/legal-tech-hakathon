import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative bg-bg border-t border-line px-6 md:px-12 xl:px-24 py-20 md:py-28 xl:py-32 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(128,24,23,0.35),_transparent_60%)] pointer-events-none"
      />
      <div className="relative max-w-[920px] mx-auto text-center">
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
        <Link
          href="/login"
          className="mt-10 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-accent hover:bg-accent-hover text-fg uppercase text-[12px] tracking-[0.15em] font-bold transition-colors"
        >
          Comenzar análisis
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
