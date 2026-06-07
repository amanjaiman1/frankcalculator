'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const calculatorLinks = [
  { name: 'Personal Loan', href: '/calculators/personal-loan', icon: '💰' },
  { name: 'Compound Interest', href: '/calculators/compound-interest', icon: '📈' },
  { name: 'Debt Payoff', href: '/calculators/debt-payoff', icon: '🎯' },
  { name: 'Business Loan', href: '/calculators/business-loan', icon: '🏢' },
  { name: 'Credit Card Payoff', href: '/calculators/credit-card-payoff', icon: '💳' },
  { name: 'SIP Calculator', href: '/calculators/sip', icon: '📊' },
  { name: 'Retirement', href: '/calculators/retirement', icon: '🏖️' },
  { name: "Workers' Comp", href: '/calculators/workers-compensation', icon: '⚖️' },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isCalculators = pathname?.startsWith('/calculators');
  const isBlog = pathname?.startsWith('/blog');

  // Close menus whenever the route changes (the global page-transition
  // interceptor suppresses link onClick handlers, so we close here instead).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setIsMobileMenuOpen(false);
      setIsDropdownOpen(false);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Glass layer */}
      <div className="absolute inset-0 bg-dark-base/70 backdrop-blur-2xl border-b border-white/5" />
      {/* Top sheen line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative flex items-center justify-center">
              {/* glow halo */}
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-electric-blue to-neon-green blur-md opacity-50 group-hover:opacity-90 transition-opacity" />
              <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-electric-blue via-accent-cyan to-neon-green flex items-center justify-center font-bold text-dark-base text-base font-[family-name:var(--font-display)] shadow-lg">
                F
              </span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-bold text-white group-hover:text-electric-blue transition-colors font-[family-name:var(--font-display)] tracking-tight">
                Frank
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-gray-500 group-hover:text-neon-green/80 transition-colors">
                Calculator
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            <Link
              href="/"
              className={`relative text-sm transition-colors link-underline ${
                isHome ? 'text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
              {isHome && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-electric-blue to-neon-green"
                />
              )}
            </Link>

            {/* Calculators Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className={`relative text-sm transition-colors flex items-center gap-1 ${
                  isCalculators ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Calculators
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {isCalculators && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-electric-blue to-neon-green"
                  />
                )}
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-full right-0 mt-3 w-[34rem] max-w-[calc(100vw-2rem)] p-3 rounded-2xl border border-white/10 bg-dark-card shadow-2xl shadow-black/60 ring-1 ring-electric-blue/10"
                  >
                    {/* accent top line */}
                    <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-electric-blue/60 to-transparent" />

                    <div className="flex items-center justify-between px-2 pt-1 pb-2.5">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-electric-blue">
                        All Calculators
                      </p>
                      <span className="text-[10px] text-gray-500">8 free tools</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {calculatorLinks.map((link) => {
                        const active = pathname === link.href;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`group/item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all border ${
                              active
                                ? 'bg-electric-blue/15 text-white border-electric-blue/40'
                                : 'text-gray-200 border-transparent hover:text-white hover:bg-white/[0.06] hover:border-white/10'
                            }`}
                          >
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.06] text-base group-hover/item:scale-110 transition-transform shrink-0">
                              {link.icon}
                            </span>
                            <span className="flex-1 font-medium leading-tight">{link.name}</span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* footer row → blog cross-link */}
                    <Link
                      href="/blog"
                      className="mt-2 flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors border border-white/5"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">📚</span>
                        Read the finance blog
                      </span>
                      <svg className="w-4 h-4 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/blog"
              className={`relative text-sm transition-colors link-underline ${
                isBlog ? 'text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Blog
              {isBlog && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-electric-blue to-neon-green"
                />
              )}
            </Link>

            <Link href="/#calculators" className="glow-button px-5 py-2 text-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden relative border-t border-white/5 bg-dark-base/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Blog
              </Link>
              <div className="pt-3 pb-1 px-3 text-[10px] text-gray-500 uppercase tracking-[0.2em]">Calculators</div>
              {calculatorLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
              <Link
                href="/#calculators"
                onClick={() => setIsMobileMenuOpen(false)}
                className="glow-button w-full px-5 py-3 text-sm mt-3"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom accent border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent" />
    </nav>
  );
}
