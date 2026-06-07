'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface CalculatorCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  accentColor?: string;
}

export default function CalculatorCard({ icon, title, description, href, accentColor = 'from-electric-blue to-neon-green' }: CalculatorCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link href={href} className="block group h-full">
        <div className="glass-card p-6 h-full relative overflow-hidden flex flex-col">
          {/* Gradient accent line at top */}
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${accentColor} opacity-70 group-hover:opacity-100 transition-opacity`} />

          {/* Sheen sweep on hover */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
            <div className="absolute -top-1/2 -left-1/3 h-[200%] w-1/3 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[450%]" />
          </div>

          {/* Icon */}
          <div className="relative mb-5">
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentColor} blur-lg opacity-40 group-hover:opacity-70 transition-opacity`} />
            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${accentColor} flex items-center justify-center text-2xl shadow-lg ring-1 ring-white/10 group-hover:scale-105 transition-transform`}>
              {icon}
            </div>
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-electric-blue transition-colors font-[family-name:var(--font-display)] tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed flex-1">
            {description}
          </p>

          {/* Arrow */}
          <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-electric-blue opacity-70 group-hover:opacity-100 transition-opacity">
            <span>Calculate</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Background glow on hover */}
          <div className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${accentColor} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
        </div>
      </Link>
    </motion.div>
  );
}
