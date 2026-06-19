import type { WizardDraft } from '../NewCaseWizard';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const SECTIONS: Array<{ key: keyof WizardDraft; label: string; required: boolean }> = [
  { key: 'demanda', label: 'Demanda', required: true },
  { key: 'prueba', label: 'Prueba', required: false },
  { key: 'anexos', label: 'Anexos', required: false },
  { key: 'poderes', label: 'Poderes', required: false },
];

export function StepReview({ draft }: { draft: WizardDraft }) {
  const totalFiles = SECTIONS.reduce((sum, s) => sum + draft[s.key].length, 0);
  const totalBytes = SECTIONS.reduce(
    (sum, s) => sum + draft[s.key].reduce((b, f) => b + f.size, 0),
    0,
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-fg mb-1">Resumen</h2>
        <p className="text-sm text-fg-muted">
          Revisa los archivos antes de crear el caso. {totalFiles} archivo
          {totalFiles === 1 ? '' : 's'} en total · {formatBytes(totalBytes)}.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {SECTIONS.map((section) => {
          const files = draft[section.key];
          const empty = files.length === 0;

          return (
            <div
              key={section.key}
              className="bg-bg border border-line rounded-[var(--radius-card)] p-4"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-fg">{section.label}</h3>
                  <span
                    className={`inline-flex items-center px-2 h-5 text-[10px] font-semibold uppercase tracking-wide border rounded-[var(--radius-button)] ${
                      section.required
                        ? 'bg-accent-soft text-fg border-accent-line'
                        : 'bg-transparent text-fg-faint border-line'
                    }`}
                  >
                    {section.required ? 'Obligatorio' : 'Opcional'}
                  </span>
                </div>
                <span className="text-xs text-fg-muted">
                  {empty
                    ? 'Sin archivos'
                    : `${files.length} ${files.length === 1 ? 'archivo' : 'archivos'}`}
                </span>
              </div>

              {empty ? (
                <p className="text-xs text-fg-faint">
                  {section.required
                    ? 'Debes subir al menos un archivo en este paso.'
                    : 'No subiste archivos en este paso.'}
                </p>
              ) : (
                <ul className="flex flex-col gap-1.5 mt-3">
                  {files.map((f, idx) => (
                    <li
                      key={`${f.name}-${idx}`}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-fg truncate">{f.name}</span>
                      <span className="shrink-0 text-xs text-fg-faint">
                        {formatBytes(f.size)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
