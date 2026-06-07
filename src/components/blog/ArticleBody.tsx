'use client';

import { motion } from 'framer-motion';
import type { ContentBlock } from '@/lib/blog';
import { renderRichText } from './RichText';
import BlogCalculatorCta from './BlogCalculatorCta';
import { accentClasses } from './blogStyles';

/** Stable, URL-friendly anchor id from a heading string. */
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function ArticleBody({
  blocks,
  accent,
}: {
  blocks: ContentBlock[];
  accent: string;
}) {
  const a = accentClasses(accent);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={i}
                id={slugifyHeading(block.text)}
                className="scroll-mt-24 text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] tracking-tight pt-6"
              >
                {block.text}
              </h2>
            );

          case 'subheading':
            return (
              <h3
                key={i}
                id={slugifyHeading(block.text)}
                className="scroll-mt-24 text-xl font-semibold text-white font-[family-name:var(--font-display)] pt-2"
              >
                {block.text}
              </h3>
            );

          case 'paragraph':
            return (
              <p key={i} className="text-[15px] sm:text-base text-gray-300/90 leading-relaxed">
                {renderRichText(block.text)}
              </p>
            );

          case 'list':
            return block.ordered ? (
              <ol key={i} className="space-y-2.5 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-[15px] text-gray-300/90 leading-relaxed">
                    <span
                      className={`shrink-0 mt-0.5 flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${a.softBg} ${a.text}`}
                    >
                      {j + 1}
                    </span>
                    <span>{renderRichText(item)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="space-y-2.5 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-[15px] text-gray-300/90 leading-relaxed">
                    <span className={`shrink-0 mt-2 w-1.5 h-1.5 rounded-full ${a.bg}`} />
                    <span>{renderRichText(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'callout':
            return (
              <motion.aside
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4 }}
                className={`glass-card p-5 my-2 border ${a.border}`}
              >
                <div className="flex gap-3">
                  <span className={`shrink-0 text-xl ${a.text}`}>💡</span>
                  <div>
                    {block.title && (
                      <p className="text-sm font-semibold text-white mb-1">{block.title}</p>
                    )}
                    <p className="text-sm text-gray-300/90 leading-relaxed">
                      {renderRichText(block.text)}
                    </p>
                  </div>
                </div>
              </motion.aside>
            );

          case 'quote':
            return (
              <blockquote
                key={i}
                className={`relative my-4 pl-5 pr-4 py-4 rounded-r-xl ${a.softBg} border-l-2 ${a.border}`}
              >
                <p className="text-base sm:text-lg text-white font-[family-name:var(--font-display)] leading-snug">
                  {renderRichText(block.text)}
                </p>
                {block.cite && <cite className="block mt-2 text-xs text-gray-400 not-italic">— {block.cite}</cite>}
              </blockquote>
            );

          case 'stats':
            return (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                {block.items.map((stat, j) => (
                  <div key={j} className="glass-card p-4 text-center">
                    <p className={`text-xl sm:text-2xl font-bold font-[family-name:var(--font-display)] ${a.text}`}>
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            );

          case 'takeaways':
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4 }}
                className="glass-card p-6 my-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-1.5 h-1.5 rounded-full ${a.bg}`} />
                  <span className={`text-xs uppercase tracking-[0.18em] ${a.text}`}>Key Takeaways</span>
                </div>
                <ul className="space-y-2.5">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-[15px] text-gray-300/90 leading-relaxed">
                      <svg
                        className={`shrink-0 mt-0.5 w-5 h-5 ${a.text}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{renderRichText(item)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );

          case 'calculatorCta':
            return (
              <BlogCalculatorCta key={i} slug={block.slug} heading={block.heading} text={block.text} />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
