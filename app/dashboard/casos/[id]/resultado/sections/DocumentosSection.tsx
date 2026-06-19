'use client';

import { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  File as FileIcon,
  ExternalLink,
  Download,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import type { CaseDocument } from '../ResultadoView';

const BUCKET = 'case-documents';
const SIGNED_URL_TTL = 3600;

type Categoria = CaseDocument['categoria'];

const CATEGORIA_ORDER: readonly Categoria[] = [
  'demanda',
  'pruebas',
  'anexos',
  'poderes',
] as const;

const CATEGORIA_LABEL: Record<Categoria, string> = {
  demanda: 'Demanda',
  pruebas: 'Pruebas',
  anexos: 'Anexos',
  poderes: 'Poderes',
};

const CATEGORIA_DESC: Record<Categoria, string> = {
  demanda: 'Documento principal que da inicio al caso',
  pruebas: 'Material probatorio aportado',
  anexos: 'Material adicional acompañante',
  poderes: 'Representación legal de las partes',
};

function formatSize(bytes: number | null | undefined): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function iconFor(mime: string | null) {
  if (!mime) return FileIcon;
  if (mime.startsWith('image/')) return ImageIcon;
  if (mime.startsWith('audio/')) return Music;
  if (mime.startsWith('video/')) return Video;
  if (mime === 'application/pdf' || mime.includes('word') || mime.includes('text')) return FileText;
  return FileIcon;
}

export function DocumentosSection({ documents }: { documents: CaseDocument[] }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="bg-bg border border-line rounded-[var(--radius-card)] p-8 text-center flex flex-col items-center gap-3">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-line text-fg-faint">
          <FolderOpen className="w-5 h-5" strokeWidth={1.6} />
        </span>
        <p className="text-sm text-fg-muted max-w-md">
          No se han subido documentos para este caso. Los casos creados antes de habilitar el
          almacenamiento de archivos no tienen documentos asociados.
        </p>
      </div>
    );
  }

  const grouped = new Map<Categoria, CaseDocument[]>();
  for (const doc of documents) {
    if (!grouped.has(doc.categoria)) grouped.set(doc.categoria, []);
    grouped.get(doc.categoria)!.push(doc);
  }

  const orderedGroups = CATEGORIA_ORDER.filter((c) => grouped.has(c)).map(
    (c) => [c, grouped.get(c)!] as const,
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
            Documentos cargados
          </h2>
          <p className="text-[13px] text-fg-faint mt-1">
            Archivos originales que se aportaron al crear el caso.
          </p>
        </div>
        <span className="text-[11px] text-fg-faint tabular-nums">
          {documents.length} {documents.length === 1 ? 'archivo' : 'archivos'}
        </span>
      </header>

      {orderedGroups.map(([categoria, docs]) => (
        <GroupBlock key={categoria} categoria={categoria} docs={docs} />
      ))}
    </div>
  );
}

function GroupBlock({ categoria, docs }: { categoria: Categoria; docs: CaseDocument[] }) {
  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between gap-3 pb-2 border-b border-line">
        <div>
          <h3 className="text-base font-semibold text-fg leading-tight">
            {CATEGORIA_LABEL[categoria]}
          </h3>
          <p className="text-[11px] text-fg-faint mt-0.5">{CATEGORIA_DESC[categoria]}</p>
        </div>
        <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 text-[11px] font-semibold text-fg-muted bg-surface border border-line rounded-full">
          {docs.length}
        </span>
      </header>

      <ul className="flex flex-col gap-2">
        {docs.map((doc) => (
          <DocumentoCard key={doc.id} doc={doc} />
        ))}
      </ul>
    </section>
  );
}

function DocumentoCard({ doc }: { doc: CaseDocument }) {
  const [busy, setBusy] = useState<'open' | 'download' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const Icon = iconFor(doc.mime_type);

  async function handleOpen() {
    if (busy) return;
    setBusy('open');
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: signErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(doc.storage_path, SIGNED_URL_TTL);
      if (signErr || !data?.signedUrl) {
        throw new Error(signErr?.message ?? 'No se pudo generar el enlace');
      }
      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al abrir el documento');
    } finally {
      setBusy(null);
    }
  }

  async function handleDownload() {
    if (busy) return;
    setBusy('download');
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: signErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(doc.storage_path, SIGNED_URL_TTL, { download: doc.filename });
      if (signErr || !data?.signedUrl) {
        throw new Error(signErr?.message ?? 'No se pudo generar el enlace');
      }
      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = doc.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al descargar el documento');
    } finally {
      setBusy(null);
    }
  }

  return (
    <li className="group bg-bg border border-line rounded-[var(--radius-card)] p-4 flex flex-col sm:flex-row gap-3 transition-all duration-200 hover:border-accent-line hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
      <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-button)] bg-surface border border-line text-fg-muted group-hover:text-accent group-hover:border-accent-line transition-colors">
        <Icon className="w-5 h-5" strokeWidth={1.6} />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-fg leading-tight break-words">
          {doc.filename}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-fg-faint">
          <span className="tabular-nums">{formatSize(doc.size_bytes)}</span>
          <span>·</span>
          <span>{formatDate(doc.created_at)}</span>
          {doc.mime_type && (
            <>
              <span>·</span>
              <span className="font-mono uppercase">{shortMime(doc.mime_type)}</span>
            </>
          )}
        </div>
        {error && (
          <p className="text-[11px] text-rose-400 mt-1.5" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
        <button
          type="button"
          onClick={handleOpen}
          disabled={busy !== null}
          className="inline-flex items-center gap-1.5 h-9 px-3 text-[12px] font-semibold border border-line text-fg-muted bg-transparent rounded-[var(--radius-button)] transition-colors hover:text-fg hover:border-fg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy === 'open' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.8} />
          )}
          Abrir
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy !== null}
          className="inline-flex items-center gap-1.5 h-9 px-3 text-[12px] font-semibold border border-accent-line text-accent bg-accent-soft rounded-[var(--radius-button)] transition-colors hover:bg-accent hover:text-fg hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy === 'download' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" strokeWidth={1.8} />
          )}
          Descargar
        </button>
      </div>
    </li>
  );
}

function shortMime(mime: string): string {
  if (mime === 'application/pdf') return 'pdf';
  if (mime.startsWith('image/')) return mime.slice(6);
  if (mime.startsWith('audio/')) return mime.slice(6);
  if (mime.startsWith('video/')) return mime.slice(6);
  if (mime.includes('word')) return 'docx';
  if (mime.includes('text')) return 'txt';
  return mime.split('/')[1] ?? mime;
}
