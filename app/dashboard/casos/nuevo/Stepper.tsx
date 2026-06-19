type Step = {
  readonly id: number;
  readonly label: string;
  readonly description: string;
};

export function Stepper({
  steps,
  currentStep,
}: {
  steps: readonly Step[];
  currentStep: number;
}) {
  const total = steps.length;
  const progressPct = total > 1 ? ((currentStep - 1) / (total - 1)) * 100 : 0;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute left-0 right-0 top-[15px] h-px bg-line"
      />
      <div
        aria-hidden
        className="absolute left-0 top-[15px] h-px bg-accent-line transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${progressPct}%` }}
      />

      <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}>
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <li key={step.id} className="flex flex-col items-center text-center">
              <div className="bg-bg px-2 py-0.5">
                <div
                  className={[
                    'relative flex items-center justify-center w-7 h-7 rounded-full border text-xs font-semibold transition-colors',
                    'font-wordmark',
                    isActive && 'bg-accent border-accent text-fg animate-pulse-seal',
                    isCompleted && 'bg-accent-soft border-accent-line text-fg',
                    !isActive && !isCompleted && 'bg-bg border-line text-fg-faint',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path
                        d="M20 6 9 17l-5-5"
                        strokeDasharray="28"
                        className="animate-check-draw"
                      />
                    </svg>
                  ) : (
                    <span className="leading-none">{step.id}</span>
                  )}
                </div>
              </div>

              <span
                className={[
                  'mt-3 text-xs font-medium transition-colors px-1',
                  isActive ? 'text-fg' : 'text-fg-muted',
                  !isActive && !isCompleted && 'text-fg-faint',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {step.label}
              </span>
              <span className="hidden md:block text-[10px] text-fg-faint mt-0.5 px-1">
                {step.description}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
