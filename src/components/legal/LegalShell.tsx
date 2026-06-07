import type { ReactNode } from 'react';
import Link from 'next/link';

/* Shared presentational primitives for legal / informational pages so the
 * About, Contact, Privacy, Terms and Disclaimer pages all share one look. */

export function LegalShell({
  eyebrow,
  title,
  intro,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <section className="relative pt-24 pb-8 overflow-hidden">
        <div className="aurora-orb top-[-25%] left-[5%] w-[26rem] h-[26rem] bg-electric-blue/12" />
        <div className="aurora-orb top-[-15%] right-[0%] w-[22rem] h-[22rem] bg-vivid-purple/12" style={{ animationDelay: '6s' }} />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-gray-500">
              <li><Link href="/" className="hover:text-gray-300 transition-colors">Home</Link></li>
              <li aria-hidden>/</li>
              <li className="text-gray-400">{title}</li>
            </ol>
          </nav>

          <span className="eyebrow-chip text-xs uppercase tracking-[0.2em] text-electric-blue mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-glow" />
            {eyebrow}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-display)] tracking-[-0.02em] leading-[1.08]">
            {title}
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed mt-4">{intro}</p>
          {updated && <p className="text-xs text-gray-600 mt-4">Last updated: {updated}</p>}
        </div>
      </section>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <div className="section-divider mb-8" />
        <div className="space-y-5">{children}</div>
      </div>
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="scroll-mt-24 text-2xl font-bold text-white font-[family-name:var(--font-display)] tracking-tight pt-6">
      {children}
    </h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] text-gray-300/90 leading-relaxed">{children}</p>;
}

export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] text-gray-300/90 leading-relaxed">
          <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-electric-blue" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
