// src/lib/games/storage.ts
import { browserStorage } from '../storage';

/**
 * Namespaced localStorage wrapper for games. Pass a custom Storage in tests.
 *
 * The islands create it at module level, so the browser storage is resolved on
 * each call, never at creation: with site data blocked, even reading
 * `localStorage` throws, and every read and write degrades to "nothing saved".
 */
export function makeGameStorage<T = unknown>(slug: string, backend?: Storage | null) {
  const stateKey = `pde:game:${slug}:state`;
  const bestKey = `pde:game:${slug}:best`;
  const store = (): Storage | null => (backend === undefined ? browserStorage('local') : backend);
  const read = (key: string): string | null => {
    try { return store()?.getItem(key) ?? null; } catch { return null; }
  };
  const write = (key: string, value: string): void => {
    try { store()?.setItem(key, value); } catch { /* blocked or full: not saved */ }
  };
  return {
    load(): T | null {
      const raw = read(stateKey);
      if (!raw) return null;
      try { return JSON.parse(raw) as T; } catch { return null; }
    },
    save(state: T): void { write(stateKey, JSON.stringify(state)); },
    clear(): void {
      try { store()?.removeItem(stateKey); } catch { /* blocked: nothing to clear */ }
    },
    getBest(): number {
      const raw = read(bestKey);
      const n = raw ? Number(raw) : 0;
      return Number.isFinite(n) ? n : 0;
    },
    setBest(value: number): void {
      const raw = read(bestKey);
      const current = raw ? Number(raw) : 0;
      const best = Number.isFinite(current) ? current : 0;
      if (value > best) write(bestKey, String(Math.round(value)));
    },
  };
}
