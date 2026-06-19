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
  regimen?: RegimenAnalisis;
  exoneracion?: ExoneracionAnalisis;
  perjuicio?: PerjuicioAnalisis;
  terceros?: TercerosAnalisis;
  memo?: MemoEstructurado;
  memo_markdown?: string;
  fuentes?: Record<string, { fuente: string; pagina?: number | string; categoria?: string }>;
  disclaimer?: string;
  error?: string;
};

export type FundamentoJuridico = { norma?: string; citas?: string[] };

export type RegimenAnalisis = {
  regimen?: string;
  etiqueta_legible?: string;
  nivel_confianza?: 'alto' | 'medio' | 'bajo' | string;
  fundamento_factico?: string;
  fundamento_juridico?: FundamentoJuridico[];
  carga_de_la_prueba?: string;
  diligencia_exonera?: boolean;
  regimen_alternativo?: string | null;
  por_que_no_otro_regimen?: string | null;
  clasificacion_contestable?: boolean;
  estrategia_reclasificacion?: string | null;
  consecuencia_probatoria?: string;
  citas?: string[];
};

export type ExoneracionAnalisis = {
  elementos_nexo?: {
    conducta?: string;
    dano?: string;
    nexo_causal?: string;
    puntos_debiles_del_nexo?: string;
  };
  causales_exoneracion?: Array<{
    causal?: string;
    viabilidad?: 'alta' | 'media' | 'baja' | string;
    fundamento_factico?: string;
    que_probar?: string;
    citas?: string[];
  }>;
  citas?: string[];
};

export type RubroPerjuicio = {
  rubro?: string;
  monto_reclamado?: string | null;
  soportado?: 'si' | 'parcial' | 'no' | 'no_cuantificado' | string;
  estandar_probatorio?: string;
  deficiencia?: string;
  ataque?: string;
  herramienta_procesal?: string;
  pruebas_de_descargo?: string[];
  citas?: string[];
};

export type PerjuicioAnalisis = {
  rubros?: RubroPerjuicio[];
  objecion_juramento_estimatorio?: string | null;
  recordatorio_carga_prueba?: string;
  citas?: string[];
};

export type Vinculacion = {
  tipo?: 'llamamiento_en_garantia' | 'denuncia_del_pleito' | string;
  destinatario?: string;
  justificacion?: string;
  viabilidad?: 'alta' | 'media' | 'baja' | string;
  requisitos?: string;
  citas?: string[];
};

export type TercerosAnalisis = { vinculaciones?: Vinculacion[]; citas?: string[] };

export type ArgumentoMemo = {
  tesis?: string;
  solidez?: 'SOLIDO' | 'PROBABLE' | 'DEBIL' | string;
  desarrollo?: string;
  requiere_revision_abogado?: string | null;
  citas?: string[];
};

export type MemoEstructurado = {
  sintesis_estrategia?: string;
  argumentos?: ArgumentoMemo[];
  siguientes_pasos?: string[];
  advertencias?: string[];
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

async function descargarPdf(
  ruta: '/pdf/hechos' | '/pdf/memo',
  payload: unknown,
  filename: string,
): Promise<void> {
  const res = await fetch(`${backendUrl()}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Backend respondió ${res.status}: ${text.slice(0, 500) || res.statusText}`,
    );
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function descargarFichaHechos(
  hechos: AnalisisHechos,
  filename = 'ficha_caso.pdf',
): Promise<void> {
  return descargarPdf('/pdf/hechos', hechos, filename);
}

export function descargarMemoPdf(
  analisis: AnalisisJuridico,
  filename = 'memorando.pdf',
): Promise<void> {
  return descargarPdf('/pdf/memo', analisis, filename);
}
