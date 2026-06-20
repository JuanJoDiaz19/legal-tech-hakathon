#!/usr/bin/env node
// Genera un video cinematográfico con Veo (Google Gemini API)
// y lo guarda en public/elenchos-manifiesto.mp4
//
// Uso:
//   node scripts/generate-hero-video.mjs
//
// Requiere GEMINI_API_KEY o GOOGLE_API_KEY en el entorno (carga .env.local).

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

async function loadEnvLocal() {
  try {
    const content = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8');
    for (const rawLine of content.split('\n')) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq < 0) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local opcional
  }
}

const DEFAULT_PROMPT = `Cinematic slow-motion close-up of an antique brass scale of justice
on a polished dark walnut desk inside an elegant law library. Soft warm tungsten light
reveals delicate dust motes floating in the air. Heavy leather-bound legal books with
gold lettering sit out of focus in the background. Deep oxblood red and burgundy
leather accents, brass details, antique wood. The camera performs a very slow
dolly-in across the desk surface. Shallow depth of field, anamorphic bokeh.
Color palette: deep crimson red, charcoal black, warm gold tones.
Editorial, sophisticated, restrained mood. No people, no text, no on-screen logos.
35mm film grain, cinematic color grade. Silent footage. 8 seconds.`;

const PROMPT = process.env.VIDEO_PROMPT ?? DEFAULT_PROMPT;

// Veo 2 no genera audio (no choca con el filtro de audio safety).
// Si no está disponible para esta cuenta/región, caemos a Veo 3.
const MODELS = [
  'veo-2.0-generate-001',
  'veo-3.0-generate-001',
  'veo-3.0-generate-preview',
];

const OUTPUT_NAME = process.env.VIDEO_OUTPUT ?? 'elenchos-manifiesto.mp4';
const OUTPUT_PATH = path.join(ROOT, 'public', OUTPUT_NAME);

async function main() {
  await loadEnvLocal();
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('Falta GEMINI_API_KEY (o GOOGLE_API_KEY) en .env.local o entorno.');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  let lastError = null;
  for (const model of MODELS) {
    console.log(`\n[Veo] Probando modelo: ${model}`);
    try {
      console.log('[Veo] Lanzando generación. Esto suele tardar 1-4 minutos…');
      const config = {
        aspectRatio: '16:9',
        numberOfVideos: 1,
      };

      let operation = await ai.models.generateVideos({
        model,
        prompt: PROMPT,
        config,
      });

      console.log(`[Veo] Operación: ${operation.name ?? '(sin nombre)'}`);

      let polls = 0;
      while (!operation.done) {
        polls += 1;
        await new Promise((r) => setTimeout(r, 10_000));
        operation = await ai.operations.getVideosOperation({ operation });
        process.stdout.write(`[Veo] Poll #${polls} · done=${operation.done}…\n`);
        if (polls > 60) {
          throw new Error('Timeout esperando el video (10 minutos).');
        }
      }

      const videos = operation.response?.generatedVideos ?? [];
      if (videos.length === 0) {
        console.error('[Veo] Operación terminó sin videos:', JSON.stringify(operation, null, 2));
        throw new Error('Sin videos generados (puede ser un filtro de safety).');
      }

      const generated = videos[0];
      console.log('[Veo] Descargando video…');
      await ai.files.download({
        file: generated.video,
        downloadPath: OUTPUT_PATH,
      });

      const stat = await fs.stat(OUTPUT_PATH);
      console.log(`\n✓ Video guardado en public/${OUTPUT_NAME} (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
      return;
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Veo] ${model} falló: ${msg}`);
      if (/PERMISSION_DENIED|not enabled|not found|quota|UNAVAILABLE|safety|Sin videos|filtro/i.test(msg)) {
        console.log('[Veo] Intentando con el siguiente modelo…');
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new Error('Ningún modelo de Veo respondió.');
}

main().catch((err) => {
  console.error('\n✗ Falló la generación:', err);
  process.exit(1);
});
