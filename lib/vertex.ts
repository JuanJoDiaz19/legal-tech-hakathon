import { GoogleGenAI } from '@google/genai';

/**
 * Cliente de Gemini sobre Vertex AI (mismo proveedor que el backend analizador).
 *
 * Variables de entorno:
 *   - GOOGLE_CLOUD_PROJECT            (requerida) ID del proyecto de GCP
 *   - GOOGLE_CLOUD_LOCATION           Región de Vertex (p.ej. us-central1)
 *   - VERTEX_CHAT_MODEL               (opcional) modelo; por defecto gemini-2.5-flash
 *
 * Credenciales — usa la PRIMERA que esté disponible:
 *   1. GOOGLE_SERVICE_ACCOUNT_JSON    JSON de la service account en una sola env var
 *                                     (JSON crudo o su base64). Es la forma de
 *                                     autenticar en Vercel/Netlify, que no tienen
 *                                     sistema de archivos para credenciales.
 *   2. GOOGLE_APPLICATION_CREDENTIALS Ruta a un JSON de service account (Render, etc.)
 *   3. ADC por defecto                gcloud auth application-default login (local)
 *                                     o la service account del entorno (Cloud Run).
 */

let cached: GoogleGenAI | null = null;

function loadInlineCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return undefined;

  // Acepta el JSON pegado tal cual (en una línea) o codificado en base64
  // (útil si el panel de variables maltrata los caracteres de la private_key).
  let text = raw;
  if (!text.startsWith('{')) {
    try {
      text = Buffer.from(raw, 'base64').toString('utf8');
    } catch {
      // se intentará parsear como JSON crudo abajo
    }
  }

  try {
    // JSON.parse devuelve `any`: el objeto se pasa tal cual a googleAuthOptions.
    return JSON.parse(text);
  } catch {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_JSON no es un JSON válido (ni JSON crudo ni base64 de JSON).',
    );
  }
}

export function getVertexClient(): GoogleGenAI {
  if (cached) return cached;

  const project = process.env.GOOGLE_CLOUD_PROJECT?.trim();
  if (!project) {
    throw new Error(
      'Falta GOOGLE_CLOUD_PROJECT en el entorno (configúralo en .env.local o en el panel del despliegue).',
    );
  }

  const location = (process.env.GOOGLE_CLOUD_LOCATION || 'global').trim();
  const credentials = loadInlineCredentials();

  cached = new GoogleGenAI({
    vertexai: true,
    project,
    location,
    // Si hay credenciales inline, las usamos; si no, el SDK recurre a ADC
    // (GOOGLE_APPLICATION_CREDENTIALS o las credenciales del entorno).
    ...(credentials
      ? { googleAuthOptions: { credentials, projectId: project } }
      : {}),
  });
  return cached;
}

export function getChatModel(): string {
  return (process.env.VERTEX_CHAT_MODEL || 'gemini-2.5-flash').trim();
}