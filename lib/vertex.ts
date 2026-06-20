import { GoogleGenAI } from '@google/genai';

/**
 * Cliente de Gemini sobre Vertex AI (mismo proveedor que el backend analizador).
 *
 * Variables de entorno requeridas (en .env.local):
 *   - GOOGLE_CLOUD_PROJECT        ID del proyecto de GCP
 *   - GOOGLE_CLOUD_LOCATION       Región de Vertex (p.ej. us-central1 o global)
 *   - GOOGLE_APPLICATION_CREDENTIALS  Ruta al JSON de la service account (ADC)
 *   - VERTEX_CHAT_MODEL           (opcional) modelo a usar; por defecto gemini-2.5-flash
 */

let cached: GoogleGenAI | null = null;

export function getVertexClient(): GoogleGenAI {
  if (cached) return cached;

  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project) {
    throw new Error(
      'Falta GOOGLE_CLOUD_PROJECT en el entorno (configúralo en .env.local).',
    );
  }

  cached = new GoogleGenAI({
    vertexai: true,
    project,
    location: process.env.GOOGLE_CLOUD_LOCATION || 'global',
  });
  return cached;
}

export function getChatModel(): string {
  return process.env.VERTEX_CHAT_MODEL || 'gemini-2.5-flash';
}