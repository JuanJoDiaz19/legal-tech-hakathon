'use client';

import { useState } from 'react';
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
  const [currentStep, setCurrentStep] = useState(1);
  const [draft, setDraft] = useState<WizardDraft>(EMPTY_DRAFT);

  const isFirst = currentStep === 1;
  const isLast = currentStep === STEPS.length;

  const activeUpload = UPLOAD_STEPS.find((s) => s.id === currentStep);
  const canAdvance = activeUpload?.required ? draft[activeUpload.key].length > 0 : true;

  function goNext() {
    if (!isLast && canAdvance) setCurrentStep((s) => s + 1);
  }

  function goBack() {
    if (!isFirst) setCurrentStep((s) => s - 1);
  }

  function updateFiles(key: keyof WizardDraft, files: File[]) {
    setDraft((d) => ({ ...d, [key]: files }));
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
        {isLast && <StepReview draft={draft} />}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirst}
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
          onClick={goNext}
          disabled={isLast || !canAdvance}
          className={BTN_PRIMARY}
          title={!canAdvance ? 'Debes subir al menos un archivo para continuar' : undefined}
        >
          {isLast ? 'Crear caso' : 'Siguiente'}
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
