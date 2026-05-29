import type { Kpis } from './types.ts';

/** Returns a new Kpis with each delta added on top of `current`. Pure. */
export function applyDelta(current: Kpis, delta: Partial<Kpis>): Kpis {
  const next = { ...current };
  for (const [k, dv] of Object.entries(delta)) {
    if (typeof dv === 'number') next[k] = (next[k] ?? 0) + dv;
  }
  return next;
}

/** Returns integer percent change from `initial` to `current`. 0 if initial is 0. */
export function percentChange(initial: number, current: number): number {
  if (initial === 0) return 0;
  return Math.round(((current - initial) / initial) * 100);
}
