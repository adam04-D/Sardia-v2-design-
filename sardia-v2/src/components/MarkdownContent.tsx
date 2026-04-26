import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { Components } from 'react-markdown';

// Sanitization schema — strict allowlist on top of rehype-sanitize defaults.
// We intentionally drop image and link rel/target overrides; the renderer
// supplies them. Keeps editorial freedom (headings, blockquotes, footnotes,
// tables) without giving content an injection surface.
const SCHEMA = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), 'target', 'rel'],
  },
};

// Component overrides — every block-level element gets the literary type
// scale and rhythm of the surrounding article. Inline code stays mono;
// links open in a new tab when external.
const components: Components = {
  h1: (props) => (
    <h1 className="font-serif text-3xl md:text-4xl text-primary font-bold mt-12 mb-6 leading-[1.3]" {...props} />
  ),
  h2: (props) => (
    <h2 className="font-serif text-2xl md:text-3xl text-primary font-bold mt-10 mb-4 leading-[1.4]" {...props} />
  ),
  h3: (props) => (
    <h3 className="font-serif text-xl md:text-2xl text-primary font-bold mt-8 mb-3" {...props} />
  ),
  p: (props) => <p className="mb-6" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-r-4 border-accent/40 pr-6 my-8 font-serif italic text-text-muted text-xl leading-[2.0]" {...props} />
  ),
  ul: (props) => <ul className="list-disc list-inside space-y-2 my-6 pr-4" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside space-y-2 my-6 pr-4" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  hr: () => <hr className="my-12 border-accent/20" />,
  a: ({ href, children, ...rest }) => {
    const external = !!href && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent transition-colors"
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  },
  code: ({ children, ...rest }) => (
    <code className="font-mono text-sm bg-stone-100 px-1.5 py-0.5 rounded" {...rest}>{children}</code>
  ),
  pre: (props) => (
    <pre className="font-mono text-sm bg-stone-900 text-stone-100 p-4 rounded-2xl overflow-x-auto my-6" {...props} />
  ),
  em: (props) => <em className="italic" {...props} />,
  strong: (props) => <strong className="font-bold text-text-main" {...props} />,
  table: (props) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-right border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="font-sans font-bold text-primary border-b-2 border-accent/30 px-4 py-2 text-right" {...props} />
  ),
  td: (props) => (
    <td className="border-b border-stone-200 px-4 py-2" {...props} />
  ),
};

export default function MarkdownContent({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeSanitize, SCHEMA]]}
      components={components}
    >
      {source}
    </ReactMarkdown>
  );
}
