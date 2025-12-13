"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ExternalLink } from "lucide-react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import DOMPurify from "dompurify";

/**
 * Markdown Components for Streamdown
 *
 * This module provides customized components for rendering markdown content with syntax highlighting.
 * It uses highlight.js for code syntax highlighting and supports streaming content updates.
 *
 * @example
 * ```tsx
 * import { createMarkdownComponents } from './markdown-components';
 * import { Streamdown } from 'streamdown';
 *
 * const MarkdownRenderer = ({ content }) => {
 *   const components = createMarkdownComponents();
 *   return <Streamdown components={components}>{content}</Streamdown>;
 * };
 * ```
 */

/**
 * Determines if a text block looks like code based on common code patterns
 * @param text - The text to analyze
 * @returns boolean indicating if the text appears to be code
 */
const looksLikeCode = (text: string): boolean => {
  const codeIndicators = [
    /^import\s+/m,
    /^function\s+/m,
    /^class\s+/m,
    /^const\s+/m,
    /^let\s+/m,
    /^var\s+/m,
    /[{}[\]();]/,
    /^\s*\/\//m,
    /^\s*\/\*/m,
    /=>/,
    /^export\s+/m,
  ];
  return codeIndicators.some((pattern) => pattern.test(text));
};

/**
 * Header component for code blocks with language display and copy functionality
 */
const CodeHeader = ({
  language,
  code,
}: {
  language?: string;
  code?: string;
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-t-xl bg-muted px-4 py-2.5 text-xs font-medium border-b border-border">
      <span className="lowercase text-muted-foreground">{language}</span>
      <button
        onClick={copyToClipboard}
        className="p-1.5 rounded-lg hover:bg-card transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
        title="Copy code"
      >
        {!copied ? (
          <Copy className="h-3.5 w-3.5" />
        ) : (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        )}
      </button>
    </div>
  );
};

/**
 * Creates a set of components for use with streamdown
 * @returns Components object for streamdown
 */
export const createMarkdownComponents = (): Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.ComponentType<any>
> => ({
  code: function Code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? "");
    const content = String(children).replace(/\n$/, "");
    const deferredContent = React.useDeferredValue(content);

    const highlighted = React.useMemo(() => {
      if (!match || !looksLikeCode(deferredContent)) return null;
      try {
        return hljs.highlight(deferredContent, { language: match[1] }).value;
      } catch {
        return deferredContent;
      }
    }, [deferredContent, match]);

    if (match && looksLikeCode(content)) {
      return (
        <div className="relative border border-border rounded-xl bg-card max-w-[80ch] text-sm my-4 overflow-hidden">
          <CodeHeader language={match[1]} code={content} />
          <div
            className={cn(
              "overflow-x-auto rounded-b-xl bg-card",
              "[&::-webkit-scrollbar]:w-[6px]",
              "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full",
              "[&::-webkit-scrollbar:horizontal]:h-[4px]",
            )}
          >
            <pre className="p-4 whitespace-pre text-foreground">
              <code
                className={className}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(highlighted ?? content),
                }}
              />
            </pre>
          </div>
        </div>
      );
    }

    return (
      <code
        className={cn(
          "bg-muted px-1.5 py-0.5 rounded-md text-xs font-mono",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },

  /**
   * Paragraph component with minimal vertical margin
   */
  p: ({ children }) => <p className="my-0">{children}</p>,

  /**
   * Heading 1 component with large text and proper spacing
   * Used for main section headers
   */
  h1: ({ children }) => (
    <h1 className="text-xl font-semibold text-foreground mb-3 mt-5 tracking-tight">
      {children}
    </h1>
  ),

  /**
   * Heading 2 component for subsection headers
   * Slightly smaller than h1 with adjusted spacing
   */
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold text-foreground mb-2 mt-4 tracking-tight">
      {children}
    </h2>
  ),

  /**
   * Heading 3 component for minor sections
   * Used for smaller subdivisions within h2 sections
   */
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-foreground mb-2 mt-3">
      {children}
    </h3>
  ),

  /**
   * Heading 4 component for the smallest section divisions
   * Maintains consistent text size with adjusted spacing
   */
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-foreground mb-1.5 mt-2">
      {children}
    </h4>
  ),

  /**
   * Unordered list component with disc-style bullets
   * Indented from the left margin
   */
  ul: ({ children }) => (
    <ul className="list-disc pl-5 my-2 space-y-1 text-foreground">
      {children}
    </ul>
  ),

  /**
   * Ordered list component with decimal numbering
   * Indented from the left margin
   */
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 my-2 space-y-1 text-foreground">
      {children}
    </ol>
  ),

  /**
   * List item component with normal line height
   * Used within both ordered and unordered lists
   */
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,

  /**
   * Blockquote component for quoted content
   * Features a left border and italic text with proper spacing
   */
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent pl-4 italic my-4 text-muted-foreground">
      {children}
    </blockquote>
  ),

  /**
   * Anchor component for links
   * Opens links in new tab with security attributes
   * Includes hover underline effect
   */
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-accent hover:text-accent/80 underline underline-offset-2 decoration-accent/50 hover:decoration-accent transition-colors"
    >
      <span>{children}</span>
      <ExternalLink className="w-3 h-3" />
    </a>
  ),

  /**
   * Horizontal rule component
   * Creates a visual divider with proper spacing
   */
  hr: () => <hr className="my-6 border-border" />,

  /**
   * Table container component
   * Handles overflow for wide tables with proper spacing
   */
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 rounded-xl border border-border">
      <table className="min-w-full">{children}</table>
    </div>
  ),

  /**
   * Table header cell component
   * Features bold text and distinct background
   */
  th: ({ children }) => (
    <th className="border-b border-border px-4 py-2.5 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {children}
    </th>
  ),

  /**
   * Table data cell component
   * Consistent styling with header cells
   */
  td: ({ children }) => (
    <td className="border-b border-border px-4 py-3 text-sm text-foreground">
      {children}
    </td>
  ),
});

/**
 * Pre-created markdown components instance for use across the application.
 */
export const markdownComponents = createMarkdownComponents();
