'use client';

import { useMemo, useState } from 'react';
import {
  Pencil,
  Check,
  X,
  Bell,
  AlertTriangle,
  CalendarClock,
  UploadCloud,
  MailCheck,
  Hourglass,
  Info,
} from 'lucide-react';
import type { AnalisisHechos } from '@/lib/api';

type Partes = { demandantes?: string[]; demandados_potenciales?: string[] };

type Estado = 'Activo' | 'En revisión' | 'Pendiente de contestación' | 'Cerrado';

const ESTADOS: readonly Estado[] = [
  'Activo',
  'En revisión',
  'Pendiente de contestación',
  'Cerrado',
];

const ESTADO_TONE: Record<Estado, string> = {
  Activo: 'bg-accent-soft text-accent border-accent-line',
  'En revisión': 'bg-accent-soft text-accent border-accent-line',
  'Pendiente de contestación': 'bg-accent-soft text-accent border-accent-line',
  Cerrado: 'bg-bg text-fg-faint border-line',
};

function deriveTitle(hechos?: AnalisisHechos, fallback?: string): string {
  const partes = hechos?.partes as Partes | undefined;
  const dem = partes?.demandantes?.[0]?.trim();
  const dmd = partes?.demandados_potenciales?.[0]?.trim();
  if (dem && dmd) return `${dem} vs. ${dmd}`;
  if (fallback && fallback.trim() && !/\.(pdf|docx?|jpe?g|png|txt)$/i.test(fallback)) {
    return fallback;
  }
  return 'Caso sin identificación completa';
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const fecha = d.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
  });
  const hora = d.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${fecha} · ${hora}`;
}

function diasHasta(target: string): number | null {
  if (!target) return null;
  const d = new Date(target);
  if (!Number.isFinite(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

interface Props {
  initialTitle: string;
  client: string | null;
  initialStatus: string;
  createdAt: string;
  hechos?: AnalisisHechos;
  topRight?: React.ReactNode;
}

export function CaseHeader({
  initialTitle,
  client,
  initialStatus,
  createdAt,
  hechos,
  topRight,
}: Props) {
  const derivedTitle = useMemo(() => deriveTitle(hechos, initialTitle), [hechos, initialTitle]);

  const [titleOverride, setTitleOverride] = useState<string | null>(null);
  const title = titleOverride ?? derivedTitle;
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');

  const initialEstado: Estado = (ESTADOS as readonly string[]).includes(initialStatus)
    ? (initialStatus as Estado)
    : 'Activo';
  const [estado, setEstado] = useState<Estado>(initialEstado);

  const [fechaNotificacion, setFechaNotificacion] = useState<string>('');
  const [fechaLimite, setFechaLimite] = useState<string>('');
  const [recordatorioDias, setRecordatorioDias] = useState<number>(3);
  const [recordatorioActivo, setRecordatorioActivo] = useState(false);

  const diasRestantes = diasHasta(fechaLimite);
  const proximo =
    diasRestantes !== null && diasRestantes >= 0 && diasRestantes <= 7;
  const vencido = diasRestantes !== null && diasRestantes < 0;

  return (
    <div className="flex flex-col gap-8 py-2">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                className="text-2xl md:text-3xl font-semibold tracking-tight text-fg bg-bg border border-accent-line rounded-[var(--radius-button)] px-3 py-1.5 flex-1 focus:outline-none focus:border-accent"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  const next = titleDraft.trim();
                  setTitleOverride(next || null);
                  setEditingTitle(false);
                }}
                className="inline-flex items-center justify-center w-9 h-9 bg-accent text-fg border border-accent rounded-[var(--radius-button)] hover:bg-accent-hover"
                aria-label="Guardar título"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setEditingTitle(false)}
                className="inline-flex items-center justify-center w-9 h-9 bg-transparent text-fg-muted border border-line rounded-[var(--radius-button)] hover:text-fg hover:border-fg-muted"
                aria-label="Cancelar edición"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-fg">
                {title}
              </h1>
              <button
                type="button"
                onClick={() => {
                  setTitleDraft(title);
                  setEditingTitle(true);
                }}
                className="mt-1 inline-flex items-center justify-center w-7 h-7 text-fg-faint hover:text-accent transition-colors shrink-0"
                aria-label="Editar título"
                title="Editar título"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {client && (
            <p className="text-sm text-fg-muted mt-1">
              <span className="text-fg-faint">Cliente · </span>
              {client}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {topRight}
          <EstadoSelector value={estado} onChange={setEstado} />
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-x-16 gap-y-8 py-4 border-y border-line/60">
        <DateField
          icon={UploadCloud}
          label="Cargado"
          readOnly
          value={formatDateTime(createdAt)}
        />
        <DateField
          icon={MailCheck}
          label="Notificación"
          value={fechaNotificacion}
          onChange={setFechaNotificacion}
          hint="Ley 2213 y CGP — valida con el abogado"
        />
        <DateField
          icon={Hourglass}
          label="Límite de contestación"
          value={fechaLimite}
          onChange={setFechaLimite}
          tone={vencido ? 'rose' : proximo ? 'amber' : undefined}
          badge={
            fechaLimite && diasRestantes !== null
              ? vencido
                ? {
                    icon: AlertTriangle,
                    text: `Vencida · ${Math.abs(diasRestantes)}d`,
                    tone: 'rose' as const,
                  }
                : proximo
                ? {
                    icon: CalendarClock,
                    text: `${diasRestantes}d`,
                    tone: 'amber' as const,
                  }
                : null
              : null
          }
        />
      </div>

      {fechaLimite && (
        <div className="inline-flex items-center gap-2 bg-bg/40 border border-line rounded-full pl-3 pr-1.5 py-1 w-fit">
          <Bell className="w-3.5 h-3.5 text-accent shrink-0" strokeWidth={1.8} />
          <span className="text-xs text-fg-muted">Avisar</span>
          <input
            type="number"
            min={1}
            max={60}
            value={recordatorioDias}
            onChange={(e) => setRecordatorioDias(Math.max(1, Number(e.target.value) || 1))}
            className="w-10 bg-bg border border-line rounded-full px-2 py-0.5 text-center text-xs tabular-nums focus:outline-none focus:border-accent"
            aria-label="Días antes del vencimiento"
          />
          <span className="text-xs text-fg-muted">d antes</span>
          <button
            type="button"
            onClick={() => setRecordatorioActivo((v) => !v)}
            className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
              recordatorioActivo
                ? 'bg-accent text-fg hover:bg-accent-hover'
                : 'bg-transparent text-fg-muted hover:text-fg hover:bg-bg'
            }`}
            aria-label={recordatorioActivo ? 'Recordatorio activo' : 'Crear recordatorio'}
            title={recordatorioActivo ? 'Recordatorio activo' : 'Crear recordatorio'}
          >
            {recordatorioActivo ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
}

