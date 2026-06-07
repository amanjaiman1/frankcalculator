'use client';

import { useState } from 'react';

interface CopyButtonProps {
  /** A function so the summary is computed lazily from latest state. */
  getText: () => string;
  label?: string;
}

/**
 * Copies a plain-text summary to the clipboard. Guarded for SSR / unsupported
 * environments — falls back silently if the clipboard API is unavailable.
 */
export default function CopyButton({ getText, label = 'Copy summary' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = getText();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Clipboard unavailable (e.g. insecure context) — fail gracefully.
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 text-sm text-electric-blue border border-electric-blue/30 hover:border-electric-blue hover:bg-electric-blue/5 px-4 py-2 rounded-lg transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {copied ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        )}
      </svg>
      {copied ? 'Copied!' : label}
    </button>
  );
}
