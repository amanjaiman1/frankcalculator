'use client';

import { motion } from 'framer-motion';
import { getCalculator } from '@/lib/seo';

/**
 * Renders the keyword-rich educational content + FAQ for a calculator,
 * driven entirely by the shared SEO config so the on-page FAQ stays in
 * sync with the FAQPage JSON-LD emitted by the route's layout.
 *
 * Matches the Workers' Comp page's visual pattern (eyebrow chip, gradient
 * heading, glass-card articles, <details> accordions) and reuses the
 * calculator's accent color.
 */
export default function CalculatorContent({ slug }: { slug: string }) {
  const calc = getCalculator(slug);
  const accent = calc.accent;

  return (
    <>
      {/* Educational content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-8 space-y-6"
      >
        <div className="text-center mb-2">
          <span className={`eyebrow-chip text-xs uppercase tracking-[0.18em] text-${accent}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-${accent}`} />
            The Frank Guide
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] mt-4">
            {calc.guideHeading}
          </h2>
          {calc.intro && (
            <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm leading-relaxed">{calc.intro}</p>
          )}
        </div>

        {calc.sections.map((section) => (
          <article key={section.heading} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-3 font-[family-name:var(--font-display)]">
              {section.heading}
            </h3>
            <div className="text-sm text-gray-400 leading-relaxed space-y-3">
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3 max-w-3xl mx-auto">
          {calc.faqs.map((faq) => (
            <details key={faq.q} className="glass-card p-5 group">
              <summary className="flex items-center justify-between cursor-pointer list-none text-white font-medium">
                <span>{faq.q}</span>
                <span className={`text-${accent} text-xl transition-transform group-open:rotate-45`}>+</span>
              </summary>
              <p className="text-sm text-gray-400 leading-relaxed mt-3">{faq.a}</p>
            </details>
          ))}
        </div>
      </motion.div>
    </>
  );
}
