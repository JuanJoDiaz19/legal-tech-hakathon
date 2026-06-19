'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';

const MAX_FILE_SIZE_MB = 50;

export const ACCEPT_PROFILES = {
  documents: {
    accept: '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp',
    hint: 'PDF, DOC, DOCX, TXT, PNG, JPG, WEBP',
  },
  media: {
    accept:
      '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.gif,.mp4,.mov,.webm,.mp3,.wav,.m4a,.ogg',
    hint: 'Imágenes, videos, audios y documentos',
  },
} as const;

export type AcceptProfile = keyof typeof ACCEPT_PROFILES;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

type FileKind = 'image' | 'video' | 'audio' | 'doc';

function fileKind(file: File): FileKind {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  return 'doc';
}

function FileIcon({ kind }: { kind: FileKind }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (kind === 'image')
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    );
  if (kind === 'video')
    return (
      <svg {...common}>
        <rect x="2" y="6" width="14" height="12" rx="2" />
        <path d="m22 8-6 4 6 4z" />
      </svg>
    );
  if (kind === 'audio')
    return (
      <svg {...common}>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export function FileUploadStep({
  title,
  description,
  required,
  acceptProfile,
  files,
  onFilesChange,
}: {
  title: string;
  description: string;
  required: boolean;
  acceptProfile: AcceptProfile;
  files: File[];
  onFilesChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profile = ACCEPT_PROFILES[acceptProfile];

  function addFiles(incoming: FileList | File[]) {
    const list = Array.from(incoming);
    const existingKeys = new Set(files.map(fileKey));
    const tooBig = list.find((f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024);

    if (tooBig) {
      setError(`"${tooBig.name}" supera el máximo de ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setError(null);
    const deduped = list.filter((f) => !existingKeys.has(fileKey(f)));
    onFilesChange([...files, ...deduped]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files) addFiles(event.dataTransfer.files);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!dragging) setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function removeFile(key: string) {
    onFilesChange(files.filter((f) => fileKey(f) !== key));
  }

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-semibold text-fg">{title}</h2>
          <span
            className={`inline-flex items-center px-2 h-5 text-[10px] font-semibold uppercase tracking-wide border rounded-[var(--radius-button)] ${
              required
                ? 'bg-accent-soft text-fg border-accent-line'
                : 'bg-transparent text-fg-faint border-line'
            }`}
          >
            {required ? 'Obligatorio' : 'Opcional'}
          </span>
        </div>
        <p className="text-sm text-fg-muted">{description}</p>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={[
          'group relative cursor-pointer rounded-[var(--radius-card)] border-2 border-dashed overflow-hidden',
          'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'px-6 py-12 flex flex-col items-center justify-center text-center gap-3',
          dragging
            ? 'border-accent bg-accent-soft scale-[1.01]'
            : 'border-line bg-bg hover:border-fg-muted hover:bg-surface/40',
        ].join(' ')}
      >
        <div
          aria-hidden
          className={[
            'pointer-events-none absolute inset-0 transition-opacity duration-300',
            dragging ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          style={{
            background:
              'radial-gradient(circle at center, rgba(128, 24, 23, 0.18) 0%, transparent 60%)',
          }}
        />

        <div
          className={[
            'relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300',
            dragging
              ? 'bg-accent border border-accent text-fg scale-110'
              : 'bg-surface border border-line text-fg-muted group-hover:text-fg group-hover:border-fg-muted',
          ].join(' ')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={['transition-transform duration-300', dragging ? '-translate-y-0.5' : ''].join(' ')}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <div className="relative">
          <p className="text-sm font-medium text-fg">
            {dragging ? (
              <span className="text-accent">Suelta para anexar al expediente</span>
            ) : (
              <>
                Arrastra archivos aquí o{' '}
                <span className="text-accent">haz click para seleccionarlos</span>
              </>
            )}
          </p>
          <p className="text-xs text-fg-faint mt-1">
            {profile.hint} · Máx {MAX_FILE_SIZE_MB} MB por archivo
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={profile.accept}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium text-fg-muted uppercase tracking-wide">
              {files.length} {files.length === 1 ? 'archivo' : 'archivos'} · {formatBytes(totalSize)}
            </h3>
            <button
              type="button"
              onClick={() => onFilesChange([])}
              className="text-xs text-fg-muted hover:text-fg transition-colors"
            >
              Quitar todos
            </button>
          </div>

          <ul className="flex flex-col gap-2">
            {files.map((file) => {
              const key = fileKey(file);
              const kind = fileKind(file);
              return (
                <li
                  key={key}
                  className="flex items-center justify-between gap-3 bg-bg border border-line rounded-[var(--radius-button)] px-3 py-2.5 animate-file-in transition-colors hover:border-fg-muted"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 w-8 h-8 rounded-[var(--radius-button)] bg-surface border border-line flex items-center justify-center text-fg-muted">
                      <FileIcon kind={kind} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-fg truncate">{file.name}</p>
                      <p className="text-xs text-fg-faint">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(key)}
                    aria-label={`Quitar ${file.name}`}
                    className="shrink-0 inline-flex items-center justify-center w-8 h-8 bg-transparent text-fg-muted border border-line rounded-[var(--radius-button)] transition-colors hover:text-fg hover:border-fg-muted"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
