import Link from 'next/link';

const calculatorLinks = [
  { name: 'Personal Loan', href: '/calculators/personal-loan' },
  { name: 'Compound Interest', href: '/calculators/compound-interest' },
  { name: 'Debt Payoff', href: '/calculators/debt-payoff' },
  { name: 'Business Loan', href: '/calculators/business-loan' },
  { name: 'Credit Card Payoff', href: '/calculators/credit-card-payoff' },
  { name: 'SIP Calculator', href: '/calculators/sip' },
  { name: 'Retirement', href: '/calculators/retirement' },
  { name: "Workers' Comp", href: '/calculators/workers-compensation' },
];

const trustBadges = [
  { icon: '🔒', label: 'No Data Stored' },
  { icon: '⚡', label: 'Instant Results' },
  { icon: '🆓', label: '100% Free' },
  { icon: '🚫', label: 'No Sign-ups' },
];

const companyLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Disclaimer', href: '/disclaimer' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-dark-base/60 backdrop-blur-sm overflow-hidden">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vivid-purple/60 to-transparent" />
      {/* Ambient top glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[80%] h-48 bg-vivid-purple/10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Trust badges row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-10 mb-10 border-b border-white/5">
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-electric-blue/30 transition-colors"
            >
              <span className="text-xl">{badge.icon}</span>
              <span className="text-sm text-gray-300">{badge.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="relative flex items-center justify-center">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-electric-blue to-neon-green blur-md opacity-50" />
                <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-electric-blue via-accent-cyan to-neon-green flex items-center justify-center font-bold text-dark-base text-base font-[family-name:var(--font-display)]">
                  F
                </span>
              </span>
              <span className="text-lg font-bold text-white font-[family-name:var(--font-display)] tracking-tight">
                FrankCalculator
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Free, instant financial calculators that give you frank answers — no sign-ups, no hidden fees, no nonsense. Just clarity.
            </p>

            {/* Quick links */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/" className="text-sm text-gray-400 hover:text-electric-blue transition-colors link-underline">
                Home
              </Link>
              <Link href="/blog" className="text-sm text-gray-400 hover:text-electric-blue transition-colors link-underline">
                Blog
              </Link>
              <Link href="/#calculators" className="text-sm text-gray-400 hover:text-electric-blue transition-colors link-underline">
                Calculators
              </Link>
            </div>

            {/* Newsletter-style (visual only) */}
            <div className="mt-6 max-w-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Stay frank</p>
              <div className="flex items-center gap-2 p-1.5 rounded-full border border-white/10 bg-white/[0.02] focus-within:border-electric-blue/40 transition-colors">
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="you@email.com"
                  className="flex-1 bg-transparent px-3 py-1.5 text-sm text-white placeholder:text-gray-600 focus:outline-none"
                />
                <button
                  type="button"
                  className="glow-button px-4 py-1.5 text-xs whitespace-nowrap"
                >
                  Notify Me
                </button>
              </div>
            </div>
          </div>

          {/* Calculator Links */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-[0.15em] mb-4">Calculators</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {calculatorLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-electric-blue transition-colors link-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company / Legal */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-[0.15em] mb-4">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-electric-blue transition-colors link-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer strip */}
        <div className="mt-10 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="text-gray-400 font-medium">Disclaimer:</span> FrankCalculator provides free
            calculators and educational content for informational purposes only. Nothing on this site is
            financial, investment, legal, or tax advice. Results are estimates and may differ from actual
            outcomes. Always consult a qualified professional before making financial decisions. Read our full{' '}
            <Link href="/disclaimer" className="text-electric-blue hover:underline">disclaimer</Link>.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} FrankCalculator. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-glow" />
            Built with transparency in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}
