import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { getVertexClient, getChatModel } from '@/lib/vertex';

// Vertex AI (google-auth-library) necesita APIs de Node, no Edge.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_HISTORY = 20;
const BUCKET = 'case-documents';
// Presupuesto total de bytes a adjuntar inline a Gemini (Vertex limita ~20MB el
// request; dejamos margen porque base64 infla ~33%).
const ATTACH_BUDGET_BYTES = 15 * 1024 * 1024;

const CATEGORIA_ORDER = ['demanda', 'pruebas', 'anexos', 'poderes'] as const;

type DbMessage = { role: 'user' | 'assistant'; content: string };

type CaseDocRow = {
  categoria: string;
  storage_path: string;
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
};

type InlinePart = { inlineData: { mimeType: string; data: string } };

/** Gemini lee de forma nativa PDF, imágenes, audio, video y texto plano. */
function mimeSoportado(mime: string | null): boolean {
  if (!mime) return false;
  return (
    mime === 'application/pdf' ||
    mime.startsWith('image/') ||
    mime.startsWith('audio/') ||
    mime.startsWith('video/') ||
    mime.startsWith('text/')
  );
}

/**
 * Descarga los documentos del caso desde Storage y los prepara como partes
 * inline para Gemini. Devuelve las partes adjuntables y una nota legible con
 * qué quedó adjunto y qué se omitió (por tipo o por tamaño).
 */
async function cargarDocumentos(
  supabase: SupabaseClient,
  caseId: string,
): Promise<{ fileParts: InlinePart[]; nota: string }> {
  const { data: rows } = await supabase
    .from('case_documents')
    .select('categoria, storage_path, filename, mime_type, size_bytes')
    .eq('case_id', caseId);

  const docs = (rows ?? []) as CaseDocRow[];
  if (docs.length === 0) {
    return {
      fileParts: [],
      nota: 'No hay documentos originales almacenados para este caso (es un caso anterior a la persistencia de archivos). Responde con base en el análisis estructurado.',
    };
  }

  // Orden de relevancia para repartir el presupuesto.
  docs.sort(
    (a, b) =>
      CATEGORIA_ORDER.indexOf(a.categoria as (typeof CATEGORIA_ORDER)[number]) -
      CATEGORIA_ORDER.indexOf(b.categoria as (typeof CATEGORIA_ORDER)[number]),
  );

  const fileParts: InlinePart[] = [];
  const adjuntados: string[] = [];
  const omitidos: string[] = [];
  let usados = 0;

  for (const doc of docs) {
    if (!mimeSoportado(doc.mime_type)) {
      omitidos.push(`${doc.filename} (formato no legible: ${doc.mime_type ?? 'desconocido'})`);
      continue;
    }
    if (doc.size_bytes && usados + doc.size_bytes > ATTACH_BUDGET_BYTES) {
      omitidos.push(`${doc.filename} (excede el límite de tamaño para adjuntar)`);
      continue;
    }

    const { data: blob, error } = await supabase.storage
      .from(BUCKET)
      .download(doc.storage_path);
    if (error || !blob) {
      omitidos.push(`${doc.filename} (no se pudo descargar)`);
      continue;
    }

    const buf = Buffer.from(await blob.arrayBuffer());
    if (usados + buf.byteLength > ATTACH_BUDGET_BYTES) {
      omitidos.push(`${doc.filename} (excede el límite de tamaño para adjuntar)`);
      continue;
    }

    usados += buf.byteLength;
    fileParts.push({
      inlineData: {
        mimeType: doc.mime_type as string,
        data: buf.toString('base64'),
      },
    });
    adjuntados.push(`${doc.filename} [${doc.categoria}]`);
  }

  const partes: string[] = [];
  if (adjuntados.length > 0) {
    partes.push(
      `Tienes adjuntos los documentos ORIGINALES del caso. Úsalos como fuente primaria: ${adjuntados.join('; ')}.`,
    );
  }
  if (omitidos.length > 0) {
    partes.push(`No se pudieron adjuntar: ${omitidos.join('; ')}.`);
  }
  if (adjuntados.length === 0) {
    partes.push('No fue posible adjuntar ningún documento original; responde con base en el análisis estructurado.');
  }

  return { fileParts, nota: partes.join(' ') };
}

