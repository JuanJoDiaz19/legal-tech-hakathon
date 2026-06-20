'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Send, Loader2, Sparkles, User } from 'lucide-react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage as DbChatMessage } from '../ResultadoView';

const chatComponents: Components = {
  p: ({ children }) => (
    <p className="my-2 first:mt-0 last:mb-0 text-justify">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 my-2 flex flex-col gap-1 marker:text-fg-faint">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 my-2 flex flex-col gap-1 marker:text-fg-faint">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-fg">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => (
    <h3 className="text-[15px] font-semibold text-fg mt-3 mb-1.5">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="text-[15px] font-semibold text-fg mt-3 mb-1.5">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="text-sm font-semibold text-fg mt-3 mb-1">{children}</h4>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 pl-3 border-l-2 border-accent text-fg-muted italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="bg-surface border border-line rounded px-1.5 py-0.5 text-[12.5px] font-mono">
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-[var(--radius-button)] border border-line">
      <table className="w-full text-[13px]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-fg-muted px-3 py-2 bg-surface">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 align-top border-t border-line">{children}</td>
  ),
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
};

interface Props {
  caseId: string;
  caseTitle: string;
  initialMessages: DbChatMessage[];
}

const SUGERENCIAS = [
  '¿Cuáles son los riesgos procesales más relevantes?',
  '¿Qué pruebas conviene solicitar?',
  '¿Cómo cuestiono la liquidación de perjuicios?',
  '¿Qué causales de exoneración son más viables?',
];

export function ConsultaSection({ caseId, caseTitle, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(() =>
    initialMessages.map((m) => ({ id: m.id, role: m.role, content: m.content })),
  );
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    };
    const assistantId = crypto.randomUUID();
    const pendingMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: 'Analizando el expediente…',
      pending: true,
    };
    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setInput('');
    setBusy(true);

    try {
      const res = await fetch(
        `/api/casos/${encodeURIComponent(caseId)}/consultar`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: text }),
        },
      );

      if (!res.ok || !res.body) {
        let msg = `El servidor respondió ${res.status}.`;
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {
          /* respuesta sin JSON */
        }
        throw new Error(msg);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      let firstChunk = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const current = acc;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: current, pending: false }
              : m,
          ),
        );
        firstChunk = false;
      }

      if (firstChunk || !acc.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: 'No se recibió respuesta del modelo.',
                  pending: false,
                }
              : m,
          ),
        );
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al consultar el análisis.';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `⚠️ ${msg}`, pending: false }
            : m,
        ),
      );
    } finally {
      setBusy(false);
    }
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
        ) : isUser ? (
          <div className="text-[14px] leading-7 text-fg whitespace-pre-wrap text-justify">
            {message.content}
          </div>
        ) : (
          <div className="text-[14px] leading-7 text-fg">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={chatComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}