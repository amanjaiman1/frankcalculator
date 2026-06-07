'use client';

import { useState } from 'react';
import type { PdfReport } from '@/lib/pdfReport';

interface ExportPdfButtonProps {
  /** Lazily build the report from the latest state at click time. */
  getReport: () => PdfReport;
  /** Base filename slug, e.g. "personal-loan". The date + extension are added. */
  fileSlug: string;
  label?: string;
}

/**
 * On-brand "Download PDF" button. jsPDF is browser-only, so it is imported
 * dynamically inside the click handler to stay clear of SSR / static export.
 */
export default function ExportPdfButton({
  getReport,
  fileSlug,
  label = 'Download PDF',
}: ExportPdfButtonProps) {
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');

  const handleClick = async () => {
    if (state === 'working') return;
    setState('working');
    try {
      if (typeof window === 'undefined') throw new Error('not in browser');
      const { generateCalculatorPdf } = await import('@/lib/pdfReport');
      const report = getReport();
      const date = new Date().toISOString().slice(0, 10);
      generateCalculatorPdf(report, `frankcalculator-${fileSlug}-${date}.pdf`);
      setState('done');
      setTimeout(() => setState('idle'), 2200);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 2600);
    }
  };

  const text =
    state === 'working'
      ? 'Preparing…'
      : state === 'done'
      ? 'Downloaded!'
      : state === 'error'
      ? 'Try again'
      : label;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === 'working'}
      aria-label="Download a PDF report"
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-vivid-purple/40 bg-vivid-purple/5 px-4 py-2 text-sm font-medium text-vivid-purple transition-colors hover:border-vivid-purple hover:bg-vivid-purple/10 disabled:opacity-70"
    >
      {/* sheen sweep on hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      {state === 'working' ? (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : state === 'done' ? (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-2.5-2.5M12 16l2.5-2.5M4 6a2 2 0 012-2h6l6 6v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
          />
        </svg>
      )}
      <span className="relative">{text}</span>
    </button>
  );
}
