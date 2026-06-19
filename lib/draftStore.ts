import type { WizardDraft } from '@/app/dashboard/casos/nuevo/NewCaseWizard';

const drafts = new Map<string, WizardDraft>();

export function setDraft(caseId: string, draft: WizardDraft): void {
  drafts.set(caseId, draft);
}

export function takeDraft(caseId: string): WizardDraft | undefined {
  const d = drafts.get(caseId);
  drafts.delete(caseId);
  return d;
}

export function peekDraft(caseId: string): WizardDraft | undefined {
  return drafts.get(caseId);
}
