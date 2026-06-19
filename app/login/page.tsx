import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Image
            src="/logo-hgd.webp"
            alt="Hurtado Gandini"
            width={144}
            height={32}
            priority
            className="h-8 w-auto"
          />
          <span className="font-wordmark text-3xl font-medium tracking-tight text-fg leading-none">
            Elenchos
          </span>
        </div>

        <div className="bg-surface border border-line rounded-[var(--radius-card)] p-8">
          <h1 className="text-xl font-semibold text-fg mb-1">Iniciar sesión</h1>
          <p className="text-sm text-fg-muted mb-6">
            Acceso restringido al equipo de Hurtado Gandini.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
