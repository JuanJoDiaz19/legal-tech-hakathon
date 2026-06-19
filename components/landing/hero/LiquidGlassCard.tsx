export function LiquidGlassCard() {
  return (
    <div className="liquid-glass w-[200px] h-[200px] p-5 flex flex-col justify-between -translate-y-[50px]">
      <span className="text-[10px] tracking-[0.25em] text-fg/70 font-semibold">[ 2025 ]</span>
      <div>
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
