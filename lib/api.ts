import type { WizardDraft } from '@/app/dashboard/casos/nuevo/NewCaseWizard';

export type AnalisisHechos = {
  resumen_factico?: string;
  tipo_caso?: { categoria?: string; subtipo?: string };
  partes?: unknown;
  hechos?: unknown[];
  danos_alegados?: unknown[];
  pruebas_aportadas?: unknown[];
  peritajes?: unknown[];
  cuantia?: unknown;
  vacios_o_dudas?: unknown[];
  error?: string;
} & Record<string, unknown>;

export type AnalisisJuridico = {
  regimen?: Record<string, unknown>;
  exoneracion?: Record<string, unknown>;
  perjuicio?: Record<string, unknown>;
  terceros?: Record<string, unknown>;
  memo?: Record<string, unknown>;
  memo_markdown?: string;
  fuentes?: Record<string, { fuente: string; pagina?: number | string; categoria?: string }>;
  disclaimer?: string;
  error?: string;
};

export type AnalisisResponse = {
  ok: boolean;
  archivos: string[];
  archivos_por_categoria: {
    demanda: string[];
    pruebas: string[];
    anexos: string[];
    poderes: string[];
  };
  hechos: AnalisisHechos;
  analisis: AnalisisJuridico | null;
  memo: string | null;
};

function backendUrl(): string {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!url) {
    throw new Error(
      'Falta NEXT_PUBLIC_BACKEND_URL en el entorno del frontend (configúrala en .env.local).',
    );
  }
  return url.replace(/\/+$/, '');
}

export async function analizarCaso(draft: WizardDraft): Promise<AnalisisResponse> {
  const form = new FormData();
  for (const file of draft.demanda) form.append('demanda', file, file.name);
  for (const file of draft.prueba) form.append('pruebas', file, file.name);
  for (const file of draft.anexos) form.append('anexos', file, file.name);
  for (const file of draft.poderes) form.append('poderes', file, file.name);

  const res = await fetch(`${backendUrl()}/analizar`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Backend respondió ${res.status}: ${text.slice(0, 500) || res.statusText}`,
    );
  }

  return (await res.json()) as AnalisisResponse;
}
