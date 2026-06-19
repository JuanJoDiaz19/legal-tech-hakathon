type Fuente = { fuente: string; pagina?: number | string; categoria?: string };

export function FuentesSection({
  fuentes,
}: {
  fuentes?: Record<string, Fuente>;
}) {
  const entries = Object.entries(fuentes ?? {});
  if (entries.length === 0) {
    return (
      <p className="text-sm text-fg-muted">
        El análisis no incluyó citas trazables (RAG no devolvió fuentes).
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {entries.map(([id, f]) => (
        <li
          key={id}
          className="bg-bg border border-line rounded-[var(--radius-button)] p-3 text-sm text-fg"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 h-5 text-[10px] font-semibold uppercase tracking-wide border border-line rounded-[var(--radius-button)] text-fg-muted">
              {id}
            </span>
            {f.categoria && (
              <span className="text-[11px] text-fg-faint">{f.categoria}</span>
            )}
          </div>
          <div className="text-sm text-fg">{f.fuente}</div>
          {f.pagina !== undefined && (
            <div className="text-[11px] text-fg-faint mt-0.5">Página/sección: {f.pagina}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
