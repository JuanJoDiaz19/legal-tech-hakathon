import Image from 'next/image';

interface FooterLink {
  href: string;
  label: string;
}

const LEGAL_LINKS: readonly FooterLink[] = [
  { href: '#', label: 'Política de privacidad' },
  { href: '#', label: 'Términos' },
  { href: '#', label: 'SAGRILAFT' },
  { href: '#', label: 'Tratamiento de datos' },
] as const;

const COL_TITLE = 'mb-3.5 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-accent';

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contacto@hurtadogandini.com';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-bg border-t border-line">
      <div className="px-6 md:px-12 xl:px-24">
        <div className="max-w-[1280px] mx-auto py-14 md:pt-18 md:pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] gap-10 lg:gap-16">
        <div className="flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-3.5">
            <Image
              src="/logo-hgd.webp"
              alt="Hurtado Gandini"
              width={126}
              height={28}
              className="h-7 w-auto block"
            />
            <span aria-hidden className="w-px h-5 bg-line" />
            <span className="font-wordmark text-[1.5rem] font-medium tracking-tight text-fg leading-none">
              Elenchos
            </span>
          </span>
          <p className="text-[0.8125rem] leading-relaxed text-fg-muted max-w-[280px] text-justify">
            Herramienta de análisis jurídico estratégico para abogados litigantes. Una solución
            asociada a Hurtado Gandini.
          </p>
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-[0.8125rem] text-fg tabular-nums">(57) 316 041 7827</span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[0.8125rem] text-accent transition-colors hover:text-accent-hover"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div>
          <div className={COL_TITLE}>Bogotá</div>
          <p className="text-[0.8125rem] leading-[1.7] text-fg-muted">
            Carrera 7 # 71-21
            <br />
            Of. 509, Torre B
            <br />
            Edificio Avenida Chile
            <span className="block mt-1.5 text-fg-faint">Lun–Vie · 8:00–17:00</span>
          </p>
        </div>

        <div>
          <div className={COL_TITLE}>Cali</div>
          <p className="text-[0.8125rem] leading-[1.7] text-fg-muted">
            Calle 22 Norte # 6AN-24
            <br />
            Of. 901
            <br />
            Edificio Santa Mónica Central
            <span className="block mt-1.5 text-fg-faint">Lun–Vie · 8:00–17:00</span>
          </p>
        </div>
        </div>
      </div>

      <div className="border-t border-line px-6 md:px-12 xl:px-24">
        <div className="max-w-[1280px] mx-auto py-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs tracking-wide text-fg-faint">
            © {year} Hurtado Gandini · Elenchos
          </span>
          <nav aria-label="Enlaces legales" className="flex flex-wrap gap-x-6 gap-y-3">
            {LEGAL_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-xs text-fg-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
