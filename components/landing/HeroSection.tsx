import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { VideoBackground } from './hero/VideoBackground';
import { HeroBackdrop } from './hero/HeroBackdrop';
import { LiquidGlassCard } from './hero/LiquidGlassCard';

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-bg"
    >
      <VideoBackground />
      <HeroBackdrop />

      <div className="relative z-10 h-full px-6 md:px-12 xl:px-24">
        <div className="max-w-[1280px] mx-auto h-full flex flex-col justify-end pb-20 md:pb-24 xl:pb-28">
          <LiquidGlassCard />

          <div className="max-w-[640px]">
            <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-accent">
              Análisis jurídico con IA
            </span>
            <h1 className="mt-6 text-[40px] md:text-[56px] xl:text-[72px] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-fg">
              Del expediente a la defensa<span className="text-accent">.</span>
            </h1>
            <p className="mt-6 max-w-[512px] text-[14px] leading-[1.65] text-fg/70">
              Mobius analiza demandas de responsabilidad civil extracontractual, identifica el
              régimen aplicable, detecta causales de exoneración y cuestiona la liquidación de
              perjuicios — antes de que el abogado abra el primer folio.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-accent hover:bg-accent-hover text-fg uppercase text-[12px] tracking-[0.15em] font-bold transition-colors"
            >
              Comenzar análisis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
