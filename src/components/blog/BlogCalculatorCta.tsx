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
 * In-article call-to-action that links to one of the site's calculators.
 * Pulls the calculator's name/path/accent from the shared SEO registry so it
 * always stays in sync with the tool it promotes.
 */
export default function BlogCalculatorCta({
  slug,
  heading,
  text,
}: {
  slug: string;
  heading?: string;
  text?: string;
}) {
  const calc = getCalculator(slug);
  const a = accentClasses(calc.accent);
  const emoji = CALC_EMOJI[slug] ?? '🧮';

  return (
    <div className={`glass-card relative overflow-hidden p-6 sm:p-7 my-8 border ${a.border}`}>
      {/* accent top line */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${a.gradient} opacity-80`} />
      {/* ambient glow */}
      <div className={`pointer-events-none absolute -right-16 -top-16 w-48 h-48 rounded-full ${a.softBg} blur-3xl`} />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="relative shrink-0">
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${a.gradient} blur-lg opacity-40`} />
          <div
            className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-2xl ring-1 ring-white/10`}
          >
            {emoji}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <span className={`text-[11px] uppercase tracking-[0.18em] ${a.text}`}>Free Tool</span>
          <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-display)] mt-1">
            {heading ?? `Try the ${calc.name}`}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed mt-1.5">
            {text ?? calc.description}
          </p>
        </div>

        <Link
          href={calc.path}
          className="glow-button shrink-0 px-5 py-2.5 text-sm whitespace-nowrap"
        >
          Open Calculator
        </Link>
      </div>
    </div>
  );
}
