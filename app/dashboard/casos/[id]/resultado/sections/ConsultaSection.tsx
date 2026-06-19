'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Send, Loader2, Sparkles, User } from 'lucide-react';
import type { AnalisisHechos, AnalisisJuridico } from '@/lib/api';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
};

interface Props {
  hechos?: AnalisisHechos;
  analisis?: AnalisisJuridico | null;
  caseTitle: string;
}

const SUGERENCIAS = [
  '¿Cuáles son los riesgos procesales más relevantes?',
  '¿Qué pruebas conviene solicitar?',
  '¿Cómo cuestiono la liquidación de perjuicios?',
  '¿Qué causales de exoneración son más viables?',
];

export function ConsultaSection({ hechos, analisis, caseTitle }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function buildAssistantStub(question: string): string {
    const partes: string[] = [];
    partes.push(
      `Sobre **"${caseTitle}"** — y con base en el análisis ya generado:`,
    );
    if (analisis?.regimen?.etiqueta_legible) {
      partes.push(
        `· El régimen identificado es ${analisis.regimen.etiqueta_legible}, con consecuencias probatorias específicas para la defensa.`,
      );
    }
    if (hechos?.resumen_factico) {
      const corto = hechos.resumen_factico.slice(0, 220);
      partes.push(`· Resumen fáctico considerado: ${corto}${hechos.resumen_factico.length > 220 ? '…' : ''}`);
    }
    partes.push(
      `· Para responder con precisión a "${question}", es necesario conectar este panel con el backend de consultas. Mientras tanto, revisa las pestañas de Análisis, Hechos y Fuentes — ya contienen el insumo estructurado para esta pregunta.`,
    );
    return partes.join('\n\n');
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    };
    const pendingMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Analizando el expediente…',
      pending: true,
    };
    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setInput('');
    setBusy(true);

    await new Promise((r) => setTimeout(r, 900));

    setMessages((prev) =>
      prev.map((m) =>
        m.id === pendingMsg.id
          ? { ...m, content: buildAssistantStub(text), pending: false }
          : m,
      ),
    );
    setBusy(false);
  }

  function handleSugerencia(s: string) {
    setInput(s);
  }

  return (
    <div className="flex flex-col gap-5 min-h-[480px]">
      <header className="flex items-start justify-between gap-3 pb-4 border-b border-line">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-fg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.8} />
            Consultar análisis
          </h2>
          <p className="text-[13px] text-fg-muted mt-1 text-justify max-w-[640px]">
            Pregunta sobre los hechos, riesgos, cuantía, fuentes o estrategia del caso. El chatbot
            tiene contexto del expediente analizado por Elenchos.
          </p>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto max-h-[520px] flex flex-col gap-4 pr-2"
      >
        {messages.length === 0 && (
          <div className="bg-bg/40 border border-dashed border-line rounded-[var(--radius-card)] p-6">
            <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-fg-muted mb-3">
              Comienza por aquí
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGERENCIAS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSugerencia(s)}
                  className="text-left text-[13px] leading-snug text-fg bg-surface/60 border border-line rounded-[var(--radius-button)] px-3 py-2.5 transition-all duration-200 hover:border-accent-line hover:bg-surface hover:-translate-y-0.5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2 pt-4 border-t border-line">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            rows={2}
            placeholder="Pregunte sobre los hechos, riesgos, cuantía, fuentes o estrategia del caso…"
            className="w-full resize-none bg-bg border border-line rounded-[var(--radius-button)] px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint transition-colors focus:border-accent focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="h-[44px] inline-flex items-center gap-2 px-4 bg-accent text-fg border border-accent rounded-[var(--radius-button)] text-sm font-semibold transition-colors hover:bg-accent-hover hover:border-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Enviar
        </button>
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <span
        className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full border ${
          isUser
            ? 'bg-bg border-line text-fg-muted'
            : 'bg-accent-soft border-accent-line text-accent'
        }`}
      >
        {isUser ? <User className="w-4 h-4" strokeWidth={1.6} /> : <Sparkles className="w-4 h-4" strokeWidth={1.8} />}
      </span>
      <div
        className={`flex-1 max-w-[680px] ${
          isUser
            ? 'bg-accent-soft border border-accent-line'
            : 'bg-bg border border-line'
        } rounded-[var(--radius-card)] p-4`}
      >
        {message.pending ? (
          <div className="flex items-center gap-2 text-sm text-fg-muted">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {message.content}
          </div>
        ) : (
          <div className="text-[14px] leading-7 text-fg whitespace-pre-wrap text-justify">
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
}