function EstadoSelector({
  value,
  onChange,
}: {
  value: Estado;
  onChange: (v: Estado) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 px-3 h-8 text-[11px] font-semibold uppercase tracking-wide border rounded-[var(--radius-button)] transition-colors ${ESTADO_TONE[value]}`}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
        {value}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <ul
            role="listbox"
            className="absolute right-0 mt-1.5 z-20 min-w-[220px] bg-surface border border-line rounded-[var(--radius-card)] shadow-[0_12px_30px_rgba(0,0,0,0.45)] py-1.5"
          >
            {ESTADOS.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left text-sm px-3 py-2 transition-colors hover:bg-bg ${
                    opt === value ? 'text-accent font-semibold' : 'text-fg'
                  }`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

type ChipTone = 'amber' | 'rose';
type LucideIcon = typeof UploadCloud;

function DateField({
  icon: Icon,
  label,
  value,
  onChange,
  readOnly,
  tone,
  badge,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  tone?: ChipTone;
  badge?: { icon: LucideIcon; text: string; tone: ChipTone } | null;
  hint?: string;
}) {
  const iconTone =
    tone === 'rose'
      ? 'text-rose-300'
      : tone === 'amber'
      ? 'text-amber-300'
      : 'text-accent';

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-faint">
        <span className={iconTone}>
          <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
        </span>
        <span>{label}</span>
        {hint && (
          <span
            className="text-fg-faint/70 hover:text-fg-muted transition-colors cursor-help"
            title={hint}
            aria-label={hint}
          >
            <Info className="w-3 h-3" strokeWidth={1.8} />
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 min-w-0">
        {readOnly ? (
          <span className="text-sm text-fg tabular-nums whitespace-nowrap">{value}</span>
        ) : (
          <input
            type="date"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            aria-label={label}
            className="bg-transparent text-sm text-fg border-0 p-0 focus:outline-none [color-scheme:dark] tabular-nums w-[140px]"
          />
        )}

        {badge && (
          <span
            className={`shrink-0 inline-flex items-center gap-1 px-1.5 h-5 text-[10px] font-bold tabular-nums rounded-full ${
              badge.tone === 'rose'
                ? 'bg-rose-500/15 text-rose-300'
                : 'bg-amber-500/15 text-amber-300'
            }`}
            aria-label={badge.text}
          >
            <badge.icon className="w-2.5 h-2.5" strokeWidth={2.2} />
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
}
