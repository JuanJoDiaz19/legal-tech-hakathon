'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { setDraft } from '@/lib/draftStore';
import { Stepper } from './Stepper';
import { FileUploadStep, type AcceptProfile } from './steps/FileUploadStep';
import { StepReview } from './steps/StepReview';

export type WizardDraft = {
  demanda: File[];
  prueba: File[];
  anexos: File[];
  poderes: File[];
};

type UploadStep = {
  id: number;
  key: keyof WizardDraft;
  label: string;
  description: string;
  title: string;
  detail: string;
  required: boolean;
  acceptProfile: AcceptProfile;
};

const UPLOAD_STEPS: readonly UploadStep[] = [
  {
    id: 1,
    key: 'demanda',
    label: 'Demanda',
    description: 'Documento principal',
    title: 'Demanda',
    detail:
      'Sube el escrito de demanda. Es el documento que da inicio al caso y es obligatorio.',
    required: true,
    acceptProfile: 'documents',
  },
  {
    id: 2,
    key: 'prueba',
    label: 'Prueba',
    description: 'Material probatorio',
    title: 'Prueba',
    detail:
      'Documentos, imágenes, videos o audios aportados como prueba. Opcional, pero recomendado para el análisis.',
    required: false,
    acceptProfile: 'media',
  },
  {
    id: 3,
    key: 'anexos',
    label: 'Anexos',
    description: 'Material adicional',
    title: 'Anexos',
    detail:
      'Cualquier material adicional acompañante: imágenes, videos, audios o documentos. Opcional.',
    required: false,
    acceptProfile: 'media',
  },
  {
    id: 4,
    key: 'poderes',
    label: 'Poderes',
    description: 'Representación legal',
    title: 'Poderes',
    detail:
      'Poderes y documentos de representación de las partes. Opcional.',
    required: false,
    acceptProfile: 'documents',
  },
] as const;

const REVIEW_STEP = {
  id: UPLOAD_STEPS.length + 1,
  label: 'Resumen',
  description: 'Revisar y crear',
} as const;

const STEPS = [
  ...UPLOAD_STEPS.map((s) => ({ id: s.id, label: s.label, description: s.description })),
  REVIEW_STEP,
] as const;

const BTN_PRIMARY =
  'h-[40px] inline-flex items-center gap-2 px-5 bg-accent text-fg border border-accent rounded-[var(--radius-button)] text-sm font-semibold transition-colors hover:bg-accent-hover hover:border-accent-hover disabled:opacity-60 disabled:cursor-not-allowed';

const BTN_GHOST =
  'h-[40px] inline-flex items-center gap-2 px-5 bg-transparent text-fg-muted border border-line rounded-[var(--radius-button)] text-sm font-medium transition-colors hover:text-fg hover:border-fg-muted disabled:opacity-40 disabled:cursor-not-allowed';

const EMPTY_DRAFT: WizardDraft = {
  demanda: [],
  prueba: [],
  anexos: [],
  poderes: [],
};

export function NewCaseWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [draft, setLocalDraft] = useState<WizardDraft>(EMPTY_DRAFT);
  const [titulo, setTitulo] = useState('');
  const [cliente, setCliente] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isFirst = currentStep === 1;
  const isLast = currentStep === STEPS.length;

  const activeUpload = UPLOAD_STEPS.find((s) => s.id === currentStep);
  const canAdvance = activeUpload?.required ? draft[activeUpload.key].length > 0 : true;
  const hasDemanda = draft.demanda.length > 0;

  function goNext() {
    if (!isLast && canAdvance) setCurrentStep((s) => s + 1);
  }

  function goBack() {
    if (!isFirst) setCurrentStep((s) => s - 1);
  }

  function updateFiles(key: keyof WizardDraft, files: File[]) {
    setLocalDraft((d) => ({ ...d, [key]: files }));
  }

  async function handleSubmit() {
    if (submitting) return;
    if (!hasDemanda) {
      setSubmitError('Debes subir al menos un archivo en el paso "Demanda".');
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user) {
        throw new Error('No hay sesión activa. Vuelve a iniciar sesión.');
      }
      const titleFinal = titulo.trim() || draft.demanda[0]?.name || 'Nuevo caso';
      const { data, error } = await supabase
        .from('cases')
        .insert({
          title: titleFinal,
          client: cliente.trim() || null,
          status: 'Activo',
          analysis_status: 'pending',
          created_by: userData.user.id,
        })
        .select('id')
        .single();
      if (error || !data) {
        throw new Error(error?.message ?? 'No se pudo crear el caso en la base de datos.');
      }
      setDraft(data.id, draft);
      router.push(`/dashboard/casos/${data.id}/resultado`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido al crear el caso.';
      setSubmitError(msg);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Stepper steps={STEPS} currentStep={currentStep} />

      <div
        key={currentStep}
        className="bg-surface border border-line rounded-[var(--radius-card)] p-6 md:p-8 min-h-[320px] animate-step-in"
      >
        {activeUpload && (
          <FileUploadStep
            title={activeUpload.title}
            description={activeUpload.detail}
            required={activeUpload.required}
            acceptProfile={activeUpload.acceptProfile}
            files={draft[activeUpload.key]}
            onFilesChange={(files) => updateFiles(activeUpload.key, files)}
          />
        )}
        {isLast && (
          <StepReview
            draft={draft}
            titulo={titulo}
            onTituloChange={setTitulo}
            cliente={cliente}
            onClienteChange={setCliente}
            error={submitError}
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirst || submitting}
          className={BTN_GHOST}
          aria-label="Paso anterior"
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
            <path d="m15 18-6-6 6-6" />
          </svg>
          Atrás
        </button>

        <span className="text-xs text-fg-faint">
          Paso {currentStep} de {STEPS.length}
        </span>

        <button
          type="button"
          onClick={isLast ? handleSubmit : goNext}
          disabled={submitting || (!isLast && !canAdvance) || (isLast && !hasDemanda)}
          className={BTN_PRIMARY}
          title={
            isLast
              ? !hasDemanda
                ? 'Debes subir la demanda antes de crear el caso'
                : undefined
              : !canAdvance
              ? 'Debes subir al menos un archivo para continuar'
              : undefined
          }
        >
          {isLast ? (submitting ? 'Creando…' : 'Crear caso') : 'Siguiente'}
          {!isLast && (
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
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
