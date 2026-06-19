const PROBLEM: readonly string[] = [
  'Leer cientos de folios de demanda, peritajes y pruebas técnicas',
  'Determinar manualmente el régimen de responsabilidad aplicable',
  'Identificar culpa exclusiva, fuerza mayor o hecho de tercero',
  'Cuestionar renglón por renglón la liquidación de perjuicios',
  'Evaluar qué terceros llamar en garantía',
] as const;

const SOLUTION: readonly string[] = [
  'Carga el expediente completo en segundos',
  'Clasifica automáticamente el régimen aplicable',
  'Detecta argumentos de exoneración en los hechos',
  'Señala inconsistencias en la tasación de perjuicios',
  'Identifica terceros responsables a vincular',
] as const;

function MinusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ProblemSolutionSection() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="ps-heading"
      className="px-6 md:px-12 xl:px-24 py-16 md:py-24 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-14 max-w-[720px]">
          <span className="block mb-4 text-xs font-semibold tracking-[0.15em] uppercase text-accent">
            El cambio operativo
          </span>
          <h2
            id="ps-heading"
            className="text-[1.75rem] md:text-4xl font-bold leading-tight tracking-tight text-fg"
          >
            De semanas de revisión manual a un análisis estructurado en minutos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col">
            <div className="mb-6 text-xs font-semibold tracking-[0.15em] uppercase text-fg-faint">
              Sin Mobius
            </div>
            <ul className="flex flex-col gap-[18px] list-none p-0 m-0">
              {PROBLEM.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[0.9375rem] leading-snug text-fg-muted"
                >
                  <span className="flex-none w-[18px] h-[18px] mt-[3px] text-fg-faint">
                    <MinusIcon />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col pl-6 md:pl-8 border-l-2 border-accent">
            <div className="mb-6 text-xs font-semibold tracking-[0.15em] uppercase text-accent">
              Con Mobius
            </div>
            <ul className="flex flex-col gap-[18px] list-none p-0 m-0">
              {SOLUTION.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[0.9375rem] leading-snug text-fg"
                >
                  <span className="flex-none w-[18px] h-[18px] mt-[3px] text-accent">
                    <CheckIcon />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
