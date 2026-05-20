/**
 * Shared formatting helpers for the interactive calculators.
 * Pure functions, unit-tested in format.test.ts.
 */

// Intl emits non-breaking ( ) or narrow non-breaking ( ) spaces as
// group/currency separators. Normalise them to a regular space so output is
// predictable across Node/browser ICU builds.
const normSpace = (s: string) => s.replace(/[  ]/g, ' ');

/** Format a number as euros, es-ES locale (e.g. 1234.5 -> "1.234,50 €"). */
export function formatEUR(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) return '—';
  return normSpace(
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      useGrouping: true,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value)
  );
}

/** Format a ratio (0.155 -> "15,5 %"). Pass already-scaled values with scaled=false. */
export function formatPercent(value: number, fractionDigits = 1, scaled = true): string {
  if (!Number.isFinite(value)) return '—';
  const pct = scaled ? value * 100 : value;
  return `${normSpace(
    pct.toLocaleString('es-ES', {
      useGrouping: true,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })
  )} %`;
}

/** Plain es-ES number (e.g. 1234.5 -> "1.234,5"). */
export function formatNumber(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) return '—';
  return normSpace(
    value.toLocaleString('es-ES', {
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: fractionDigits,
    })
  );
}

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Parse a user-typed es-ES number string ("1.234,5" -> 1234.5). Returns NaN if invalid. */
export function parseESNumber(input: string): number {
  if (typeof input !== 'string') return NaN;
  const cleaned = input.trim().replace(/\./g, '').replace(',', '.');
  if (cleaned === '') return NaN;
  return Number(cleaned);
}
