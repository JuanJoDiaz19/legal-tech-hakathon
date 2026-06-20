# Elenchos — Frontend

Plataforma legal-tech construida durante el Legal Tech Hackathon. Permite a abogados crear casos, subir documentos y obtener un análisis asistido por IA (viabilidad, hechos, fuentes, memo y consultas en lenguaje natural).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (auth, base de datos y storage) vía `@supabase/ssr`
- **Google Gemini / Vertex AI** (`@google/genai`) para análisis y chat sobre el caso
- **HLS.js** para el video manifiesto del landing
- **react-markdown** + `remark-gfm` para renderizar respuestas de IA

## Estructura

```
app/
  page.tsx                 # Landing
  login/                   # Autenticación con Supabase
  dashboard/
    page.tsx               # Listado de casos del usuario
    casos/
      nuevo/               # Wizard de creación de caso (multi-step)
      [id]/resultado/      # Vista de análisis del caso (hechos, viabilidad, memo, fuentes, consulta)
  api/
    casos/[id]/consultar/  # Endpoint de chat/consulta contra Gemini
components/landing/        # Secciones del landing (Hero, Features, Manifiesto, etc.)
lib/
  api.ts                   # Helpers de fetch hacia la API interna
  draftStore.ts            # Estado temporal del wizard de caso
  vertex.ts                # Cliente de Gemini / Vertex AI
supabase/                  # Esquemas SQL (casos, documentos, análisis, chat, usuarios)
utils/supabase/            # Clientes de Supabase (server/browser)
middleware.ts              # Refresco de sesión de Supabase
scripts/                   # Generación de assets (video hero, imágenes de features) con IA
```

## Requisitos

- Node.js 20+
- Cuenta de Supabase con los esquemas de `supabase/*.sql` aplicados
- Credenciales de Google Gen AI / Vertex AI

## Variables de entorno

Crea un archivo `.env.local` en la raíz:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GOOGLE_GENAI_API_KEY=
# o, si usas Vertex AI:
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_LOCATION=
```

## Puesta en marcha

```bash
npm install
npm run dev
```

La app queda disponible en [http://localhost:3000](http://localhost:3000).

## Scripts

| Script           | Descripción                                       |
| ---------------- | ------------------------------------------------- |
| `npm run dev`    | Servidor de desarrollo de Next.js                 |
| `npm run build`  | Build de producción                               |
| `npm run start`  | Servidor de producción                            |
| `npm run lint`   | Lint con ESLint                                   |

## Base de datos

Los esquemas SQL están en `supabase/`. Ejecútalos en el SQL editor de Supabase en este orden:

1. `create-users.sql`
2. `cases-schema.sql`
3. `case-documents-schema.sql`
4. `analysis-schema.sql`
5. `chat-schema.sql`

## Flujo principal

1. El usuario inicia sesión en `/login`.
2. En `/dashboard` crea un caso nuevo mediante el wizard (`/dashboard/casos/nuevo`) subiendo documentos.
3. El backend procesa el caso y se almacena el análisis en Supabase.
4. En `/dashboard/casos/[id]/resultado` se visualiza el análisis y se pueden hacer consultas conversacionales con Gemini sobre el caso.
