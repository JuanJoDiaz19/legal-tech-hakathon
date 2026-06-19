import { Scale, Briefcase, Brain, Target } from 'lucide-react';

const PILLARS = [
  {
    icon: Scale,
    title: 'Herramienta jurídica',
    desc: 'Asociada a Hurtado Gandini, diseñada con criterio litigante real, no como un producto genérico de IA.',
  },
  {
    icon: Briefcase,
    title: 'Análisis estratégico',
    desc: 'Estructura expedientes, demandas y documentos procesales bajo una metodología orientada a la decisión.',
  },
  {
    icon: Brain,
    title: 'Asistencia al abogado',
    desc: 'Identifica riesgos, líneas de defensa, fuentes relevantes y criterios de viabilidad — sin reemplazar el juicio profesional.',
  },
  {
    icon: Target,
    title: 'Foco en lo que decide',
    desc: 'Cuantificación de perjuicios, causales de exoneración y vinculación de terceros: lo que mueve la aguja en sala.',
  },
] as const;

export function QuienesSomosSection() {
  return (
    <section
      id="quienes-somos"
      aria-labelledby="qs-heading"
      className="relative px-6 md:px-12 xl:px-24 py-16 md:py-24 border-t border-line overflow-hidden scroll-mt-[80px]"
    >
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[520px] h-[320px] bg-accent/5 blur-3xl pointer-events-none"
      />
      <div className="relative max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
          <div>
            <span className="block mb-4 text-xs font-semibold tracking-[0.15em] uppercase text-accent">
              Quiénes somos
            </span>
            <h2
              id="qs-heading"
              className="text-[1.75rem] md:text-4xl font-bold leading-tight tracking-tight text-fg"
            >
              Una herramienta tecnológica al servicio del litigio
            </h2>
            <p className="mt-6 text-base md:text-[1.0625rem] leading-[1.7] text-fg-muted text-justify">
              <span className="font-semibold text-fg">Elenchos</span> es una herramienta
              tecnológica asociada a <span className="font-semibold text-fg">Hurtado Gandini</span>,
              diseñada para apoyar el análisis jurídico estratégico de expedientes, demandas y
              documentos procesales.
            </p>
            <p className="mt-5 text-base md:text-[1.0625rem] leading-[1.7] text-fg-muted text-justify">
              Su finalidad es asistir a los abogados en la identificación de riesgos, líneas de
              defensa, cuantificación de perjuicios, fuentes relevantes y criterios de viabilidad,
              bajo una metodología estructurada y orientada a la toma de decisiones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PILLARS.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="group relative p-6 bg-surface/40 border border-line rounded-[var(--radius-card)] backdrop-blur-sm transition-all duration-300 ease-out hover:border-accent-line hover:-translate-y-0.5 hover:bg-surface/70"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded bg-accent-soft text-accent mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-5 h-5" strokeWidth={1.6} />
                </span>
                <h3 className="text-base font-semibold tracking-tight text-fg mb-2">{title}</h3>
                <p className="text-sm leading-relaxed text-fg-muted text-justify">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
