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
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,_transparent_0%,_rgba(0,0,0,0.4)_100%)] pointer-events-none"
      />
      <div className="relative max-w-[1280px] mx-auto text-center">
        <h2
          id="cta-heading"
          className="text-[1.5rem] md:text-[2rem] lg:text-[1.875rem] xl:text-[2.25rem] font-bold leading-[1.12] tracking-[-0.025em] text-fg lg:whitespace-nowrap"
        >
          Gestione el análisis jurídico de sus casos con criterio estratégico
        </h2>
        <p className="mt-6 mx-auto max-w-[640px] text-base md:text-lg leading-relaxed text-fg/80 text-justify md:text-center">
          Acceso privado y restringido, habilitado para abogados de Hurtado Gandini y clientes
          corporativos autorizados.
        </p>
        <Link
          href="/login"
          className="mt-10 inline-flex items-center gap-2 h-12 px-7 rounded-full bg-accent hover:bg-accent-hover text-fg uppercase text-[12px] tracking-[0.15em] font-bold transition-all duration-200 shadow-[0_6px_24px_rgba(128,24,23,0.45)] hover:shadow-[0_8px_30px_rgba(128,24,23,0.6)] hover:-translate-y-0.5"
        >
          Iniciar sesión
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
