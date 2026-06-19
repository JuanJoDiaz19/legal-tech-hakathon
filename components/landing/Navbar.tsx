'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn, LayoutDashboard } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
}

const LINKS: readonly NavLink[] = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#analisis', label: 'Análisis' },
] as const;

const BTN_GHOST =
  'h-[38px] inline-flex items-center px-4 bg-transparent text-fg-muted border border-line rounded-[var(--radius-button)] text-sm font-medium transition-colors hover:text-fg hover:border-fg-muted';

const BTN_CTA_ACCENT =
  'h-[38px] inline-flex items-center gap-2 px-4 bg-accent text-fg-muted border border-accent rounded-[var(--radius-button)] text-sm font-semibold transition-colors hover:bg-accent-hover hover:border-accent-hover hover:text-fg';

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [open, setOpen] = useState(false);

  const ctaHref = isLoggedIn ? '/dashboard' : '/login';
  const ctaLabel = isLoggedIn ? 'Ver casos' : 'Iniciar sesión';
  const CtaIcon = isLoggedIn ? LayoutDashboard : LogIn;

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className="sticky top-0 z-50 bg-bg border-b border-line px-6 md:px-12 xl:px-24"
      >
        <div className="max-w-[1280px] mx-auto h-[68px] md:h-[76px] flex items-center justify-between">
          <a
            href="#top"
            aria-label="Mobius — Hurtado Gandini Davalos"
            className="inline-flex items-center gap-4"
          >
            <Image
              src="/logo-hgd.webp"
              alt="Hurtado Gandini Davalos"
              width={144}
              height={32}
              priority
              className="h-7 md:h-8 w-auto block"
            />
            <span aria-hidden className="w-px h-[22px] bg-line" />
            <span className="font-wordmark text-[1.625rem] md:text-[1.875rem] font-medium tracking-tight text-fg leading-none">
              Mobius
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-fg-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link href={ctaHref} className={BTN_CTA_ACCENT}>
              <CtaIcon className="w-4 h-4" />
              {ctaLabel}
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 bg-transparent text-fg border border-line rounded-[var(--radius-button)] transition-colors hover:border-fg-muted"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="lg:hidden bg-bg border-b border-line px-6 md:px-12 xl:px-24">
          <div className="max-w-[1280px] mx-auto pt-4 pb-6 flex flex-col gap-2">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base font-medium text-fg-muted border-b border-line transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 mt-3">
              <Link
                href={ctaHref}
                onClick={() => setOpen(false)}
                className="h-[44px] inline-flex items-center justify-center gap-2 bg-accent text-fg-muted border border-accent rounded-[var(--radius-button)] text-sm font-semibold transition-colors hover:bg-accent-hover hover:border-accent-hover hover:text-fg"
              >
                <CtaIcon className="w-4 h-4" />
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
