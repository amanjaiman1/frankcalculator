'use client';

import { useState } from 'react';
import { clamp, parseNumberInput } from '@/lib/utils';

export type AccentColor =
  | 'electric-blue'
  | 'neon-green'
  | 'hot-orange'
  | 'vivid-purple'
  | 'electric-pink'
  | 'accent-cyan';

// Literal class maps so Tailwind's JIT scanner can discover every variant.
const TEXT: Record<AccentColor, string> = {
  'electric-blue': 'text-electric-blue',
  'neon-green': 'text-neon-green',
  'hot-orange': 'text-hot-orange',
  'vivid-purple': 'text-vivid-purple',
  'electric-pink': 'text-electric-pink',
  'accent-cyan': 'text-accent-cyan',
};

const ACCENT: Record<AccentColor, string> = {
  'electric-blue': 'accent-electric-blue',
  'neon-green': 'accent-neon-green',
  'hot-orange': 'accent-hot-orange',
  'vivid-purple': 'accent-vivid-purple',
  'electric-pink': 'accent-electric-pink',
  'accent-cyan': 'accent-accent-cyan',
};

const FOCUS_BORDER: Record<AccentColor, string> = {
  'electric-blue': 'focus:border-electric-blue',
  'neon-green': 'focus:border-neon-green',
  'hot-orange': 'focus:border-hot-orange',
  'vivid-purple': 'focus:border-vivid-purple',
  'electric-pink': 'focus:border-electric-pink',
  'accent-cyan': 'focus:border-accent-cyan',
};

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  accent?: AccentColor;
  /** Optional formatter for the inline display value (e.g. currency). */
  format?: (value: number) => string;
  /** Small captions shown beneath the slider ends. */
  minLabel?: string;
  maxLabel?: string;
  /** Prefix/suffix rendered inside the number box, e.g. "$" or "%". */
  prefix?: string;
  suffix?: string;
}

/**
 * A slider paired with an editable number box. Dragging the slider and typing
 * in the box stay in sync; blank/invalid typing is treated gracefully and the
 * value is clamped to [min, max] on blur.
 */
export default function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  accent = 'electric-blue',
  format,
  minLabel,
  maxLabel,
  prefix,
  suffix,
}: SliderInputProps) {
  const [draft, setDraft] = useState<string | null>(null);

  // While the box is being edited we show the user's raw `draft`; otherwise we
  // mirror the canonical `value` prop. This keeps the slider and box in sync
  // without an effect (blank/invalid input is tolerated mid-edit).
  const display = draft ?? String(value);

  const handleText = (raw: string) => {
    setDraft(raw);
    onChange(parseNumberInput(raw, 0));
  };

  const handleBlur = () => {
    const clamped = clamp(parseNumberInput(draft ?? String(value), min), min, max);
    setDraft(null);
    onChange(clamped);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <label className="text-gray-300 text-sm">
          {label}
          {format && (
            <span className={`ml-2 font-semibold ${TEXT[accent]}`}>{format(value)}</span>
          )}
        </label>
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-2 text-xs text-gray-500 pointer-events-none">{prefix}</span>
          )}
          <input
            type="number"
            value={display}
            onChange={(e) => handleText(e.target.value)}
            onBlur={handleBlur}
            step={step}
            className={`w-28 bg-white/5 border border-white/10 text-white text-sm rounded-lg py-1.5 ${
              prefix ? 'pl-5' : 'pl-2.5'
            } ${suffix ? 'pr-6' : 'pr-2.5'} text-right focus:outline-none transition-colors ${FOCUS_BORDER[accent]}`}
          />
          {suffix && (
            <span className="absolute right-2 text-xs text-gray-500 pointer-events-none">{suffix}</span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamp(value, min, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer ${ACCENT[accent]}`}
      />
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
