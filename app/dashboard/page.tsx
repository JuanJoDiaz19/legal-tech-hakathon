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
    .select('id, title, client, status, description, created_at, created_by, analysis_status')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-bg">
      <header className="sticky top-0 z-50 bg-bg border-b border-line px-6 md:px-12 xl:px-24">
        <div className="max-w-[1280px] mx-auto h-[68px] md:h-[76px] flex items-center justify-between">
          <div className="inline-flex items-center gap-4">
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
          </div>

          <LogoutButton />
        </div>
      </header>

      <section className="px-6 md:px-12 xl:px-24 pt-10 md:pt-14 pb-6">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="font-wordmark text-4xl md:text-5xl font-medium tracking-tight text-fg mb-3">
            {(() => {
              const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
              const fullName =
                (meta.full_name as string | undefined) ??
                (meta.name as string | undefined) ??
                undefined;
              const firstName = fullName?.trim().split(/\s+/)[0];
              const gender = meta.gender as 'F' | 'M' | undefined;
              const saludo =
                gender === 'F'
                  ? 'Bienvenida, estimada'
                  : gender === 'M'
                  ? 'Bienvenido, estimado'
                  : 'Bienvenido(a), estimado(a)';
              return firstName ? `${saludo} ${firstName}` : 'Bienvenido(a)';
            })()}
          </h1>
          <p className="text-base text-fg-muted">
            Tu panel de Elenchos. Aquí gestionas el análisis jurídico estratégico de tus casos.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 xl:px-24 pb-16">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-6 mb-10 pt-10 border-t border-line">
            <div className="flex items-end gap-4">
              <span aria-hidden className="text-accent text-3xl leading-none font-wordmark italic select-none">
                §
              </span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent mb-1.5">
                  Expedientes activos
                </span>
                <h2 className="font-wordmark italic text-3xl md:text-4xl text-fg leading-none tracking-tight">
                  Casos
                </h2>
                <p className="text-sm text-fg-muted mt-2">
                  {(cases?.length ?? 0) === 0
                    ? 'Aún no hay casos. Crea el primero.'
                    : `${cases!.length} ${cases!.length === 1 ? 'caso' : 'casos'} en el equipo.`}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/casos/nuevo"
              className="group self-start md:self-end inline-flex items-center gap-3 h-12 pl-2 pr-5 rounded-full bg-accent text-fg border border-accent transition-all duration-200 hover:bg-accent-hover hover:border-accent-hover hover:shadow-[0_10px_24px_rgba(128,24,23,0.35)]"
            >
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-fg/15 transition-transform duration-300 group-hover:rotate-90"
                aria-hidden
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <span className="font-wordmark italic text-[1.0625rem] leading-none tracking-tight">
                Nuevo caso
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <CasesList cases={(cases ?? []) as Case[]} />
        </div>
      </section>
    </main>
  );
}
