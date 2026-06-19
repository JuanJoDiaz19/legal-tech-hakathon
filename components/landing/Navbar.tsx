'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn, LayoutDashboard, Menu, X } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
}

const LINKS: readonly NavLink[] = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#analisis', label: 'Análisis' },
] as const;

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const ctaHref = isLoggedIn ? '/dashboard' : '/login';
  const ctaLabel = isLoggedIn ? 'Ver casos' : 'Iniciar sesión';
  const CtaIcon = isLoggedIn ? LayoutDashboard : LogIn;

  const navBase =
    'fixed top-0 inset-x-0 z-50 transition-colors duration-300 px-6 md:px-12 xl:px-24';
  const navState =
    scrolled || open
      ? 'bg-bg/90 backdrop-blur-md border-b border-line'
      : 'bg-transparent border-b border-transparent';

  return (
    <>
      <nav aria-label="Navegación principal" className={`${navBase} ${navState}`}>
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
            <span aria-hidden className="w-px h-[22px] bg-white/20" />
            <span className="font-wordmark text-[1.625rem] md:text-[1.875rem] font-medium tracking-tight text-fg leading-none">
              Mobius
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-base font-medium text-fg/85 transition-colors hover:text-accent"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={ctaHref}
              className="h-[38px] inline-flex items-center gap-2 px-5 rounded-full bg-accent text-fg border border-accent text-sm font-semibold transition-colors hover:bg-accent-hover hover:border-accent-hover"
            >
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
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 bg-transparent text-fg border border-white/20 rounded-[var(--radius-button)] transition-colors hover:border-fg-muted"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="lg:hidden fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 pt-20"
          role="dialog"
          aria-modal="true"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-medium text-fg/90 transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ))}
          <Link
            href={ctaHref}
            onClick={() => setOpen(false)}
            className="mt-4 h-12 inline-flex items-center justify-center gap-2 px-6 rounded-full bg-accent text-fg border border-accent text-sm font-semibold transition-colors hover:bg-accent-hover hover:border-accent-hover"
          >
            <CtaIcon className="w-4 h-4" />
            {ctaLabel}
          </Link>
        </div>
      )}
    </>
  );
}
