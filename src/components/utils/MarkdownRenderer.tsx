import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../contexts';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { theme } = useTheme();
  const syntaxTheme = theme === 'dark' ? vscDarkPlus : prism;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-lg dark:prose-invert max-w-none"
      components={{
        h1: ({ node, ...props }) => (
          <h1 id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} {...props} className="text-3xl font-bold mt-8 mb-4" />
        ),
        h2: ({ node, ...props }) => (
          <h2 id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} {...props} className="text-2xl font-bold mt-8 mb-4" />
        ),
        h3: ({ node, ...props }) => (
          <h3 id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} {...props} className="text-xl font-bold mt-6 mb-3" />
        ),
        h4: ({ node, ...props }) => (
          <h4 id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} {...props} className="text-lg font-bold mt-6 mb-3" />
        ),
        p: ({ node, ...props }) => <p {...props} className="my-4" />,
        a: ({ node, ...props }) => (
          <a {...props} className="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer" />
        ),
        ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 my-4" />,
        ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 my-4" />,
        li: ({ node, ...props }) => <li {...props} className="mb-1" />,
        blockquote: ({ node, ...props }) => (
          <blockquote {...props} className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-6" />
        ),
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className="my-6 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-200">
                <span className="text-xs font-mono">{match[1]}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                  className="text-xs hover:text-white transition-colors"
                >
                  Copy
                </button>
              </div>
              <SyntaxHighlighter
                language={match[1]}
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  borderRadius: '0 0 0.5rem 0.5rem',
                  padding: '1.5rem',
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm" {...props}>
              {children}
            </code>
          );
        },
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-6">
            <table {...props} className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" />
          </div>
        ),
        thead: ({ node, ...props }) => <thead {...props} className="bg-gray-100 dark:bg-gray-800" />,
        tbody: ({ node, ...props }) => <tbody {...props} className="divide-y divide-gray-200 dark:divide-gray-800" />,
        tr: ({ node, ...props }) => <tr {...props} className="hover:bg-gray-50 dark:hover:bg-gray-900" />,
        th: ({ node, ...props }) => (
          <th {...props} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" />
        ),
        td: ({ node, ...props }) => <td {...props} className="px-6 py-4 whitespace-nowrap text-sm" />,
        img: ({ node, ...props }) => (
          <img {...props} className="max-w-full h-auto rounded-lg my-6" loading="lazy" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;