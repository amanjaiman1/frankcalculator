import type { AccentToken } from '@/lib/blog';

/**
 * Literal accent-class maps for the blog UI.
 *
 * Tailwind v4 scans source files for complete class strings, so every class
 * an accent can resolve to must appear literally somewhere. Keeping them in
 * this map (rather than building `text-${accent}` at runtime) guarantees the
 * JIT generates them — including opacity-modified variants like `/10`.
 */
export interface AccentClasses {
  text: string;
  bg: string;
  softBg: string;
  border: string;
  ring: string;
  gradient: string;
}

const MAP: Record<AccentToken, AccentClasses> = {
  'electric-blue': {
    text: 'text-electric-blue',
    bg: 'bg-electric-blue',
    softBg: 'bg-electric-blue/10',
    border: 'border-electric-blue/30',
    ring: 'ring-electric-blue/30',
    gradient: 'from-electric-blue to-accent-cyan',
  },
  'neon-green': {
    text: 'text-neon-green',
    bg: 'bg-neon-green',
    softBg: 'bg-neon-green/10',
    border: 'border-neon-green/30',
    ring: 'ring-neon-green/30',
    gradient: 'from-neon-green to-electric-blue',
  },
  'hot-orange': {
    text: 'text-hot-orange',
    bg: 'bg-hot-orange',
    softBg: 'bg-hot-orange/10',
    border: 'border-hot-orange/30',
    ring: 'ring-hot-orange/30',
    gradient: 'from-hot-orange to-electric-pink',
  },
  'vivid-purple': {
    text: 'text-vivid-purple',
    bg: 'bg-vivid-purple',
    softBg: 'bg-vivid-purple/10',
    border: 'border-vivid-purple/30',
    ring: 'ring-vivid-purple/30',
    gradient: 'from-vivid-purple to-electric-blue',
  },
  'electric-pink': {
    text: 'text-electric-pink',
    bg: 'bg-electric-pink',
    softBg: 'bg-electric-pink/10',
    border: 'border-electric-pink/30',
    ring: 'ring-electric-pink/30',
    gradient: 'from-electric-pink to-hot-orange',
  },
  'accent-cyan': {
    text: 'text-accent-cyan',
    bg: 'bg-accent-cyan',
    softBg: 'bg-accent-cyan/10',
    border: 'border-accent-cyan/30',
    ring: 'ring-accent-cyan/30',
    gradient: 'from-accent-cyan to-neon-green',
  },
};

export function accentClasses(accent: string): AccentClasses {
  return MAP[(accent as AccentToken)] ?? MAP['electric-blue'];
}

/** Category → accent token, so index cards can color themselves consistently. */
export const CATEGORY_ACCENT: Record<string, AccentToken> = {
  'Workers Comp': 'vivid-purple',
  Loans: 'electric-blue',
  'Credit & Debt': 'electric-pink',
  Investing: 'neon-green',
  Retirement: 'neon-green',
  'Personal Finance': 'accent-cyan',
};
