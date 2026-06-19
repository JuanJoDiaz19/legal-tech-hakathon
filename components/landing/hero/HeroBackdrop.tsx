export function HeroBackdrop() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#070b0a] via-[#070b0a]/40 to-transparent z-[1]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg via-bg/60 to-transparent z-[1]"
      />

      <div aria-hidden className="hidden md:block absolute inset-0 z-[1] pointer-events-none">
        <span className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: '25%' }} />
        <span className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: '50%' }} />
        <span className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: '75%' }} />
      </div>

      <svg
        aria-hidden
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        className="absolute left-1/2 top-[14%] -translate-x-1/2 w-[120%] max-w-none z-[1] pointer-events-none"
      >
        <defs>
          <filter id="hero-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="25" />
          </filter>
        </defs>
        <ellipse
          cx="600"
          cy="200"
          rx="520"
          ry="90"
          fill="#801817"
          opacity="0.42"
          filter="url(#hero-glow-filter)"
        />
      </svg>
    </>
  );
}
