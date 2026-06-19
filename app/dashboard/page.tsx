import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { LogoutButton } from './LogoutButton';
import { CasesList, type Case } from './CasesList';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: cases } = await supabase
    .from('cases')
    .select('id, title, client, status, description, created_at, created_by')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-bg">
      <header className="sticky top-0 z-50 bg-bg border-b border-line px-6 md:px-12 xl:px-24">
        <div className="max-w-[1280px] mx-auto h-[68px] md:h-[76px] flex items-center justify-between">
          <div className="inline-flex items-center gap-4">
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
          </div>

          <LogoutButton />
        </div>
      </header>

      <section className="px-6 md:px-12 xl:px-24 pt-10 md:pt-14 pb-6">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="font-wordmark text-4xl md:text-5xl font-medium tracking-tight text-fg mb-3">
            Hola, {user.email}
          </h1>
          <p className="text-base text-fg-muted">
            Tu panel de Mobius. Aquí construiremos el flujo de análisis.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 xl:px-24 pb-16">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6 pt-8 border-t border-line">
            <div className="pt-8">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-fg">
                Casos
              </h2>
              <p className="text-sm text-fg-muted mt-1">
                {(cases?.length ?? 0) === 0
                  ? 'Aún no hay casos. Crea el primero.'
                  : `${cases!.length} ${cases!.length === 1 ? 'caso' : 'casos'} en el equipo.`}
              </p>
            </div>
            <div className="pt-8">
              <Link
                href="/dashboard/casos/nuevo"
                className="h-[38px] inline-flex items-center gap-2 px-4 bg-accent text-fg border border-accent rounded-[var(--radius-button)] text-sm font-semibold transition-colors hover:bg-accent-hover hover:border-accent-hover"
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
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Nuevo caso
              </Link>
            </div>
          </div>

          <CasesList cases={(cases ?? []) as Case[]} />
        </div>
      </section>
    </main>
  );
}
