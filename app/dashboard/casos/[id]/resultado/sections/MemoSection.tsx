import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-fg mt-2 mb-6 pb-3 border-b border-line">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-fg mt-10 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold uppercase tracking-wide text-fg-muted mt-7 mb-2">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-fg mt-5 mb-1.5">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-[15px] leading-7 text-fg my-3 text-justify">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 my-3 flex flex-col gap-1.5 text-[15px] leading-7 text-fg marker:text-fg-faint">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 my-3 flex flex-col gap-1.5 text-[15px] leading-7 text-fg marker:text-fg-faint">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-fg">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-fg">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 pl-4 border-l-2 border-accent bg-bg/40 py-2 pr-3 text-[15px] leading-7 text-fg-muted italic rounded-r-[var(--radius-button)] text-justify">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-line" />,
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
  code: ({ className, children }) => {
    const isBlock = /language-/.test(className ?? '');
    if (isBlock) {
      return (
        <code className="block bg-bg border border-line rounded-[var(--radius-button)] p-3 text-xs font-mono text-fg overflow-x-auto whitespace-pre">
          {children}
        </code>
      );
    }
    return (
      <code className="bg-bg border border-line rounded px-1.5 py-0.5 text-[13px] font-mono text-fg">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <div className="my-3">{children}</div>,
  table: ({ children }) => (
    <div className="my-5 overflow-x-auto rounded-[var(--radius-card)] border border-line">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-bg">{children}</thead>,
  tbody: ({ children }) => (
    <tbody className="divide-y divide-line">{children}</tbody>
  ),
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className="text-left text-xs font-semibold uppercase tracking-wide text-fg-muted px-4 py-2.5">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 align-top text-[14px] leading-6 text-fg">{children}</td>
  ),
};

export function MemoSection({ markdown }: { markdown: string | null }) {
  if (!markdown) {
    return (
      <p className="text-sm text-fg-muted">
        El backend no devolvió un memorando estructurado para este caso.
      </p>
    );
  }
  return (
    <article className="max-w-3xl prose-justify">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
