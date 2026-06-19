import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { LogoutButton } from '../../LogoutButton';
import { NewCaseWizard } from './NewCaseWizard';

export const dynamic = 'force-dynamic';

export default async function NewCasePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="sticky top-0 z-50 bg-bg border-b border-line px-6 md:px-12 xl:px-24">
        <div className="max-w-[1280px] mx-auto h-[68px] md:h-[76px] flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-4">
            <Image
              src="/logo-hgd.webp"
              alt="Hurtado Gandini"
              width={144}
              height={32}
              priority
              className="h-7 md:h-8 w-auto block"
            />
            <span aria-hidden className="w-px h-[22px] bg-line" />
            <span className="font-wordmark text-[1.625rem] md:text-[1.875rem] font-medium tracking-tight text-fg leading-none">
              Elenchos
            </span>
          </Link>

          <LogoutButton />
        </div>
      </header>

      <section className="px-6 md:px-12 xl:px-24 py-10 md:py-14">
        <div className="max-w-[1280px] mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors mb-6"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Volver al panel
          </Link>

          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-fg mb-1">
            Nuevo caso
          </h1>
          <p className="text-sm text-fg-muted mb-10">
            Completa los pasos para registrar y analizar un nuevo caso.
          </p>

          <NewCaseWizard />
        </div>
      </section>
    </main>
  );
}
