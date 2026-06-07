import Link from 'next/link';
import { getCalculator } from '@/lib/seo';
import { accentClasses } from './blogStyles';

const CALC_EMOJI: Record<string, string> = {
  'personal-loan': '💰',
  'compound-interest': '📈',
  'debt-payoff': '🎯',
  'business-loan': '🏢',
  'credit-card-payoff': '💳',
  sip: '📊',
  retirement: '🏖️',
  'workers-compensation': '⚖️',
};

/**
 * Grid of calculator cards relevant to an article. Server-safe; pulls
 * names/paths/accents from the shared SEO registry.
 */
export default function RelatedCalculators({ slugs }: { slugs: string[] }) {
  if (!slugs.length) return null;

  return (
    <div className={`grid gap-4 ${slugs.length === 1 ? 'sm:grid-cols-1' : 'sm:grid-cols-2'}`}>
      {slugs.map((slug) => {
        const calc = getCalculator(slug);
        const a = accentClasses(calc.accent);
        return (
          <Link key={slug} href={calc.path} className="block group">
            <div className={`glass-card relative overflow-hidden p-5 h-full border ${a.border}`}>
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${a.gradient} opacity-70 group-hover:opacity-100 transition-opacity`} />
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${a.gradient} blur-md opacity-40 group-hover:opacity-70 transition-opacity`} />
                  <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-xl ring-1 ring-white/10`}>
                    {CALC_EMOJI[slug] ?? '🧮'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white group-hover:text-electric-blue transition-colors font-[family-name:var(--font-display)]">
                    {calc.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    Open calculator
                    <svg
                      className={`w-3.5 h-3.5 ${a.text} opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
