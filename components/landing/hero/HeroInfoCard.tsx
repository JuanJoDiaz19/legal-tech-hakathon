export function HeroInfoCard() {
  return (
    <div className="liquid-glass w-full md:w-[280px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      <span className="text-[10px] tracking-[0.25em] text-fg/70 font-semibold">[ 2025 ]</span>
      <div className="mt-5">
        <p className="text-[15px] leading-tight text-fg">
          Desarrollado por{' '}
          <em className="font-wordmark italic font-medium">abogados</em> litigantes
        </p>
        <p className="mt-2 text-[11px] text-fg/55 leading-snug">
          +20 años de práctica en responsabilidad civil extracontractual.
        </p>
      </div>
    </div>
  );
}
