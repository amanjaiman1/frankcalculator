export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}


/**
 * Clamp a number between a min and max. Treats NaN/Infinity as the min so that
 * blank or malformed number-input values degrade gracefully instead of crashing.
 */
export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Parse raw text from a number input into a finite number. Blank / invalid
 * input resolves to the provided fallback (default 0).
 */
export function parseNumberInput(raw: string, fallback = 0): number {
  if (raw.trim() === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Format a count of months into a friendly "X yr Y mo" string.
 */
export function formatMonths(totalMonths: number): string {
  const safe = Math.max(0, Math.round(totalMonths));
  const years = Math.floor(safe / 12);
  const months = safe % 12;
  if (years === 0) return `${months} mo`;
  if (months === 0) return `${years} yr`;
  return `${years} yr ${months} mo`;
}

/**
 * Add a number of months to a base date and return a friendly label such as
 * "March 2031". Guarded for SSR-safe usage (pure date math, no DOM access).
 */
export function addMonthsLabel(baseDate: Date, months: number): string {
  const d = new Date(baseDate.getTime());
  d.setMonth(d.getMonth() + Math.max(0, Math.round(months)));
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
