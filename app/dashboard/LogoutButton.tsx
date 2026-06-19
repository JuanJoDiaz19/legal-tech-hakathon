'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const BTN_GHOST =
  'h-[38px] inline-flex items-center px-4 bg-transparent text-fg-muted border border-line rounded-[var(--radius-button)] text-sm font-medium transition-colors hover:text-fg hover:border-fg-muted disabled:opacity-60 disabled:cursor-not-allowed';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={BTN_GHOST}
    >
      {loading ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  );
}
