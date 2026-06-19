import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { LogoutButton } from './LogoutButton';

export default async function DashboardPage() {
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

      <section className="px-6 md:px-12 xl:px-24 py-16">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="font-wordmark text-4xl md:text-5xl font-medium tracking-tight text-fg mb-3">
            Hola, {user.email}
          </h1>
          <p className="text-base text-fg-muted">
            Tu panel de Mobius. Aquí construiremos el flujo de análisis.
          </p>
        </div>
      </section>
    </main>
  );
}
