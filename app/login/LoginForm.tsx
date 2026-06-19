'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const INPUT_CLASS =
  'h-[44px] w-full bg-bg border border-line rounded-[var(--radius-button)] px-3 text-sm text-fg placeholder:text-fg-faint transition-colors focus:border-accent focus:outline-none';

const BTN_PRIMARY =
  'h-[44px] w-full inline-flex items-center justify-center gap-2 px-4 bg-accent text-fg border border-accent rounded-[var(--radius-button)] text-sm font-semibold transition-colors hover:bg-accent-hover hover:border-accent-hover disabled:opacity-60 disabled:cursor-not-allowed';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Correo o contraseña incorrectos.');
      setLoading(false);
      return;
    }

    router.refresh();
    router.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-medium text-fg-muted">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@hurtadogandini.com"
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xs font-medium text-fg-muted">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className={BTN_PRIMARY}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Ingresando…
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </>
        )}
      </button>
    </form>
  );
}