function buildSystemInstruction(args: {
  title: string;
  analysis: unknown;
  memo: string | null;
  notaDocumentos: string;
}): string {
  const contexto = JSON.stringify(args.analysis ?? {}, null, 2);
  const memo = args.memo?.trim()
    ? args.memo
    : '(No se generó memorando para este caso.)';

  return [
    'Eres un asistente jurídico para abogados litigantes en Colombia, integrado en la plataforma Elenchos.',
    'Tu función es ayudar al abogado a interrogar y aprovechar el material de un caso concreto, desde la perspectiva de la defensa.',
    '',
    'REGLAS:',
    '1. Responde SIEMPRE en español, en tono profesional y práctico, como hablarías con un colega abogado.',
    '2. Fundaméntate ESTRICTAMENTE en el material del caso: los DOCUMENTOS ORIGINALES adjuntos (fuente primaria) y el ANÁLISIS ESTRUCTURADO. No inventes hechos, normas ni jurisprudencia que no estén respaldados por ese material.',
    '3. Cuando el abogado pregunte por el contenido de un documento, BÚSCALO Y CÍTALO en los documentos adjuntos (por nombre de archivo y, si aplica, por la parte/cláusula). Prioriza el texto real del documento sobre el resumen.',
    '4. Si la respuesta no está ni en los documentos ni en el análisis, dilo con claridad y señala qué documento o dato haría falta.',
    '5. Al citar una norma o fuente, usa las que aparecen en el análisis (sección "fuentes") o en los documentos. Si no hay soporte, acláralo.',
    '6. Sé concreto: prioriza pasos accionables, riesgos y argumentos defensivos. Usa Markdown (listas, negritas) para que sea fácil de leer.',
    '7. Recuerda que esto es un apoyo y no reemplaza el criterio del abogado responsable.',
    '',
    `CASO: "${args.title}"`,
    '',
    `=== DOCUMENTOS ADJUNTOS ===\n${args.notaDocumentos}`,
    '',
    '=== ANÁLISIS ESTRUCTURADO (JSON) ===',
    contexto,
    '',
    '=== MEMORANDO ESTRATÉGICO (Markdown) ===',
    memo,
  ].join('\n');
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: caseId } = await params;

  let question: string;
  try {
    const body = await req.json();
    question = typeof body?.question === 'string' ? body.question.trim() : '';
  } catch {
    return Response.json({ error: 'Cuerpo inválido.' }, { status: 400 });
  }
  if (!question) {
    return Response.json({ error: 'La pregunta está vacía.' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'No autenticado.' }, { status: 401 });
  }

  // Contexto del caso (RLS aplica: solo casos visibles para el usuario).
  const { data: caso, error: casoErr } = await supabase
    .from('cases')
    .select('id, title, analysis, memo_markdown')
    .eq('id', caseId)
    .single();

  if (casoErr || !caso) {
    return Response.json({ error: 'Caso no encontrado.' }, { status: 404 });
  }

  // Historial previo para dar continuidad a la conversación.
  const { data: historyRows } = await supabase
    .from('case_chat_messages')
    .select('role, content')
    .eq('case_id', caseId)
    .order('created_at', { ascending: true })
    .limit(MAX_HISTORY);

  const history = (historyRows ?? []) as DbMessage[];

  // Documentos originales del caso (fuente primaria para Gemini).
  const { fileParts, nota: notaDocumentos } = await cargarDocumentos(
    supabase,
    caseId,
  );

  // Persistimos la pregunta del abogado de inmediato.
  const { error: insertUserErr } = await supabase
    .from('case_chat_messages')
    .insert({
      case_id: caseId,
      role: 'user',
      content: question,
      created_by: user.id,
    });
  if (insertUserErr) {
    return Response.json(
      { error: `No se pudo guardar la pregunta: ${insertUserErr.message}` },
      { status: 500 },
    );
  }

  const systemInstruction = buildSystemInstruction({
    title: caso.title,
    analysis: caso.analysis,
    memo: caso.memo_markdown,
    notaDocumentos,
  });

  const contents = [
    ...history.map((m) => ({
      role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text: m.content }],
    })),
    {
      role: 'user' as const,
      // Los documentos van junto con la pregunta actual para anclar la respuesta.
      parts: [{ text: question }, ...fileParts],
    },
  ];

  let stream: AsyncIterable<{ text?: string }>;
  try {
    const ai = getVertexClient();
    stream = await ai.models.generateContentStream({
      model: getChatModel(),
      contents,
      config: {
        systemInstruction,
        temperature: 0.3,
        // Amplio: gemini-2.5-flash gasta parte del presupuesto en "thinking",
        // así que dejamos margen para que la respuesta no se trunque.
        maxOutputTokens: 8192,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al iniciar el modelo.';
    return Response.json({ error: msg }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = '';
      try {
        for await (const chunk of stream) {
          const text = chunk.text;
          if (text) {
            full += text;
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Error durante la generación.';
        if (!full) {
          controller.enqueue(encoder.encode(`⚠️ ${msg}`));
          full = `⚠️ ${msg}`;
        }
      } finally {
        // Persistimos la respuesta del asistente antes de cerrar el stream.
        if (full.trim()) {
          try {
            await supabase.from('case_chat_messages').insert({
              case_id: caseId,
              role: 'assistant',
              content: full,
              created_by: user.id,
            });
          } catch {
            // No romper el cierre del stream si falla el guardado.
          }
        }
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
