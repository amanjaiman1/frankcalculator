import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';

/**
 * Renders a string with lightweight inline markup:
 *   - **bold**            → <strong>
 *   - [label](href)       → internal <Link> (href starting with "/") or
 *                            external <a target="_blank">
 *
 * Kept deliberately small and server-safe (no 'use client').
 */

type Token =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'link'; label: string; href: string };

const PATTERN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  PATTERN.lastIndex = 0;
  while ((match = PATTERN.exec(input)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: input.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      tokens.push({ type: 'bold', value: match[1] });
    } else if (match[2] !== undefined && match[3] !== undefined) {
      tokens.push({ type: 'link', label: match[2], href: match[3] });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < input.length) {
    tokens.push({ type: 'text', value: input.slice(lastIndex) });
  }
  return tokens;
}

export function renderRichText(input: string, linkClassName?: string): ReactNode {
  const tokens = tokenize(input);
  return tokens.map((token, i) => {
    if (token.type === 'bold') {
      return (
        <strong key={i} className="font-semibold text-white">
          {token.value}
        </strong>
      );
    }
    if (token.type === 'link') {
      const cls =
        linkClassName ??
        'text-electric-blue underline decoration-electric-blue/40 underline-offset-2 hover:decoration-electric-blue transition-colors';
      const isInternal = token.href.startsWith('/');
      if (isInternal) {
        return (
          <Link key={i} href={token.href} className={cls}>
            {token.label}
          </Link>
        );
      }
      return (
        <a key={i} href={token.href} target="_blank" rel="noopener noreferrer" className={cls}>
          {token.label}
        </a>
      );
    }
    return <Fragment key={i}>{token.value}</Fragment>;
  });
}

export default function RichText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return <span className={className}>{renderRichText(text)}</span>;
}
