'use client';

import { motion } from 'framer-motion';
import CalculatorCard from '@/components/CalculatorCard';
import AdPlaceholder from '@/components/AdPlaceholder';

const calculators = [
  {
    icon: '💰',
    title: 'Personal Loan EMI',
    description: 'Calculate your monthly payments, total interest, and plan your personal loan repayment.',
    href: '/calculators/personal-loan',
    accentColor: 'from-electric-blue to-accent-cyan',
  },
  {
    icon: '📈',
    title: 'Compound Interest',
    description: 'See how your money grows over time with the power of compound interest.',
    href: '/calculators/compound-interest',
    accentColor: 'from-neon-green to-electric-blue',
  },
  {
    icon: '🎯',
    title: 'Debt Payoff Planner',
    description: 'Avalanche or snowball? Find the fastest strategy to become debt-free.',
    href: '/calculators/debt-payoff',
    accentColor: 'from-hot-orange to-electric-pink',
  },
  {
    icon: '🏢',
    title: 'Business Loan',
    description: 'Estimate payments for term loans, SBA loans, and lines of credit.',
    href: '/calculators/business-loan',
    accentColor: 'from-vivid-purple to-electric-blue',
  },
  {
    icon: '💳',
    title: 'Credit Card Payoff',
    description: 'Find out when you will be credit card debt-free and how much interest you will pay.',
    href: '/calculators/credit-card-payoff',
    accentColor: 'from-electric-pink to-hot-orange',
  },
  {
    icon: '📊',
    title: 'SIP Calculator',
    description: 'Plan your systematic investment and see projected wealth creation.',
    href: '/calculators/sip',
    accentColor: 'from-neon-green to-vivid-purple',
  },
  {
    icon: '🏖️',
    title: 'Retirement Planner',
    description: 'Calculate your retirement corpus and monthly income based on your savings.',
    href: '/calculators/retirement',
    accentColor: 'from-accent-cyan to-neon-green',
  },
  {
    icon: '⚖️',
    title: "Workers' Compensation",
    description: 'Estimate potential settlement amounts for workers compensation claims.',
    href: '/calculators/workers-compensation',
    accentColor: 'from-vivid-purple to-hot-orange',
  },
];

const features = [
  {
    icon: '⚡',
    title: 'Free & Instant',
    description: 'No sign-ups, no paywalls. Get immediate results without sharing personal data.',
    accent: 'from-electric-blue to-accent-cyan',
  },
  {
    icon: '📊',
    title: 'Visual Results',
    description: 'Beautiful charts and breakdowns that make complex financial data easy to understand.',
    accent: 'from-neon-green to-electric-blue',
  },
  {
    icon: '🧮',
    title: 'Expert Formulas',
    description: 'Industry-standard calculations used by financial professionals worldwide.',
    accent: 'from-vivid-purple to-electric-pink',
  },
];

const marqueeItems = [
  'Loans', 'Investments', 'Compound Interest', 'Retirement', 'Debt Payoff',
  'SIP', 'Credit Cards', 'Business Finance', 'Net Worth', 'Savings',
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Animated background wash */}
        <div className="absolute inset-0 animated-bg" />

        {/* Aurora orbs for depth */}
        <div className="aurora-orb top-[-10%] left-[-5%] w-[34rem] h-[34rem] bg-electric-blue/20" />
        <div className="aurora-orb bottom-[-15%] right-[-5%] w-[30rem] h-[30rem] bg-vivid-purple/20" style={{ animationDelay: '4s' }} />
        <div className="aurora-orb top-[30%] right-[20%] w-[22rem] h-[22rem] bg-neon-green/10" style={{ animationDelay: '8s' }} />

        {/* Particle dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="particle-dot"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                animationDelay: `${(i % 6)}s`,
                animationDuration: `${4 + (i % 4)}s`,
                opacity: 0.25 + (i % 5) * 0.12,
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="flex justify-center mb-7">
              <span className="eyebrow-chip text-xs uppercase tracking-[0.2em] text-electric-blue font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-glow" />
                No BS Financial Tools
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.95] mb-7 font-[family-name:var(--font-display)] tracking-[-0.03em]">
              <span className="text-white text-glow">Financial Clarity,</span>
              <br />
              <span className="gradient-text">Instantly.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop guessing. Start knowing. Free calculators that give you frank answers about loans, investments, and debt payoff strategies.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#calculators" className="glow-button px-8 py-4 text-base">
              Explore Calculators
            </a>
            <a href="#why-us" className="ghost-button px-8 py-4 text-sm">
              Why FrankCalculator?
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '8+', label: 'Calculators' },
              { value: '100%', label: 'Free Forever' },
              { value: '0', label: 'Sign-ups' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card py-4 px-2 text-center">
                <p className="text-2xl sm:text-3xl font-bold gradient-text font-[family-name:var(--font-display)]">{stat.value}</p>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.a
          href="#calculators"
          aria-label="Scroll to calculators"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-electric-blue transition-colors"
        >
          <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <span className="flex items-start justify-center w-5 h-8 rounded-full border border-white/15 p-1">
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-1.5 rounded-full bg-electric-blue"
            />
          </span>
        </motion.a>
      </section>

      {/* Trusted-by marquee strip */}
      <div className="relative border-y border-white/5 bg-white/[0.015] py-5 marquee-mask overflow-hidden">
        <div className="marquee-track gap-10">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-10 text-sm text-gray-500 whitespace-nowrap">
              <span className="font-[family-name:var(--font-display)] tracking-wide">{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-electric-blue/40" />
            </span>
          ))}
        </div>
      </div>

      {/* Ad Placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AdPlaceholder className="max-w-3xl mx-auto h-24" />
      </div>

      {/* Calculators Grid */}
      <section id="calculators" className="py-20 relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="eyebrow-chip text-xs uppercase tracking-[0.18em] text-neon-green mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
              Tools
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white font-[family-name:var(--font-display)] tracking-[-0.02em] mt-4">
              Choose Your <span className="gradient-text">Calculator</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              From personal loans to retirement planning, get instant answers with beautiful visual breakdowns.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {calculators.map((calc) => (
              <CalculatorCard key={calc.href} {...calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider" />

      {/* Ad Placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AdPlaceholder className="max-w-3xl mx-auto h-24" />
      </div>

      {/* Why FrankCalculator Section */}
      <section id="why-us" className="py-20 relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="eyebrow-chip text-xs uppercase tracking-[0.18em] text-vivid-purple mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-vivid-purple" />
              Why Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white font-[family-name:var(--font-display)] tracking-[-0.02em] mt-4">
              Why <span className="gradient-text-warm">FrankCalculator?</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              We believe financial tools should be free, fast, and transparent.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card group p-8 text-center relative overflow-hidden"
              >
                <div className="relative inline-flex mb-5">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.accent} blur-lg opacity-40 group-hover:opacity-70 transition-opacity`} />
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center text-3xl ring-1 ring-white/10 group-hover:scale-105 transition-transform`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 font-[family-name:var(--font-display)] tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
