/** Parse a `#5` (1-based) URL hash into a 0-based slide index, clamped to range. Garbage -> 0. */
export function slideIndexFromHash(hash: string, total: number): number {
  const m = /^#?(\d{1,4})$/.exec(hash.trim());
  if (!m || total < 1) return 0;
  return Math.max(0, Math.min(total - 1, Number(m[1]) - 1));
}
