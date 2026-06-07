'use client';

import { motion } from 'framer-motion';

interface ResultCardProps {
  label: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  accentColor?: string;
}

export default function ResultCard({ label, value, subtitle, trend, accentColor = 'electric-blue' }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card group p-5 relative overflow-hidden"
    >
      {/* Left accent bar */}
      <div className={`absolute top-0 left-0 bottom-0 w-1 bg-${accentColor} opacity-70 group-hover:opacity-100 transition-opacity`} />

      <div className="relative z-10 pl-2">
        <p className="text-[11px] text-gray-400 uppercase tracking-[0.18em] mb-1.5">{label}</p>
        <p className={`text-2xl sm:text-3xl font-bold text-${accentColor} font-[family-name:var(--font-display)] tracking-tight`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1.5">{subtitle}</p>
        )}
        {trend && (
          <div className={`inline-flex items-center gap-1 mt-3 text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${
            trend === 'up' ? 'bg-neon-green/10 text-neon-green ring-neon-green/20' :
            trend === 'down' ? 'bg-hot-orange/10 text-hot-orange ring-hot-orange/20' :
            'bg-gray-500/10 text-gray-400 ring-gray-500/20'
          }`}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trend === 'neutral' && '→'}
            {trend === 'up' ? 'Positive' : trend === 'down' ? 'Attention' : 'Stable'}
          </div>
        )}
      </div>

      {/* Background accent glow */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-${accentColor} opacity-[0.07] group-hover:opacity-[0.14] blur-2xl transition-opacity`} />
    </motion.div>
  );
}
